import { useMemo } from "react";
import { useFarmProfile } from "../context/FarmProfileContext";
import { buildFarmerWorkspace } from "../services/farmerWorkspace";

export default function useFarmWorkspace() {
  const { profile, loading, loadError } = useFarmProfile();
  const workspace = useMemo(() => buildFarmerWorkspace(profile), [profile]);

  return {
    ...workspace,
    profileLoading: loading,
    profileError: loadError,
  };
}
