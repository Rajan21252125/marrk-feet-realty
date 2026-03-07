import nodemailer from 'nodemailer';
import logger from './logger';
import { getVerificationEmailHtml } from './email-template';
import { SITE_NAME, CONTACT_INFO } from './constants';

// Create a reusable transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/**
 * Utility to handle sending verification emails.
 * Now using Nodemailer for actual delivery.
 */
export async function sendVerificationEmail(email: string, code: string) {
    // Generate the professional HTML content
    const html = getVerificationEmailHtml(code);

    // Check environment
    const isDev = process.env.NODE_ENV === 'development';
    const smtpConfigured =
        Boolean(process.env.SMTP_HOST) &&
        Boolean(process.env.SMTP_USER) &&
        Boolean(process.env.SMTP_PASS);

    try {
        if (!isDev) {
            if (!smtpConfigured) {
                logger.error('[EMAIL ERROR] SMTP configuration is incomplete');
                throw new Error('Email service is not configured');
            }
            // PRODUCTION LOGIC: Actual delivery
            await transporter.sendMail({
                from: process.env.SMTP_FROM || `"${SITE_NAME}" <${CONTACT_INFO.email}>`,
                to: email,
                subject: `Verify Your Identity - ${SITE_NAME}`,
                html: html,
            });

            logger.info('[EMAIL] Verification email sent');
            return;
        }

        // DEVELOPMENT LOGIC:
        // In dev, we log the code and optionally try to send (if credentials are provided)
        logger.info('[DEV EMAIL] Verification code generated');

        // If developer has configured SMTP in dev, send it too
        if (smtpConfigured) {
            await transporter.sendMail({
                from: process.env.SMTP_FROM || `"${SITE_NAME} Admin" <${CONTACT_INFO.email}>`,
                to: email,
                subject: `[DEV] Verify Your Identity - ${SITE_NAME}`,
                html: html,
            });
            logger.info('[DEV EMAIL] Actual email also sent');
        }
    } catch (error) {
        logger.error('[EMAIL ERROR] Failed to send verification email');
        // In dev, we don't throw so the app doesn't crash if SMTP is unconfigured
        if (!isDev || smtpConfigured) throw error;
    }
}
