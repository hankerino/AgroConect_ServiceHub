import React, { useState, useEffect } from "react";
import { supabaseClient } from "../api/base44Client";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: listener } = supabaseClient.auth.onAuthStateChange((_, session) => {
      if (session) navigate('/');
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: "http://localhost:5173/" },
    });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-tr from-green-100 via-white to-green-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Welcome Back 👋</h1>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full py-3 px-6 rounded-xl text-white font-medium text-sm transition-all ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Redirecting..." : "Login with Google"}
        </button>

        {errorMsg && (
          <p className="mt-4 text-sm text-red-600 text-center">
            {errorMsg}
          </p>
        )}

        <p className="mt-8 text-center text-sm text-gray-500">
          By continuing, you agree to our <span className="underline cursor-pointer">Terms</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
};

export default Login;
