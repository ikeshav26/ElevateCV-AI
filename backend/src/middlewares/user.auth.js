import jwt from 'jsonwebtoken';



export const userAuth=(req,res,next)=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    }catch(err){
        console.error("Authentication error:", err);
        return res.status(401).json({ message: "Unauthorized" });
    }
}