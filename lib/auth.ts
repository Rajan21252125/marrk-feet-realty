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
                } catch (error) {
                    const e = error as Error;
                    logger.error(`Authorize error: ${e.message}`);
                    throw new Error(e.message || 'Authentication failed');
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
                        if (token.sessionVersion && dbUser.sessionVersion && token.sessionVersion !== dbUser.sessionVersion) {
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
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.role = (user as any).role;
                token.id = user.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.isVerified = (user as any).isVerified;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.sessionVersion = (user as any).sessionVersion;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.name = (user as any).name;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.picture = (user as any).profileImage;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                token.companyName = (user as any).companyName;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.error === 'SessionInvalid') {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return { ...session, error: 'SessionInvalid' } as any;
            }

            if (session.user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).role = token.role;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).id = token.id;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).isVerified = token.isVerified;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).name = token.name;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (session.user as any).image = token.picture;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let handler: any;
try {
    handler = NextAuth(authOptions);
} catch (error) {
    console.error("Error initializing NextAuth:", error);
    handler = () => new Response("Internal Server Error", { status: 500 });
}

export { handler as GET, handler as POST };
