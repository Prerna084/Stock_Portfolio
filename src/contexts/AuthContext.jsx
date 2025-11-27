import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from "firebase/auth";
import { auth, googleProvider, FIREBASE_ENABLED } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!FIREBASE_ENABLED) {
      // No firebase configured — remain unauthenticated but not loading
      setUser(null);
      setLoading(false);
      return () => {};
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = (email, password) => {
    if (!FIREBASE_ENABLED) return Promise.reject(new Error("Firebase not configured"));
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email, password) => {
    if (!FIREBASE_ENABLED) return Promise.reject(new Error("Firebase not configured"));
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    if (!FIREBASE_ENABLED) return Promise.reject(new Error("Firebase not configured"));
    return signInWithPopup(auth, googleProvider);
  };

  const logout = () => {
    if (!FIREBASE_ENABLED) return Promise.resolve();
    return firebaseSignOut(auth);
  };

  const updateProfile = (data) => {
    if (!FIREBASE_ENABLED) return Promise.reject(new Error("Firebase not configured"));
    if (!auth.currentUser) return Promise.reject(new Error("No user"));
    return firebaseUpdateProfile(auth.currentUser, data);
  };

  const value = {
    user,
    loading,
    login,
    signup,
    loginWithGoogle,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
