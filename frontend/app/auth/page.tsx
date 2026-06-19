import React from "react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm bg-white p-8 border border-gray-200 shadow-sm rounded-xl">
        <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-center mb-8">
          Sign in to your account to continue
        </p>
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium">
            <span>Continue with Google</span>
          </button>

          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium">
            <span>Continue with GitHub</span>
          </button>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Email address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter your password"
            />
          </div>

          <button className="w-full py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-semibold mt-2">
            Sign In
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don`t have an account?
          <a
            href="/signup"
            className="text-black font-semibold hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
