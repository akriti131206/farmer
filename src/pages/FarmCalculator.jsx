import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw, FiTrendingUp, FiDollarSign, FiPieChart } from "react-icons/fi";
import PageHeading from "../components/common/PageHeading";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import NumericField from "../components/calculator/NumericField";
import FarmProfileSummary from "../components/common/FarmProfileSummary";
import FarmModulesNav from "../components/common/FarmModulesNav";
import useFarmWorkspace from "../hooks/useFarmWorkspace";
import { cropList } from "../data/crops";
import {
  calculateFarmEstimate,
  farmExpenseCategories,
  formatIndianRupees,
  validateFarmCalculator,
  yieldUnits,
} from "../services/farmCalculator";
import "./FarmCalculator.css";

function getInitialValues(profile) {
  return {
    crop: profile?.crop || "",
    landArea: profile?.landArea === undefined ? "" : String(profile.landArea),
    landAreaUnit: profile?.landAreaUnit || "acre",
    expectedYield: "",
    yieldUnit: "quintal",
    sellingPrice: "",
    seed: "0",
    fertilizer: "0",
    pesticide: "0",
    labour: "0",
    irrigation: "0",
    machinery: "0",
    other: "0",
  };
}

export default function FarmCalculator() {
  const { profile, crop, landArea, landAreaUnit } = useFarmWorkspace();
  const [values, setValues] = useState(() => getInitialValues(profile));
  const [touched, setTouched] = useState({});
  const errors = useMemo(() => validateFarmCalculator(values), [values]);
  const investmentFields = [
    ...farmExpenseCategories.map(({ id }) => id),
    "landArea",
    "landAreaUnit",
  ];
  const revenueFields = ["expectedYield", "sellingPrice", "yieldUnit"];
  const canCalculateInvestment = investmentFields.every((field) => !errors[field]) && !errors.expenses;
  const canCalculateRevenue = canCalculateInvestment
    && revenueFields.every((field) => !errors[field])
    && values.expectedYield !== ""
    && values.sellingPrice !== "";

  useEffect(() => {
    if (!profile) return;
    setValues((current) => ({
      ...current,
      crop: current.crop || crop || "",
      landArea: current.landArea || String(landArea),
      landAreaUnit: landAreaUnit || current.landAreaUnit,
    }));
  }, [profile, crop, landArea, landAreaUnit]);

  const estimates = useMemo(() => {
    if (!canCalculateInvestment) return null;
    return calculateFarmEstimate({
      ...values,
      expectedYield: values.expectedYield === "" ? "0" : values.expectedYield,
      sellingPrice: values.sellingPrice === "" ? "0" : values.sellingPrice,
    });
  }, [canCalculateInvestment, values]);

  function updateField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function markTouched(field) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function visibleError(field) {
    return touched[field] || values[field] !== "" ? errors[field] : "";
  }

  function reset() {
    setValues(getInitialValues(profile));
    setTouched({});
  }

  return (
    <div>
      <PageHeading
        eyebrow="Farm Planning"
        title="Farm Calculator"
        subtitle="Enter your costs and expected production to see a transparent estimate for this crop and land area."
        action={<Button variant="outline" size="sm" onClick={reset}><FiRefreshCw /> Reset</Button>}
      />

      <FarmProfileSummary title="Farm profile defaults" compact />
      <FarmModulesNav />

      <div className="farm-calculator-disclaimer mb-3">
        Estimates use only the values you enter. No market price, yield, or expense assumptions are supplied by the app.
        Revenue and profit are estimates, not guaranteed outcomes.
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <GlassCard className="p-4" hoverable={false}>
            <h2 className="dash-card-title mb-3">Crop & production</h2>
            <div className="field-group">
              <label className="field-label" htmlFor="calculator-crop">Crop</label>
              <select
                id="calculator-crop"
                className="field-select"
                value={values.crop}
                onChange={(event) => updateField("crop", event.target.value)}
              >
                <option value="">Select crop</option>
                {cropList.map((crop) => <option key={crop} value={crop}>{crop}</option>)}
              </select>
            </div>

            <div className="row">
              <div className="col-7">
                <NumericField
                  id="calculator-land-area"
                  label="Land area"
                  value={values.landArea}
                  onChange={(value) => updateField("landArea", value)}
                  onBlur={() => markTouched("landArea")}
                  error={visibleError("landArea")}
                  min="0.01"
                  required
                />
              </div>
              <div className="col-5 field-group">
                <label className="field-label" htmlFor="calculator-area-unit">Unit</label>
                <select
                  id="calculator-area-unit"
                  className={`field-select ${visibleError("landAreaUnit") ? "is-invalid" : ""}`}
                  value={values.landAreaUnit}
                  onChange={(event) => updateField("landAreaUnit", event.target.value)}
                >
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                </select>
                {visibleError("landAreaUnit") && <div className="invalid-feedback d-block">{visibleError("landAreaUnit")}</div>}
              </div>
            </div>

            <NumericField
              id="calculator-expected-yield"
              label="Expected total yield"
              value={values.expectedYield}
              onChange={(value) => updateField("expectedYield", value)}
              onBlur={() => markTouched("expectedYield")}
              error={visibleError("expectedYield")}
              min="0"
              required
              suffix={values.yieldUnit}
            />

            <div className="field-group">
              <label className="field-label" htmlFor="calculator-yield-unit">Yield unit</label>
              <select
                id="calculator-yield-unit"
                className="field-select"
                value={values.yieldUnit}
                onChange={(event) => updateField("yieldUnit", event.target.value)}
              >
                {yieldUnits.map((unit) => <option key={unit.value} value={unit.value}>{unit.label}</option>)}
              </select>
              <div className="calculator-field-help">Selling price is entered for each selected yield unit.</div>
            </div>

            <NumericField
              id="calculator-selling-price"
              label={`Expected selling price (per ${values.yieldUnit})`}
              value={values.sellingPrice}
              onChange={(value) => updateField("sellingPrice", value)}
              onBlur={() => markTouched("sellingPrice")}
              error={visibleError("sellingPrice")}
              min="0"
              required
              suffix="₹"
            />
          </GlassCard>
        </div>

        <div className="col-lg-7">
          <GlassCard className="p-4" hoverable={false}>
            <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
              <h2 className="dash-card-title mb-0">Expense breakdown</h2>
              <span className="text-dim" style={{ fontSize: "0.76rem" }}>Enter total cost in ₹</span>
            </div>
            <div className="row">
              {farmExpenseCategories.map(({ id, label }) => (
                <div className="col-md-6" key={id}>
                  <NumericField
                    id={`calculator-${id}`}
                    label={label}
                    value={values[id]}
                    onChange={(value) => updateField(id, value)}
                    onBlur={() => markTouched(id)}
                    error={visibleError(id)}
                    min="0"
                    suffix="₹"
                  />
                </div>
              ))}
            </div>
            {(!canCalculateRevenue || errors.expenses) && (
              <div className="calculator-input-hint" role="status">
                Enter a positive land area and non-negative expected yield and selling price to calculate the estimates.
                Expense fields may be left at zero when they do not apply.
                {errors.expenses && <div>{errors.expenses}</div>}
              </div>
            )}
          </GlassCard>
        </div>
      </div>

      <section className="mt-4" aria-labelledby="farm-estimate-heading">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
          <div>
            <div className="eyebrow">Estimate summary</div>
            <h2 id="farm-estimate-heading" className="farm-calculator-summary-heading">Live calculation</h2>
          </div>
          {values.crop && <span className="badge-agri badge-info">{values.crop}</span>}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-12 col-md-4">
            <GlassCard className="stat-tile farm-calculator-total" hoverable={false}>
              <div className="stat-icon" style={{ background: "linear-gradient(135deg,#8d6748,#c9a679)", color: "#fff" }}><FiDollarSign /></div>
              <div className="stat-value">{canCalculateInvestment && estimates ? formatIndianRupees(estimates.totalInvestment) : "—"}</div>
              <div className="stat-label">Total Investment</div>
            </GlassCard>
          </div>
          <div className="col-12 col-md-4">
            <GlassCard className="stat-tile farm-calculator-total" hoverable={false}>
              <div className="stat-icon" style={{ background: "var(--gradient-sky)", color: "#fff" }}><FiPieChart /></div>
              <div className="stat-value">{canCalculateRevenue && estimates ? formatIndianRupees(estimates.estimatedRevenue) : "—"}</div>
              <div className="stat-label">Estimated Revenue</div>
            </GlassCard>
          </div>
          <div className="col-12 col-md-4">
            <GlassCard className="stat-tile farm-calculator-total" hoverable={false}>
              <div className="stat-icon" style={{ background: "var(--gradient-primary)", color: "#fff" }}><FiTrendingUp /></div>
              <div className="stat-value">{canCalculateRevenue && estimates ? formatIndianRupees(estimates.estimatedProfit) : "—"}</div>
              <div className="stat-label">Estimated Profit</div>
            </GlassCard>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-lg-5">
            <GlassCard className="p-4 h-100" hoverable={false}>
              <h3 className="dash-card-title mb-3">Per-acre estimates</h3>
              <div className="calculator-breakdown-row">
                <span>Cost per acre</span>
                <b>{canCalculateInvestment && estimates ? formatIndianRupees(estimates.costPerAcre) : "—"}</b>
              </div>
              <div className="calculator-breakdown-row">
                <span>Revenue per acre · estimate</span>
                <b>{canCalculateRevenue && estimates ? formatIndianRupees(estimates.revenuePerAcre) : "—"}</b>
              </div>
              <div className="calculator-breakdown-row">
                <span>Profit per acre · estimate</span>
                <b>{canCalculateRevenue && estimates ? formatIndianRupees(estimates.profitPerAcre) : "—"}</b>
              </div>
              {values.landAreaUnit === "hectare" && canCalculateInvestment && estimates && (
                <p className="calculator-field-help mb-0 mt-2">
                  Per-acre figures convert {values.landArea} ha to {estimates.landAreaInAcres.toFixed(2)} acres.
                </p>
              )}
            </GlassCard>
          </div>
          <div className="col-lg-7">
            <GlassCard className="p-4 h-100" hoverable={false}>
              <h3 className="dash-card-title mb-3">Expense totals</h3>
              {farmExpenseCategories.map(({ id, label }) => {
                const amount = Number(values[id]);
                const share = canCalculateInvestment && estimates && estimates.totalInvestment > 0
                  ? (amount / estimates.totalInvestment) * 100
                  : 0;
                return (
                  <div className="calculator-expense-row" key={id}>
                    <div className="calculator-expense-topline">
                      <span>{label}</span>
                      <b>{Number.isFinite(amount) && amount >= 0 ? formatIndianRupees(amount) : "—"}</b>
                    </div>
                    <div className="calculator-expense-track" aria-hidden="true">
                      <div className="calculator-expense-fill" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                );
              })}
              <div className="calculator-breakdown-row calculator-investment-row">
                <span>Sum of expenses = total investment</span>
                <b>{canCalculateInvestment && estimates ? formatIndianRupees(estimates.totalInvestment) : "—"}</b>
              </div>
            </GlassCard>
          </div>
        </div>

        <GlassCard className="p-3 mt-3" hoverable={false}>
          <div className="calculator-formulas">
            <div><b>Total Investment</b> = seed + fertilizer + pesticide + labour + irrigation + machinery + other expenses</div>
            <div><b>Estimated Revenue</b> = expected total yield × expected selling price per selected yield unit</div>
            <div><b>Estimated Profit</b> = estimated revenue − total investment</div>
            <div><b>Per-acre value</b> = corresponding total ÷ land area in acres (hectares converted using 1 ha = 2.47105 acres)</div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
