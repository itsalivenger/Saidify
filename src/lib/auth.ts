import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

/**
 * Robust admin check for API routes. 
 * Decodes the JWT from cookies and verifies the role.
 */
export async function isAdmin() {
    try {
        const cookieStore = await cookies();
        // Read the admin-specific cookie, separate from the storefront 'token' cookie
        const token = cookieStore.get("admin_token")?.value;

        if (!token) {
            console.log("[Auth] No admin_token cookie found");
            return false;
        }

        const decoded = jwt.verify(token, JWT_SECRET) as any;

        if (decoded.role === "admin") {
            return true;
        }

        console.log(`[Auth] Token does not have admin role (role: ${decoded.role})`);
        return false;
    } catch (error) {
        console.error("[Auth] Admin token verification failed:", error instanceof Error ? error.message : "Unknown error");
        return false;
    }
}
