import { withAuth } from "next-auth/middleware";

export default withAuth({
    callbacks: {
        authorized: ({ token }) => token?.role === "admin",
    },
});

export const config = { matcher: ["/admin/dashboard/:path*", "/admin/properties/:path*", "/admin/verify", "/admin/logs/:path*"] };
