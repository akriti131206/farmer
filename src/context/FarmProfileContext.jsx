import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { getMyProfile, getMyFarm, saveMyProfileAndFarm } from "../services/profileService";
import { getMyCrop, saveMyCrop } from "../services/cropCalendarService";

const FarmProfileContext = createContext(null);

/**
 * FarmProfileProvider loads and manages the authenticated user's profile and farm data from Supabase.
 * It combines profile data (name, email, phone, language) and farm data (farm name, location, land size, etc.)
 * into a single context for backward compatibility with existing components.
 */
export function FarmProfileProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  // Load profile and farm data when user changes
  useEffect(() => {
    if (authLoading) {
      setLoading(true);
      return;
    }

    if (!user) {
      setProfile(null);
      setLoadError("");
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function loadProfileAndFarm() {
      setLoading(true);
      setLoadError("");
      try {
        const [profileData, farmData, cropData] = await Promise.all([
          getMyProfile(),
          getMyFarm(),
          getMyCrop(),
        ]);

        if (isMounted) {
          const savedCrop = cropData?._fromLegacy && farmData?.id
            ? await saveMyCrop(cropData.crop, cropData.sowingDate)
            : cropData;

          if (isMounted) {
            const mergedProfile = {
              ...(profileData || {}),
              ...(farmData || {}),
              cropId: savedCrop?.id || "",
              crop: savedCrop?.crop || farmData?.crop || "",
              sowingDate: savedCrop?.sowingDate || farmData?.sowingDate || "",
            };
            setProfile(mergedProfile);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading profile and farm:", error);
          setProfile(null);
          setLoadError(error.message || "Could not load your profile and farm data.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadProfileAndFarm();

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  async function updateFarmProfile(formData) {
    if (!user) {
      throw new Error("Sign in before saving your profile.");
    }

    setLoadError("");

    try {
      const { profile: profileData, farm: farmData } = await saveMyProfileAndFarm(
        {
          farmerName: formData.farmerName || "",
          phone: formData.phone || "",
          preferredLanguage: formData.preferredLanguage || "",
        },
        formData
      );
      const cropData = await saveMyCrop(formData.crop, formData.sowingDate);

      const mergedProfile = {
        ...profileData,
        ...farmData,
        cropId: cropData.id,
        crop: cropData.crop,
        sowingDate: cropData.sowingDate,
      };

      setProfile(mergedProfile);
      return mergedProfile;
    } catch (error) {
      console.error("Error saving profile:", error);
      setLoadError(error.message || "Could not save your profile.");
      throw error;
    }
  }

  return (
    <FarmProfileContext.Provider
      value={{
        profile,
        loading,
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
