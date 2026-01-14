import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
const FaRegEyeSlash = require("react-icons/fa").FaRegEyeSlash;
const IoEyeOutline = require("react-icons/io5").IoEyeOutline;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        email,
        password,
      });

      const { token } = res.data;
      Cookies.set("token", token, { expires: 7 });
      window.location.href = "/dashboard/news";
    } catch (err) {
      console.error(err);
      setError("Login gagal. Cek email dan password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <div className="flex justify-center mb-4">
          <img src="/images/niw.png" alt="Logo" className="w-32 h-20" />
        </div>
        <h2 className="text-center text-xl font-bold mb-4">Login Dashboard</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" placeholder="email@gmail.com" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="absolute right-3 top-2.5 text-gray-500" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FaRegEyeSlash /> : <IoEyeOutline />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full py-2 bg-[#cfa84d] text-white font-semibold rounded-lg hover:bg-yellow-400" disabled={loading}>
            {loading ? (
              <>
                <div className="flex justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                </div>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
