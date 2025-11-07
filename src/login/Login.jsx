
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
          const decodedToken = jwtDecode(existingToken);
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">EcoSynergy</h1>
        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
