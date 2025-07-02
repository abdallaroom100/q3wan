import jwt from "jsonwebtoken"


// export const protectRoute = async (req, res, next) => {
//   try {
//    console.log(req.headers)
//     const token = req.headers.cookie?.split("jwt=").slice(-1)[0];
   
//     if (!token) throw new Error("unaturhorized token");
//     const decode = jwt.verify(token, "secret");
//     if (!decode) throw new Error("unaturhorized - invalid token");
//     req.userId = decode.userId;
//     next();
//   } catch (error) {
//     console.log("error in protect route function");
//     res.status(400).json({ error: error.message });
//   }
// };
export const protectRoute = async (req, res, next) => {
  try {
    
    const token = req.headers["authorization"]?.split(" ")[1];
   
    if (!token) throw new Error("unaturhorized token");
    const decode = jwt.verify(token, "secret");
    if (!decode) throw new Error("unaturhorized - invalid token");
    req.userId = decode.userId;
  
    next();
  } catch (error) {
    console.log("error in protect route function");
    res.status(400).json({ error: error.message });
  }
};


export const protectedAdminRoute = (req,res,next)=>{
  try {
    const authHeader = req.headers["authorization"];
    let token = null;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token || token === "undefined" || token === "null") {
      return res.status(401).json({ error: "لا يوجد جلسات مسجله" });
    }

    let decode;
    try {
      decode = jwt.verify(token, "secret");
    } catch (err) {
      return res.status(401).json({ error: "رمز الجلسة غير صالح أو منتهي الصلاحية" });
    }

    if (!decode || !decode.adminId) {
      return res.status(401).json({ error: "تم انتهاء الجلسه الجاريه برجاء تسجيل الدخول من جديد" });
    }

    req.adminId = decode.adminId;
    next()
  } catch (error) {
    console.log(error)
  }
}