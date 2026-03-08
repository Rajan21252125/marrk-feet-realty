import { SITE_NAME, CONTACT_INFO, SOCIAL_LINKS } from './constants';


const escapeHtml = (value: string) =>
    value.replace(/[&<>"']/g, (ch) => {
        const map: Record<string, string> = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };
        return map[ch] ?? ch;
    });
/**
 * Generates a professional HTML template for verification emails.
 */
export const getVerificationEmailHtml = (code: string) => {
    const safeCode = escapeHtml(code);
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Identity - ${SITE_NAME}</title>
    <style>
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0;
            background-color: #f8fafc;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 40px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header { 
            background-color: #0f172a; 
            color: #ffffff; 
            padding: 40px 20px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #f8fafc;
        }
        .content { 
            padding: 48px 40px; 
            text-align: center; 
        }
        .content h2 {
            margin-top: 0;
            font-size: 24px;
            font-weight: 700;
            color: #0f172a;
        }
        .content p {
            color: #475569;
            font-size: 16px;
            margin-bottom: 24px;
        }
        .code-container {
            background-color: #f1f5f9;
            border-radius: 12px;
            padding: 32px;
            margin: 32px 0;
            border: 2px solid #e2e8f0;
        }
        .code-box { 
            font-size: 42px; 
            font-weight: 800; 
            letter-spacing: 12px; 
            color: #e11d48; 
            text-shadow: 0 1px 2px rgba(0,0,0,0.05);
            margin: 0;
        }
        .footer { 
            background-color: #f1f5f9; 
            padding: 32px; 
            text-align: center; 
            font-size: 14px; 
            color: #64748b;
        }
        .social-links {
            margin-bottom: 20px;
        }
        .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #475569;
            text-decoration: none;
        }
        .contact-info {
            border-top: 1px solid #e2e8f0;
            margin-top: 20px;
            padding-top: 20px;
            font-size: 12px;
        }
        .contact-info p {
            margin: 4px 0;
        }
        .highlight {
            color: #e11d48;
            font-weight: 600;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div style="height: 40px;"></div>
        <div class="container">
            <div class="header">
                <h1>${SITE_NAME}</h1>
            </div>
            <div class="content">
                <h2>Security Verification</h2>
                <p>Hello Admin,</p>
                <p>A sign-in or administrative action was requested. Please use the following one-time verification code to secure your access.</p>
                
                <div class="code-container">
                    <div class="code-box">${safeCode}</div>
                </div>
                
                <p>This code is valid for professional use within the <span class="highlight">Admin Dashboard</span>. If you did not initiate this request, please secure your account immediately.</p>
            </div>
            <div class="footer">
                <div class="social-links">
                    <a href="${SOCIAL_LINKS.instagram}" class="social-link">Instagram</a>
                    <a href="${SOCIAL_LINKS.facebook}" class="social-link">Facebook</a>
                    <a href="${SOCIAL_LINKS.youtube}" class="social-link">YouTube</a>
                </div>
                <div class="contact-info">
                    <p><strong>${SITE_NAME}</strong></p>
                    <p>${CONTACT_INFO.address.full}</p>
                    <p>Support: ${CONTACT_INFO.supportEmail} | Phone: ${CONTACT_INFO.phone}</p>
                    <p style="margin-top: 15px;">&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
`};
/**
 * Generates a professional HTML template for admin inquiry notifications.
 */
export const getInquiryNotificationEmailHtml = (data: {
    name: string;
    email?: string;
    phone?: string;
    message: string;
    propertyLink?: string;
}) => {
    const safeName = escapeHtml(data.name);
    const safeEmail = data.email ? escapeHtml(data.email) : 'Not Provided';
    const safePhone = data.phone ? escapeHtml(data.phone) : 'N/A';
    const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br>');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Inquiry Received - ${SITE_NAME}</title>
    <style>
        body { 
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
            line-height: 1.6; 
            color: #1a1a1a; 
            margin: 0; 
            padding: 0;
            background-color: #f8fafc;
        }
        .wrapper {
            width: 100%;
            table-layout: fixed;
            background-color: #f8fafc;
            padding-bottom: 40px;
        }
        .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff;
            border-radius: 12px; 
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .header { 
            background-color: #e97108; 
            color: #ffffff; 
            padding: 40px 20px; 
            text-align: center; 
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
            color: #ffffff;
        }
        .content { 
            padding: 40px; 
        }
        .content h2 {
            margin-top: 0;
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 24px;
        }
        .info-grid {
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 24px;
        }
        .info-row {
            display: flex;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-label {
            width: 120px;
            background-color: #f8fafc;
            padding: 12px 16px;
            font-weight: 600;
            color: #64748b;
            font-size: 14px;
        }
        .info-value {
            flex: 1;
            padding: 12px 16px;
            color: #0f172a;
            font-size: 14px;
        }
        .message-box {
            background-color: #f1f5f9;
            border-radius: 8px;
            padding: 20px;
            color: #475569;
            font-size: 15px;
            line-height: 1.8;
            border-left: 4px solid #e97108;
            margin-bottom: 24px;
        }
        .btn {
            display: inline-block;
            background-color: #0f172a;
            color: #ffffff !important;
            padding: 12px 24px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .footer { 
            background-color: #f1f5f9; 
            padding: 32px; 
            text-align: center; 
            font-size: 12px; 
            color: #64748b;
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div style="height: 40px;"></div>
        <div class="container">
            <div class="header">
                <h1>NEW INQUIRY REGISTERED</h1>
            </div>
            <div class="content">
                <h2>Hello Team,</h2>
                <p style="color: #475569; margin-bottom: 24px;">A new lead has been generated through the ${SITE_NAME} website. Details are provided below:</p>
                
                <div class="info-grid">
                    <div class="info-row">
                        <div class="info-label">Full Name</div>
                        <div class="info-value">${safeName}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Email</div>
                        <div class="info-value">${safeEmail}</div>
                    </div>
                    <div class="info-row">
                        <div class="info-label">Phone</div>
                        <div class="info-value">${safePhone}</div>
                    </div>
                </div>
                
                <h3 style="font-size: 16px; color: #0f172a; margin-bottom: 12px;">Inquiry / Message:</h3>
                <div class="message-box">
                    ${safeMessage}
                </div>

                ${data.propertyLink ? `
                <div style="text-align: center; margin-top: 32px;">
                    <p style="font-size: 14px; color: #64748b; margin-bottom: 16px;">Direct Link to Property:</p>
                    <a href="${data.propertyLink}" class="btn">View Property Details</a>
                </div>
                ` : ''}
            </div>
            <div class="footer">
                <p><strong>${SITE_NAME} - Automated Lead Notification</strong></p>
                <p>&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
            </div>
        </div>
    </div>
</body>
</html>
`};
