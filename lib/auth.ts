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
                try {
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

                    // Check if account is locked
                    // Ensure lockoutUntil is a valid date before comparing
                    const now = new Date();
                    if (admin.lockoutUntil && admin.lockoutUntil instanceof Date && admin.lockoutUntil > now) {
                        const minutesLeft = Math.ceil((admin.lockoutUntil.getTime() - now.getTime()) / 60000);
                        logger.warn(`Login blocked: Account locked for ${credentials.email}`);
                        throw new Error(`Account locked. Try again in ${minutesLeft} minutes.`);
                    }

                    const isValid = await bcrypt.compare(credentials.password, admin.passwordHash);

                    if (!isValid) {
                        // Increment failed attempts safely
                        const currentAttempts = typeof admin.failedLoginAttempts === 'number' ? admin.failedLoginAttempts : 0;
                        admin.failedLoginAttempts = currentAttempts + 1;

                        // Lockout logic: 5 failed attempts = 15 minutes lockout
                        if (admin.failedLoginAttempts >= 5) {
                            admin.lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                            // Reset attempts logic: usually we keep the attempts count high or reset? 
                            // If we don't reset, every subsequent failure locks again immediately.
                            // If we reset, they get another 5 tries after lockout. 
                            // Standard: Lockout expires, attempts reset implies they have another 5 tries.
                            admin.failedLoginAttempts = 0;
                        }

                        await admin.save();
                        logger.warn(`Login failed: Invalid password for ${credentials.email}. Attempts: ${admin.failedLoginAttempts}`);

                        if (admin.lockoutUntil && admin.lockoutUntil > new Date()) {
                            throw new Error('Account locked due to too many failed attempts.');
                        }
                        throw new Error('Invalid credentials');
                    }

                    // Reset failed attempts on successful login
                    admin.failedLoginAttempts = 0;
                    admin.lockoutUntil = null; // Use null instead of undefined for Mongoose

                    // Increment session version to invalidate previous sessions
                    const currentVersion = typeof admin.sessionVersion === 'number' ? admin.sessionVersion : 0;
                    admin.sessionVersion = currentVersion + 1;

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
                } catch (error: any) {
                    logger.error(`Authorize error: ${error.message}`);
                    throw new Error(error.message || 'Authentication failed');
                }
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

// Safe export of handler
let handler: any;
try {
    handler = NextAuth(authOptions);
} catch (error) {
    console.error("Error initializing NextAuth:", error);
    handler = () => new Response("Internal Server Error", { status: 500 });
}

export { handler as GET, handler as POST };
