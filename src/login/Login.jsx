import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const UserType = {
  CITIZEN: "citizen",
  ADMIN: "admin",
  NGO: "ngo",
};

const Login = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkRefreshToken = async () => {
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        try {
          const decodedToken = jwtDecode(existingToken);
          const currentTime = Math.floor(Date.now() / 1000);
          if (decodedToken.exp > currentTime) {
            if (decodedToken.role === UserType.ADMIN) navigate("/admin");
            else if (decodedToken.role === UserType.NGO) navigate("/ngo");
            else navigate("/");
            return;
          }
        } catch {
          localStorage.removeItem("token");
        }
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include",
          }
        );

        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          const decodedToken = jwtDecode(data.token);
          if (decodedToken.role === UserType.ADMIN) navigate("/admin");
          else if (decodedToken.role === UserType.NGO) navigate("/ngo");
          else navigate("/");
          return;
        }
      } catch (error) {
        console.error("Error checking refresh token:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkRefreshToken();
  }, [navigate]);

  const handleLogin = () => {
    const loginUrl = `${import.meta.env.VITE_API_URL}/auth/google`;
    window.location.href = loginUrl;
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-300">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-green-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-emerald-400 rounded-full opacity-40 animate-pulse delay-100"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-teal-400 rounded-full opacity-50 animate-pulse delay-200"></div>
        <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-green-300 rounded-full opacity-60 animate-pulse delay-300"></div>

        <div className="absolute -top-24 -left-24 w-96 h-96 bg-green-500 rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500 rounded-full opacity-5 blur-3xl"></div>
      </div>

  {/* Main Content Card */}
  <div className="relative z-10 max-w-md w-full flex flex-col gap-10 md:gap-12">
        <div className="bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 py-16 px-8 md:py-12 md:px-10 flex flex-col items-center gap-8">
          
          {/* Logo/Icon Section */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-green-400 to-emerald-600 p-4 rounded-full">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Title Section */}
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-emerald-500 to-teal-400 bg-clip-text text-transparent">
              EcoSynergy
            </h1>
            <p className="text-gray-400 text-sm md:text-base">
              Together for a Sustainable Future
            </p>
          </div>

          {/* Features */}
          <div className="flex flex-col gap-5 w-full text-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span>Build community initiatives</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <span>Smart waste management</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span>Track environmental impact</span>
            </div>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="w-full bg-white hover:bg-gray-50 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-4 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 group text-lg leading-normal min-h-[52px]"
          >
            <img src="/google.png" alt="Google" className="w-6 h-6" />
            <span>Continue with Google</span>
            <svg
              className="w-6 h-6 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          
        </div>

  {/* Bottom decorative text */}
  <div className="text-center text-gray-300 text-sm">
          <p className="text-center text-sm text-gray-300">
            Join thousands making a difference for our planet 🌍
          </p>
          Reduce • Reuse • Recycle • Renew
        </div>
      </div>
    </div>
  );
};

export default Login;
