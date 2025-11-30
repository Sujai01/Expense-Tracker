import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";

const Login = () => {
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome Back</h3>
        <p className="text-xs text-slate-700 mt-1 mb-6">
          Please enter your details to log in
        </p>

        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="border border-gray-300 rounded-md px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md px-3 py-2"
          />

          <button
            type="submit"
            className="bg-black text-white w-full py-2 rounded-md mt-2 hover:bg-gray-900"
          >
            Log In
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
