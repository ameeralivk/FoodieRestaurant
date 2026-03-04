import nodemailer from "nodemailer";
import dotenv from "dotenv"
dotenv.config()
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export interface otpResponse {
    success:boolean,
    message:string
}

export const sentOtp = async (email: string, otp: string): Promise<otpResponse> => {
  try {
    const mailOptions = {
      from: `"FoodieRestaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html:`<div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f9f9;
      padding: 30px;
      border-radius: 10px;
      border: 1px solid #ddd;
      max-width: 480px;
      margin: auto;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  ">
    <div style="text-align: center;">
      <h1 style="
        color: #e63946;
        font-size: 28px;
        margin-bottom: 10px;
      ">🍴 FoodieRestaurant</h1>
      <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
        Welcome to <strong>FoodieRestaurant</strong>! To complete your verification, please use the OTP below:
      </p>
      <div style="
        background-color: #fff;
        display: inline-block;
        padding: 15px 30px;
        border-radius: 8px;
        border: 2px dashed #e63946;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 3px;
        color: #e63946;
        margin-bottom: 20px;
      ">
        ${otp}
      </div>
      <p style="color: #777; font-size: 14px;">
        This OTP is valid for <b>5 minutes</b>.<br>
        Please do not share it with anyone.
      </p>
      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px;">
        You're receiving this email because you requested verification from FoodieRestaurant.<br>
        If you didn’t request this, please ignore this message.
      </p>
    </div>
  </div>`
    };
    await transporter.sendMail(mailOptions);
    return {success:true,message:"Otp sented successfully"}
  } catch (error) {
  return { success: false, message:error instanceof Error ? error.message : "Failed to send OTP"};
  }
};


export const resendOtpEmail = async (email: string, otp: string) => {
  try {
     const mailOptions = {
      from: `"FoodieRestaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html:`<div style="
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f9f9f9;
      padding: 30px;
      border-radius: 10px;
      border: 1px solid #ddd;
      max-width: 480px;
      margin: auto;
      box-shadow: 0 4px 10px rgba(0,0,0,0.05);
  ">
    <div style="text-align: center;">
      <h1 style="
        color: #e63946;
        font-size: 28px;
        margin-bottom: 10px;
      ">🍴 FoodieRestaurant</h1>
      <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
        Welcome to <strong>FoodieRestaurant</strong>! To complete your verification, please use the OTP below:
      </p>
      <div style="
        background-color: #fff;
        display: inline-block;
        padding: 15px 30px;
        border-radius: 8px;
        border: 2px dashed #e63946;
        font-size: 26px;
        font-weight: bold;
        letter-spacing: 3px;
        color: #e63946;
        margin-bottom: 20px;
      ">
        ${otp}
      </div>
      <p style="color: #777; font-size: 14px;">
        This OTP is valid for <b>2 minutes</b>.<br>
        Please do not share it with anyone.
      </p>
      <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px;">
        You're receiving this email because you requested verification from FoodieRestaurant.<br>
        If you didn’t request this, please ignore this message.
      </p>
    </div>
  </div>`
    };
    await transporter.sendMail(mailOptions);
    return {success:true,message:"Otp resented successfully"}
  } catch (error) {
  console.error(error);
  return { success: false, message: "Failed to send OTP" };
  }
};

export const sendResetPasswordEmail = async (email: string, token: string,role:"admin"|"user") => {
  try {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(
    email
    )}&token=${token}&role=${role}`;

    const mailOptions = {
      from: `"FoodieRestaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        padding: 30px;
        border-radius: 10px;
        border: 1px solid #ddd;
        max-width: 480px;
        margin: auto;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      ">
        <div style="text-align: center;">
          <h1 style="
            color: #e63946;
            font-size: 28px;
            margin-bottom: 10px;
          ">🍴 FoodieRestaurant</h1>
          <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
            You requested to reset your password. Click the button below to set a new password:
          </p>
          <a href="${resetLink}" style="
            display: inline-block;
            padding: 15px 30px;
            background-color: #e63946;
            color: #fff;
            font-size: 18px;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
            margin-bottom: 20px;
          ">Reset Password</a>
          <p style="color: #777; font-size: 14px;">
            This link is valid for <b>2 minutes</b>.<br>
            If you didn’t request this, you can safely ignore this email.
          </p>
          <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            You're receiving this email because you requested a password reset from FoodieRestaurant.<br>
            If you didn’t request this, please ignore this message.
          </p>
        </div>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "Password reset link sent successfully" };
  } catch (error) {
    return { success: false, message:error instanceof Error ? error.message : "Failed to send password reset email" };
  }
};


export const sendResetStaffPasswordEmail = async (
  email: string,
  token: string,
  role: "admin" | "user" | "staff"
) => {
  try {

    let resetPath = "";

    // role-based reset URL
    switch (role) {
      case "admin":
        resetPath = "/admin/reset-password";
        break;
      case "staff":
        resetPath = "/staff/reset-password";
        break;
      case "user":
        resetPath = "/reset-password";
        break;
      default:
        resetPath = "/reset-password";
    }

    // const resetLink = `${process.env.FRONTEND_URL}${resetPath}?email=${encodeURIComponent(email)}&token=${token}`;
    const resetLink = `${process.env.FRONTEND_URL}/staff/reset-password?email=${encodeURIComponent(email)}&token=${token}&role=staff`;
    const mailOptions = {
      from: `"FoodieRestaurant" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Staff Password Reset Request",
      html: `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        padding: 30px;
        border-radius: 10px;
        border: 1px solid #ddd;
        max-width: 480px;
        margin: auto;
      ">
        <div style="text-align: center;">
          <h1 style="color: #e63946;">🍴 FoodieRestaurant Staff Portal</h1>

          <p style="color: #555;">
            You requested to reset your staff account password.
          </p>

          <a href="${resetLink}" style="
            display: inline-block;
            padding: 15px 30px;
            background-color: #e63946;
            color: white;
            border-radius: 8px;
            text-decoration: none;
            font-weight: bold;
          ">
            Reset Password
          </a>

          <p style="color: #777; font-size: 14px;">
            This link expires in <b>2 minutes</b>.
          </p>

        </div>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: "Password reset link sent successfully"
    };

  } catch (error) {

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to send password reset email"
    };

  }
};




export const sendStaffAccountEmail = async (
  email: string,
  staffName: string,
  password: string,
  restaurantName: string 
) => {
  try {
    const mailOptions = {
      from: `"${restaurantName}" <${process.env.EMAIL_USER}>`, // use dynamic name
      to: email,
      subject: `Welcome to ${restaurantName} - Your Staff Account`,
      html: `
      <div style="
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9f9;
        padding: 30px;
        border-radius: 10px;
        border: 1px solid #ddd;
        max-width: 480px;
        margin: auto;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
      ">
        <div style="text-align: center;">
          <h1 style="
            color: #e63946;
            font-size: 28px;
            margin-bottom: 10px;
          ">🍴 ${restaurantName}</h1>
          <p style="color: #555; font-size: 16px; margin-bottom: 25px;">
            Hello <strong>${staffName}</strong>! You have been added as a staff member to <strong>${restaurantName}</strong>. 
            Please use the following credentials to login:
          </p>
          <div style="
            background-color: #fff;
            display: inline-block;
            padding: 15px 30px;
            border-radius: 8px;
            border: 2px dashed #e63946;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            color: #e63946;
            margin-bottom: 20px;
            text-align: left;
          ">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
          </div>
          <p style="color: #777; font-size: 14px;">
            Please login and change your password immediately for security.
          </p>
          <hr style="margin: 25px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #999; font-size: 12px;">
            You're receiving this email because you have been added as a staff member at ${restaurantName}.<br>
            If you did not expect this, please contact the admin immediately.
          </p>
        </div>
      </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Staff account email sent successfully" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to send staff account email" };
  }
};

