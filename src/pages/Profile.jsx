import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { getUserProfile, setUserProfile } from "../services/userProfile";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      // load profile extras from Firestore (phone)
      setLoadingProfile(true);
      getUserProfile(user.uid)
        .then((p) => {
          if (p && p.phone) setPhone(p.phone);
        })
        .catch(() => {})
        .finally(() => setLoadingProfile(false));
    } else {
      setDisplayName("");
      setPhone("");
      setLoadingProfile(false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setMessage(null);
    setSaving(true);
    try {
      // update Firebase Auth displayName
      if (displayName) await updateProfile({ displayName });

      // save phone in Firestore users/{uid}
      await setUserProfile(user.uid, { phone: phone || null });

      setMessage({ type: "success", text: "Profile updated" });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to update" });
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl =
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.displayName || user?.email || "User"
    )}&background=16a34a&color=fff&bold=true`;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-semibold text-white">Profile</h1>

      <div className="card flex items-center space-x-5">
        <img
          src={avatarUrl}
          alt="User Avatar"
          className="w-20 h-20 rounded-full border-2 border-green-500"
        />
        <div>
          <h2 className="text-xl font-bold text-white">{user?.displayName || user?.email}</h2>
          <p className="text-gray-400">{user?.email}</p>
          <p className="text-gray-400">Member since: {user?.metadata?.creationTime || "—"}</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold mb-4 text-white">Account Settings</h2>

        {message && (
          <div className={`p-2 mb-3 ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
            {message.text}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 mb-1">Display Name</label>
            <input
              type="text"
              className="w-full bg-[#1f2228] border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Email</label>
            <input
              type="email"
              className="w-full bg-[#1f2228] border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
              value={user?.email || ""}
              readOnly
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="Add phone number"
              className="w-full bg-[#1f2228] border border-gray-700 rounded-lg p-2 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            {loadingProfile && <p className="text-sm text-gray-400 mt-1">Loading profile...</p>}
          </div>

          <button onClick={handleSave} disabled={saving} className="btn-primary mt-3">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
