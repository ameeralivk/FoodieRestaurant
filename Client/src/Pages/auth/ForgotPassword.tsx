import InputField from "../../Components/Elements/InputField";
import Button from "../../Components/Elements/Button";
import { useState } from "react";
import WarningSwal from "../../Components/Helpers/WarningSwal";
import Admin_Navbar from "../../Components/Layouts/Admin_Navbar";
import { handleForgetPasswordSubmit } from "../../services/Auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
const ForgetPasswordPage = () => {
  const [email, setemail] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setemail(value);
  };
  const [isHidden, setIsHidden] = useState(false);
  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      WarningSwal({ message: "Please Fill the Email and Continue" });
      return;
    } else if (email && !emailRegex.test(email)) {
      WarningSwal({ message: "Please Enter Correct Email Formate" });
      return;
    } else {
      setIsHidden(true);
      const res =  await handleForgetPasswordSubmit({ email });
      if(!res){
        setIsHidden(false)
         return
      }
      const hiddenUntil = Date.now() + 2 * 60 * 1000;
      localStorage.setItem("hiddenUntil", hiddenUntil.toString());
      setTimeout(() => {
        setIsHidden(false);
        localStorage.removeItem("hiddenUntil");
      }, 2 * 60 * 1000);
      
    }
  };
  const nav = () => {
    navigate("/Admin/Login");
  };

  useEffect(() => {
    const hiddenUntil = localStorage.getItem("hiddenUntil");
    if (hiddenUntil && Date.now() < Number(hiddenUntil)) {
      setIsHidden(true);
      const remaining = Number(hiddenUntil) - Date.now();
      setTimeout(() => setIsHidden(false), remaining);
    }
  }, []);

  return (
    <div>
      <div className="top-0 fixed w-screen">
        <Admin_Navbar role={"login"} />
      </div>
      <ToastContainer />
      <div className=" w-screen h-screen bg-black flex justify-center items-center">
        <div className="w-[370px] h-80 bg-slate-900/80 border-2 border-amber-400/40  rounded-md p-6 text-center">
          <h1 className="text-3xl text-amber-400">ForgetPassword</h1>
          <div className="text-white h-[150px] flex justify-center flex-col">
            <p className="text-white text-[14px] mb-6 text-left">
              Please enter the email address you'd like your password reset
              information sent to
            </p>
            <InputField Name={"Email"} onChange={handleInputChange} />
          </div>
          <div className="flex justify-center flex-col items-center h-[60px] ">
            {!isHidden ? (
              <Button onClick={handleSubmit} text="Request Reset Link" />
            ) : (
              <p className="text-amber-50">
                Button will reappear after 2 minutes...
              </p>
            )}
          </div>
          <a onClick={nav} className="text-blue-600 cursor-pointer mt-6">
            Back To Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgetPasswordPage;
