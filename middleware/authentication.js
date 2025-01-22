import { auth } from "../lib/firebaseAdmin.js";

const checkAuthenticated=async(req,res,next)=>{
    try {
        const accessToken = req.cookies?.accessToken;

        if (!accessToken) {
            return res.status(401).json({ message: "No token provided", success: false });
        }

        const decodedToken = await auth.verifyIdToken(accessToken);

        if (!decodedToken?.email) {
            throw new Error("Invalid token payload");
        }
        next();
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
}

export default checkAuthenticated;