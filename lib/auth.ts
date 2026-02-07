import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcrypt';
import logger from '@/lib/logger';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password required');
                }

                try {
                    await dbConnect();
                } catch (error) {
                    logger.error(`Database connection failed: ${error}`);
                    throw new Error('Database connection failed');
                }

                const admin = await Admin.findOne({ email: credentials.email });

                if (!admin) {
                    logger.warn(`Login failed: Invalid email ${credentials.email}`);
                    throw new Error('Invalid credentials');
                }

                const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);

                if (!isValid) {
                    logger.warn(`Login failed: Invalid password for ${credentials.email}`);
                    throw new Error('Invalid credentials');
                }

                // Increment session version to invalidate previous sessions
                admin.sessionVersion = (admin.sessionVersion || 0) + 1;
                await admin.save();

                logger.info(`Admin logged in: ${admin.email} (Session v${admin.sessionVersion})`);

                return {
                    id: admin._id.toString(),
                    email: admin.email,
                    role: admin.role,
                    isVerified: admin.isVerified,
                    sessionVersion: admin.sessionVersion,
                    name: admin.name,
                    profileImage: admin.profileImage,
                    companyName: admin.companyName,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            // Update token if trigger is 'update'
            if (trigger === 'update') {
                if (session?.isVerified !== undefined) token.isVerified = session.isVerified;
                if (session?.name !== undefined) token.name = session.name;
                if (session?.image !== undefined) token.picture = session.image; // NextAuth uses 'picture'
                if (session?.companyName !== undefined) token.companyName = session.companyName;
            }

            // Always fetch latest admin data if email exists to ensure role/verification/session is synced
            if (token.email) {
                try {
                    await dbConnect();
                    const dbUser = await Admin.findOne({ email: token.email });
                    if (dbUser) {
                        // Enforce single session: if token version doesn't match DB version, invalidate.
                        // We can't strictly "invalidate" the token here easily without throwing, which might disrupt flow.
                        // But we can update the token state to reflect invalid session.
                        // However, simpler approach: Update token with current DB data.

                        // If token has a sessionVersion and it differs from DB, it means a new login occurred elsewhere.
                        if (token.sessionVersion && dbUser.sessionVersion && token.sessionVersion !== dbUser.sessionVersion) {
                            // This will cause session() callback or middleware to reject it if we handle it there.
                            // For now, let's just sync the data. The UI can handle "logged out" if we clear the user.
                            // Actually, let's just set an error flag or clear the user part.
                            // A common pattern is to just return null/empty, but NextAuth types might complain.
                            // We will just sync. If the user logs in again, they get the new version.
                            // The requirement is "one admin can login at one time". 
                            // So the OLD session (with old version) should fail.

                            return { ...token, error: 'SessionInvalid' };
                        }

                        token.isVerified = dbUser.isVerified;
                        token.role = dbUser.role;
                        token.sessionVersion = dbUser.sessionVersion;
                        token.name = dbUser.name;
                        token.picture = dbUser.profileImage;
                        token.companyName = dbUser.companyName;
                    }
                } catch (error) {
                    console.error('Error fetching user in JWT callback:', error);
                }
            }

            if (user) {
                token.role = (user as any).role;
                token.id = user.id;
                token.isVerified = (user as any).isVerified;
                token.sessionVersion = (user as any).sessionVersion;
                token.name = (user as any).name;
                token.picture = (user as any).profileImage;
                token.companyName = (user as any).companyName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.error === 'SessionInvalid') {
                // Force signout or invalid session effect
                return { ...session, error: 'SessionInvalid' } as any;
            }

            if (session.user) {
                (session.user as any).role = token.role;
                (session.user as any).id = token.id;
                (session.user as any).isVerified = token.isVerified;
                (session.user as any).name = token.name;
                (session.user as any).image = token.picture;
                (session.user as any).companyName = token.companyName;
            }
            return session;
        },
    },
    pages: {
        signIn: '/admin/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
