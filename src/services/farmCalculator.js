export const farmExpenseCategories = [
  { id: "seed", label: "Seed cost" },
  { id: "fertilizer", label: "Fertilizer cost" },
  { id: "pesticide", label: "Pesticide cost" },
  { id: "labour", label: "Labour cost" },
  { id: "irrigation", label: "Irrigation cost" },
  { id: "machinery", label: "Machinery cost" },
  { id: "other", label: "Other expenses" },
];

export const yieldUnits = [
  { value: "kg", label: "Kilograms (kg)" },
  { value: "quintal", label: "Quintals (q)" },
  { value: "tonne", label: "Tonnes (t)" },
];

export function validateFarmCalculator(values) {
  const errors = {};
  const numericFields = [
    ...farmExpenseCategories.map(({ id }) => id),
    "landArea",
    "expectedYield",
    "sellingPrice",
  ];

  for (const field of numericFields) {
    const value = values[field];
    const required = ["landArea", "expectedYield", "sellingPrice"].includes(field);

    if (value === "" || value === null || value === undefined) {
      if (required) errors[field] = "This value is required.";
      continue;
    }

    if (!errors.landArea && !errors.landAreaUnit) {
      const area = Number(values.landArea);
      const areaInAcres = values.landAreaUnit === "hectare" ? area * 2.47105 : area;
      if (!Number.isFinite(areaInAcres) || areaInAcres <= 0) {
        errors.landArea = "Land area is outside the supported calculation range.";
      }
    }

    const expenseTotal = farmExpenseCategories.reduce((total, { id }) => {
      const value = values[id] === "" ? 0 : Number(values[id]);
      return total + (Number.isFinite(value) && value >= 0 ? value : 0);
    }, 0);
    if (!Number.isFinite(expenseTotal)) {
      errors.expenses = "Combined expenses are outside the supported calculation range.";
    }

    if (!errors.landArea && !errors.landAreaUnit && Number.isFinite(expenseTotal)) {
      const area = Number(values.landArea);
      const areaInAcres = values.landAreaUnit === "hectare" ? area * 2.47105 : area;
      if (!Number.isFinite(expenseTotal / areaInAcres)) {
        errors.expenses = "Per-acre expenses are outside the supported calculation range.";
      }
    }

    if (!errors.expectedYield && !errors.sellingPrice) {
      const revenue = Number(values.expectedYield) * Number(values.sellingPrice);
      if (!Number.isFinite(revenue)) {
        errors.expectedYield = "Yield and selling price are outside the supported calculation range.";
      } else if (!errors.landArea && !errors.landAreaUnit) {
        const area = Number(values.landArea);
        const areaInAcres = values.landAreaUnit === "hectare" ? area * 2.47105 : area;
        if (!Number.isFinite(revenue / areaInAcres)) {
          errors.expectedYield = "Revenue per acre is outside the supported calculation range.";
        }
      }
    }

    const numericValue = Number(value);
    if (!Number.isFinite(numericValue)) {
      errors[field] = "Enter a valid number.";
    } else if (numericValue < 0) {
      errors[field] = "Negative values are not allowed.";
    } else if (field === "landArea" && numericValue === 0) {
      errors[field] = "Land area must be greater than zero.";
    }
  }

  if (!["acre", "hectare"].includes(values.landAreaUnit)) {
    errors.landAreaUnit = "Choose acres or hectares.";
  }

  if (!yieldUnits.some(({ value }) => value === values.yieldUnit)) {
    errors.yieldUnit = "Choose a yield unit.";
  }

  return errors;
}

export function calculateFarmEstimate(values) {
  const landArea = Number(values.landArea);
  const landAreaInAcres = values.landAreaUnit === "hectare" ? landArea * 2.47105 : landArea;
  const expenses = farmExpenseCategories.map(({ id, label }) => ({
    id,
    label,
    amount: Number(values[id]),
  }));
  const totalInvestment = expenses.reduce((total, item) => total + item.amount, 0);
  const expectedRevenue = Number(values.expectedYield) * Number(values.sellingPrice);
  const estimatedProfit = expectedRevenue - totalInvestment;
  const perAcreValues = [
    totalInvestment / landAreaInAcres,
    expectedRevenue / landAreaInAcres,
    estimatedProfit / landAreaInAcres,
  ];

  if (
    !Number.isFinite(totalInvestment)
    || !Number.isFinite(expectedRevenue)
    || !Number.isFinite(estimatedProfit)
    || perAcreValues.some((value) => !Number.isFinite(value))
  ) {
    throw new RangeError("Values exceed the calculator's supported numeric range.");
  }

  return {
    expenses,
    totalInvestment,
    estimatedRevenue: expectedRevenue,
    estimatedProfit,
    landAreaInAcres,
    costPerAcre: perAcreValues[0],
    revenuePerAcre: perAcreValues[1],
    profitPerAcre: perAcreValues[2],
  };
}

export function formatIndianRupees(value) {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value);
}
