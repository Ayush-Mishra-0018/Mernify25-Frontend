
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
      // Check if user already has a valid access token
      const existingToken = localStorage.getItem("token");
      if (existingToken) {
        try {
          const currentTime = Math.floor(Date.now() / 1000);
          // If token is still valid, redirect user
          if (decodedToken.exp > currentTime) {
            if (decodedToken.role === UserType.ADMIN) {
              navigate("/admin");
            } else if (decodedToken.role === UserType.NGO) {
              navigate("/ngo");
            } else {
              navigate("/");
            }
            return;
          }
        } catch (error) {
          localStorage.removeItem("token");
        }
      }

      // Try to refresh token using refresh token cookie
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {
            method: "POST",
            credentials: "include", // Include cookies for refresh token
          }
        );

        console.log("Response:", response);
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("token", data.token);
          
          // Decode the new token to determine user type
          const decodedToken = jwtDecode(data.token);
          if (decodedToken.role === UserType.ADMIN) {
            navigate("/admin");
          } else if (decodedToken.role === UserType.NGO) {
            navigate("/ngo");
          } else {
            navigate("/");
          }
          return;
        } else {
          console.error("Failed to refresh token");
        }
      } catch (error) {
        // Error checking refresh token
        console.error("Error checking refresh token:", error);
      } finally{
        setIsChecking(false);
      }
    };

    checkRefreshToken();
  }, [navigate]);

  const handleLogin = () => {
    const loginUrl = `${import.meta.env.VITE_API_URL}/auth/google`;
    window.location.href = loginUrl;
  };

  // Show loading state while checking for refresh token
  if (isChecking) {
    return (
      <div className={`flex flex-col items-center justify-center h-screen bg-linear-to-br from-blue-300 via-blue-500 to-blue-700`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-6"></div>
        <div className="text-lg text-white font-bold">
          Authenticating...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            EcoSynergy
          </h1>
          <p className="text-gray-600 text-lg">
            Join the Green Revolution 🌱
          </p>
        </div>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 hover:border-emerald-500 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>By signing in, you agree to our</p>
          <p className="mt-1">
            <a href="#" className="text-emerald-600 hover:underline">Terms of Service</a>
            {' '}&{' '}
            <a href="#" className="text-emerald-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
