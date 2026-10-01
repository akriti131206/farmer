import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getFarmProfile, saveFarmProfile } from "../services/farmProfile";

const FarmProfileContext = createContext(null);

function getUserKey(user) {
  const identity = user?.email || user?.id;
  return identity ? String(identity).toLowerCase() : null;
}

export function FarmProfileProvider({ children }) {
  const { user } = useAuth();
  const userKey = getUserKey(user);
  const [profile, setProfile] = useState(null);
  const [loadedUserKey, setLoadedUserKey] = useState(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!userKey) {
      setProfile(null);
      setLoadedUserKey(null);
      setLoadError("");
      return;
    }

    try {
      setProfile(getFarmProfile(user));
      setLoadError("");
    } catch (error) {
      setProfile(null);
      setLoadError(error.message);
    }
    setLoadedUserKey(userKey);
  }, [userKey, user]);

  function updateFarmProfile(nextProfile) {
    const savedProfile = saveFarmProfile(user, nextProfile);
    setProfile(savedProfile);
    setLoadError("");
    return savedProfile;
  }

  const profileIsReady = loadedUserKey === userKey;

  return (
    <FarmProfileContext.Provider
      value={{
        profile: profileIsReady ? profile : null,
        loading: Boolean(userKey) && !profileIsReady,
        loadError,
        updateFarmProfile,
      }}
    >
      {children}
    </FarmProfileContext.Provider>
  );
}

export function useFarmProfile() {
  const context = useContext(FarmProfileContext);
  if (!context) throw new Error("useFarmProfile must be used within a FarmProfileProvider");
  return context;
}
