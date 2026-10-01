import { useEffect, useState } from "react";
import { FiEdit2, FiSave, FiMapPin, FiMail, FiPhone } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import { useAuth } from "../context/AuthContext";
import { useFarmProfile } from "../context/FarmProfileContext";
import { useUI } from "../context/UIContext";
import { cropList, irrigationMethods, soilTypes } from "../data/crops";
import { validateFarmProfile } from "../services/farmProfile";

const irrigationTypes = [...new Set(Object.values(irrigationMethods)), "Other"];
const languages = [
  ["en", "English"],
  ["hi", "Hindi"],
  ["bn", "Bengali"],
  ["mr", "Marathi"],
  ["ta", "Tamil"],
  ["te", "Telugu"],
];

function createForm(user, profile) {
  return {
    farmerName: profile?.farmerName || user?.name || "",
    state: profile?.state || "",
    district: profile?.district || "",
    village: profile?.village || "",
    crop: profile?.crop || "",
    landArea: profile?.landArea ?? "",
    landAreaUnit: profile?.landAreaUnit || "acre",
    sowingDate: profile?.sowingDate || "",
    irrigationType: profile?.irrigationType || "",
    soilType: profile?.soilType || "",
    preferredLanguage: profile?.preferredLanguage || "",
  };
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const { profile, loadError, updateFarmProfile } = useFarmProfile();
  const { pushToast } = useUI();
  const [editing, setEditing] = useState(!profile);
  const [form, setForm] = useState(() => createForm(user, profile));
  const [errors, setErrors] = useState({});
  const [contact, setContact] = useState({
    farmName: user?.farmName || "Green Valley Farm",
    email: user?.email || "",
    phone: "+91 98765 43210",
  });

  useEffect(() => {
    setForm(createForm(user, profile));
    setContact((current) => ({
      ...current,
      farmName: user?.farmName || current.farmName,
      email: user?.email || current.email,
    }));
  }, [user, profile]);

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  }

  function save(e) {
    e.preventDefault();
    const nextErrors = validateFarmProfile(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      pushToast("Please complete the required farm profile fields.", "error");
      return;
    }

    try {
      const savedProfile = updateFarmProfile(form);
      setUser({ ...user, name: savedProfile.farmerName, farmName: contact.farmName, email: contact.email });
      setEditing(false);
      pushToast("Farm profile updated successfully");
    } catch (error) {
      pushToast(error.message || "Farm profile could not be saved.", "error");
    }
  }

  function renderTextField(field, label, options = {}) {
    return (
      <div className="col-md-6 field-group" key={field}>
        <label className="field-label" htmlFor={field}>{label}</label>
        <input
          id={field}
          className={`field-input ${errors[field] ? "is-invalid" : ""}`}
          value={form[field]}
          onChange={(e) => setField(field, e.target.value)}
          disabled={!editing}
          required
          maxLength={options.maxLength || 100}
          {...options}
        />
        {errors[field] && <div className="invalid-feedback d-block">{errors[field]}</div>}
      </div>
    );
  }

  function renderSelectField(field, label, choices, placeholder) {
    return (
      <div className="col-md-6 field-group" key={field}>
        <label className="field-label" htmlFor={field}>{label}</label>
        <select
          id={field}
          className={`field-select ${errors[field] ? "is-invalid" : ""}`}
          value={form[field]}
          onChange={(e) => setField(field, e.target.value)}
          disabled={!editing}
          required
        >
          <option value="">{placeholder}</option>
          {choices.map(([value, text]) => <option key={value} value={value}>{text}</option>)}
        </select>
        {errors[field] && <div className="invalid-feedback d-block">{errors[field]}</div>}
      </div>
    );
  }

  const location = [profile?.village, profile?.district, profile?.state].filter(Boolean).join(", ");
  const languageLabel = languages.find(([value]) => value === profile?.preferredLanguage)?.[1];

  return (
    <div>
      <PageHeading eyebrow="Account" title="My Profile & Farm" subtitle="Manage your farmer details and the farm information used to personalize AgriSense." />

      {loadError && (
        <div className="alert alert-warning" role="alert">
          {loadError} You can enter your details again and save a new profile.
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <GlassCard className="p-4 text-center" hoverable={false}>
            <div className="labour-avatar" style={{ width: 96, height: 96, fontSize: "2.2rem" }}>
              {(profile?.farmerName || user?.name || "F")[0].toUpperCase()}
            </div>
            <h5 style={{ fontWeight: 800, marginBottom: 2 }}>{profile?.farmerName || user?.name || "Farmer"}</h5>
            <div className="text-muted-soft mb-3">{contact.farmName}</div>
            <div className="text-muted-soft mb-2" style={{ fontSize: "0.85rem" }}>
              <FiMapPin size={13} /> {location || "Add your village, district, and state"}
            </div>
            <div className="text-muted-soft" style={{ fontSize: "0.85rem" }}><FiMail size={13} /> {contact.email}</div>
            <div className="text-muted-soft" style={{ fontSize: "0.85rem" }}><FiPhone size={13} /> {contact.phone}</div>
            <hr className="divider-soft" />
            <div className="d-flex justify-content-around gap-2">
              <div><div style={{ fontWeight: 800 }}>{profile ? `${profile.landArea} ${profile.landAreaUnit}${Number(profile.landArea) === 1 ? "" : "s"}` : "—"}</div><div className="text-dim" style={{ fontSize: "0.72rem" }}>Land Size</div></div>
              <div><div style={{ fontWeight: 800 }}>{profile?.crop || "—"}</div><div className="text-dim" style={{ fontSize: "0.72rem" }}>Crop</div></div>
              <div><div style={{ fontWeight: 800 }}>{languageLabel || "—"}</div><div className="text-dim" style={{ fontSize: "0.72rem" }}>Language</div></div>
            </div>
          </GlassCard>
        </div>

        <div className="col-lg-8">
          <GlassCard className="p-4" hoverable={false}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="dash-card-title mb-0">Farmer & Farm Details</div>
              {!editing && <Button variant="outline" size="sm" onClick={() => setEditing(true)}><FiEdit2 /> Edit</Button>}
            </div>
            <form onSubmit={save}>
              <div className="row g-3">
                {renderTextField("farmerName", "Farmer name")}
                {renderTextField("state", "State")}
                {renderTextField("district", "District")}
                {renderTextField("village", "Village / location")}
                {renderSelectField("crop", "Primary crop", cropList.map((crop) => [crop, crop]), "Select a crop")}
                <div className="col-md-6 field-group">
                  <label className="field-label" htmlFor="landArea">Land area</label>
                  <input
                    id="landArea"
                    type="number"
                    min="0.01"
                    step="0.01"
                    className={`field-input ${errors.landArea ? "is-invalid" : ""}`}
                    value={form.landArea}
                    onChange={(e) => setField("landArea", e.target.value)}
                    disabled={!editing}
                    required
                  />
                  {errors.landArea && <div className="invalid-feedback d-block">{errors.landArea}</div>}
                </div>
                {renderSelectField("landAreaUnit", "Land area unit", [["acre", "Acres"], ["hectare", "Hectares"]], "Select a unit")}
                {renderTextField("sowingDate", "Sowing date", { type: "date" })}
                {renderSelectField("irrigationType", "Irrigation type", irrigationTypes.map((type) => [type, type]), "Select irrigation type")}
                {renderSelectField("soilType", "Soil type", soilTypes.map((soil) => [soil, soil]), "Select soil type")}
                {renderSelectField("preferredLanguage", "Preferred language", languages, "Select a language")}

                {editing && (
                  <>
                    <div className="col-12"><hr className="divider-soft my-1" /><div className="dash-card-title mb-2">Contact details</div></div>
                    <div className="col-md-6 field-group">
                      <label className="field-label" htmlFor="farmName">Farm name</label>
                      <input id="farmName" className="field-input" value={contact.farmName} onChange={(e) => setContact({ ...contact, farmName: e.target.value })} />
                    </div>
                    <div className="col-md-6 field-group">
                      <label className="field-label" htmlFor="email">Email</label>
                      <input id="email" type="email" className="field-input" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                    </div>
                    <div className="col-md-6 field-group">
                      <label className="field-label" htmlFor="phone">Phone</label>
                      <input id="phone" type="tel" className="field-input" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                    </div>
                  </>
                )}
              </div>
              {editing && (
                <div className="d-flex gap-2 mt-3">
                  <Button type="submit"><FiSave /> Save Farm Profile</Button>
                  {profile && <Button type="button" variant="ghost" onClick={() => { setForm(createForm(user, profile)); setErrors({}); setEditing(false); }}>Cancel</Button>}
                </div>
              )}
            </form>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
