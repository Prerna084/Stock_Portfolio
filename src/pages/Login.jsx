import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "../components/Spinner";
import { FIREBASE_ENABLED } from "../firebase";

export default function Login() {
  const { login, signup, loginWithGoogle } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [loading, setLoading] = useState(false);
  function firebaseErrorMessage(code) {
    // Map common Firebase auth codes to friendlier messages.
    switch (code) {
      case "auth/user-not-found":
        return "No user found with this email.";
      case "auth/wrong-password":
        return "Invalid password.";
      case "auth/invalid-email":
        return "Invalid email address.";
      case "auth/email-already-in-use":
        return "This email is already in use.";
      case "auth/popup-closed-by-user":
        return "Sign-in popup closed before completion.";
      default:
        return code;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isSignup) {
        await signup(email, password);
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.code
        ? firebaseErrorMessage(err.code)
        : err.message || "Authentication failed";
      setError(msg);
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || "Google sign-in failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0c0d] text-gray-200 p-4">
      {!FIREBASE_ENABLED && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-600 text-black px-4 py-2 rounded">
          Firebase not configured. Create a `.env.local` (or `.env`) at the project root from
          `.env.example` and restart the dev server.
        </div>
      )}
      <div className="w-full max-w-md bg-[#111315] rounded-lg p-6 border border-neutral-800">
        <h2 className="text-2xl font-semibold mb-4">{isSignup ? "Sign Up" : "Sign In"}</h2>

        {error && (
          <div className="mb-3 text-red-400 text-sm">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 bg-[#0f1113] rounded border border-neutral-700"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 bg-[#0f1113] rounded border border-neutral-700"
          />

          <button
            className="w-full bg-cyan-600 py-2 rounded hover:bg-cyan-700"
            disabled={loading || !FIREBASE_ENABLED}
          >
            {loading ? <Spinner /> : isSignup ? "Create account" : "Sign in"}
          </button>
        </form>

        <div className="mt-4 flex gap-2">
          <button
            onClick={handleGoogle}
            className="flex-1 bg-white text-black py-2 rounded hover:opacity-90"
            disabled={loading || !FIREBASE_ENABLED}
          >
            {loading ? <Spinner /> : "Continue with Google"}
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-300">
          <button
            onClick={() => setIsSignup((s) => !s)}
            className="text-cyan-400 underline"
          >
            {isSignup ? "Have an account? Sign in" : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
}
