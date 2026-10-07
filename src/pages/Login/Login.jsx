import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

  const handleLogin = useCallback(
    (e) => {
      e.preventDefault(); // form submit ka default page-reload rokne ke liye

      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (!trimmedEmail || !trimmedPassword) {
        setError("Email and Password are required");
        return;
      }

      if (!EMAIL_REGEX.test(trimmedEmail)) {
        setError("Please enter a valid email address");
        return;
      }

      setError("");
      navigate("/dashboard");
    },
    [email, password, navigate]
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <h1 className="text-3xl font-bold text-blue-600">Assessment App Task</h1>
        </div>

        {/* Heading */}
        <h2 className="mb-6 text-center text-2xl font-semibold text-slate-900">Login</h2>

        {/* form + onSubmit: ab Enter key se bhi submit hoga, sirf button click se nahi */}
        <form onSubmit={handleLogin} noValidate>
          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-6">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              className="w-full rounded-md border border-slate-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Error message */}
          {error && (
            <p role="alert" className="mb-4 text-center text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700"
          >
            All User
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;