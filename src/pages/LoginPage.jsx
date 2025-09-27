import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign up");
  const [fullName, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);
  // login function
  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    login(currState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* left */}
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw,250px)]" />
      {/* right */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmitted(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {currState === "Sign up" && !isDataSubmitted && (
          <input
            type="text"
            onChange={(e) => setFullname(e.target.value)}
            value={fullName}
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}
        {/* textarea for bio */}
        {currState === "Sign up" && isDataSubmitted && (
          <textarea
            rows={4}
            className="p-2 w-[300px] border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Please provide a short bio..."
            required
            onChange={(e) => setBio(e.target.value)}
            value={bio}
          ></textarea>
        )}
        {!isDataSubmitted && (
          <>
            {/* Email */}
            <input
              type="email"
              placeholder="Email Address"
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </>
        )}

        <button
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
          type="submit"
        >
          {currState === "Sign up" ? "Create Account" : "Login Now"}
        </button>
        {/* privacy policy and checkbox */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>
        <div className="flex flex-col items-center gap-2">
          {currState === "Sign up" ? (
            <p className="text-sm text-gray-600">
              Already have an account?
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Login");
                  setIsDataSubmitted(false);
                }}
              >
                Login here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-600">
              Create an Account?
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrState("Sign up");
                }}
              >
                Click here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
