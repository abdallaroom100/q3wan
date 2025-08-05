// import nodemailer from "nodemailer"



// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587, // استخدم 587 لـ TLS أو 465 لـ SSL
//   secure: false, // خليها false مع port 587
//   auth: {
//     user: "88aafa001@smtp-brevo.com", // الـ SMTP Login
//     pass: "ngfBVcOUF39D8GsS", // الـ Master Password
//   },
// });


  
// export const sendForgetPassowrdMessage = async (email,message) =>{

//   const mailOptions = {
//     from: '"Al Madrasa" <abdallaroom25@gmail.com>',  // غيرها للبريد اللي مسجل به في Brevo
//     to: email,
//     subject: "Forget your Password", // Subject line
//     html: `<b>
//     please use this link to update your account password , notice that the link will get expired after 15 minutes <br/>
//     link:<a href="${message}">${message}</a>
//    </b>`, // html body
//   };
  
//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       console.log("Error:", error);
//     } else {
//       console.log("Email sent:", info.response);
//     }
//   });
        
         

// } 
import nodemailer from "nodemailer";

// إعداد Transporter مع تحسينات إضافية
const transporter = nodemailer.createTransport({
  pool: true, // تفعيل الاتصال المجمع
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "88aafa001@smtp-brevo.com", // الـ SMTP Login
    pass: "ngfBVcOUF39D8GsS", // الـ Master Password
  },
  maxConnections: 5, // الحد الأقصى لعدد الاتصالات
  maxMessages: 50, // عدد الرسائل لكل اتصال
  rateLimit: 10, // الحد الأقصى لعدد الرسائل في الثانية (لتجنب الحظر)
  connectionTimeout: 5000, // 5 ثوانٍ timeout للاتصال
  socketTimeout: 5000, // 5 ثوانٍ timeout للسوكت
  tls: {
    rejectUnauthorized: false, // لتجنب مشاكل الشهادات (اختياري)
  },
});

// التحقق من الاتصال عند بدء التطبيق
transporter.verify((error, success) => {
  if (error) {
    console.error("خطأ في الاتصال بـ SMTP:", error);
  } else {
    console.log("الاتصال بـ SMTP جاهز!");
  }
});

// دالة لإرسال رسالة نسيان كلمة المرور
export const sendForgetPassowrdMessage = async (email, message) => {
  const mailOptions = {
    from: '"مبرة القعوان" <abdallaroom25@gmail.com>', // تأكد أن هذا البريد مُصرّح به في Brevo
    to: email,
    subject: "تحديث كلمة المرور",
    html: `
      <div style="background:#f7f7fa;padding:32px 0;font-family:'Cairo',Arial,sans-serif;">
        <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.07);padding:32px 24px;text-align:center;">
          <img src="https://alqawan.com/img/logo.png" alt="شعار مبرة القعوان" style="width:100px;margin-bottom:16px;border:2px solid #eee;"/>
          <h2 style="color:#1a237e;margin-bottom:8px;">تحديث كلمة المرور</h2>
          <p style="color:#333;font-size:17px;margin-bottom:24px;">عزيزي المستخدم،<br>لقد طلبت تحديث كلمة المرور الخاصة بحسابك في <b>مبرة القعوان</b>.<br>اضغط على الزر أدناه لتعيين كلمة مرور جديدة. سينتهي صلاحية الرابط بعد <b>15 دقيقة</b>.</p>
          <a href="${message}" style="display:inline-block;padding:12px 32px;background:#1a237e;color:#fff;text-decoration:none;font-size:18px;border-radius:6px;font-weight:bold;transition:background 0.2s;">تحديث كلمة المرور</a>
          <p style="color:#888;font-size:13px;margin-top:24px;">إذا لم تطلب تغيير كلمة المرور، يمكنك تجاهل هذه الرسالة.<br>مع تحيات فريق <b>مبرة القعوان</b></p>
        </div>
        <div style="text-align:center;color:#aaa;font-size:12px;margin-top:18px;">© 2024 مبرة القعوان. جميع الحقوق محفوظة.</div>
      </div>
    `,
    headers: {
      "X-Priority": "1", // إعطاء الأولوية للرسالة
    },
  };

  // إضافة آلية إعادة المحاولة مع تأخير
  const maxRetries = 3;
  let attempt = 1;

  while (attempt <= maxRetries) {
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error.message);
      if (attempt === maxRetries) {
        console.error("Failed to send email after all retries:", error);
        return { success: false, error: error.message };
      }
      // الانتظار قبل المحاولة التالية (تأخير تصاعدي)
      await new Promise((resolve) => setTimeout(resolve, 2000 * attempt));
      attempt++;
    }
  }
};

// دالة لإغلاق الاتصال عند إغلاق التطبيق (اختياري)
export const closeTransporter = () => {
  transporter.close();
  console.log("Transporter closed.");
};

// استدعاء إغلاق الاتصال عند إغلاق التطبيق (اختياري)
process.on("SIGINT", () => {
  closeTransporter();
  process.exit();
});