export function departmentBudgetTotal(departments) {
  return Object.values(departments).reduce((sum, dept) => sum + (dept.budget ?? 0), 0);
}

export function departmentOperatingCost(departments) {
  return Math.round(departmentBudgetTotal(departments) * 0.42);
}

export function setDepartmentBudget(departments, departmentId, budget) {
  if (!departments[departmentId]) return departments;
  const nextBudget = Number(budget);
  if (!Number.isFinite(nextBudget)) return departments;
  return {
    ...departments,
    [departmentId]: {
      ...departments[departmentId],
      budget: Math.max(0, nextBudget),
    },
  };
}

export function budgetPressure(metrics, departments) {
  const spend = departmentOperatingCost(departments);
  const operating = metrics.budget ?? 0;
  return {
    spend,
    rawSpend: departmentBudgetTotal(departments),
    operating,
    gap: operating - spend,
    strained: operating - spend < 15,
  };
}
