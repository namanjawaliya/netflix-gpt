import React from "react";
import Header from "./Header";
import SignInUpForm from "./SignInUpForm";
import { BG_IMG } from "../utils/constants/constants";

const Login = () => {
  return (
    <div>
      <Header />
      <div className="absolute">
        <img
          src={BG_IMG}
          alt="login background"
          className="h-screen w-screen"
        />
      </div>
      <SignInUpForm />
    </div>
  );
};

export default Login;
