import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/signin",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/patients/:path*", "/appointments/:path*", "/providers/:path*", "/billing/:path*", "/admin/:path*"],
};
