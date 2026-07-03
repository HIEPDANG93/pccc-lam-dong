import { checklistItems, seedBusinesses, seedInspections, seedPlans, seedUsers } from "../data/seed";

const STORAGE_KEY = "pccc-lam-dong-demo-v3";

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    const migrated = {
      ...parsed,
      user: parsed.user || seedUsers[0],
      users: parsed.users || seedUsers,
      checklistItems: parsed.checklistItems || checklistItems,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    return migrated;
  }
  const initial = {
    user: {
      ...seedUsers[0],
    },
    users: seedUsers,
    businesses: seedBusinesses,
    checklistItems,
    plans: seedPlans,
    inspections: seedInspections,
    reports: [],
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

function monthKey(value) {
  return value || new Date().toISOString().slice(0, 7);
}

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
}

function computeDashboard(state, month) {
  const activeMonth = monthKey(month);
  const plans = state.plans.filter((plan) => plan.month === activeMonth);
  const inspections = state.inspections.filter((inspection) => {
    const plan = state.plans.find((item) => item.id === inspection.planId);
    return plan?.month === activeMonth || inspection.inspectionDate?.startsWith(activeMonth);
  });
  const completedBusinessIds = new Set(inspections.map((item) => item.businessId));
  const failed = inspections.filter((item) => item.overallStatus === "khong_dat");
  const today = new Date().toISOString().slice(0, 10);
  const overdue = plans.filter((plan) => plan.status !== "completed" && plan.scheduledDate && plan.scheduledDate < today);

  const byIndustry = state.businesses.reduce((acc, business) => {
    const key = business.nganhNghe?.split(";")[0]?.trim() || "Chưa phân loại";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const byWard = state.businesses.reduce((acc, business) => {
    const key = business.xaPhuong || "Chưa có địa bàn";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  return {
    month: activeMonth,
    totals: {
      businesses: state.businesses.length,
      planned: plans.length,
      completed: completedBusinessIds.size,
      pending: Math.max(plans.length - completedBusinessIds.size, 0),
      passed: inspections.filter((item) => item.overallStatus === "dat").length,
      failed: failed.length,
      overdue: overdue.length,
    },
    byIndustry,
    byWard,
    failedInspections: failed,
    overduePlans: overdue,
  };
}

export async function mockRequest(action, payload = {}) {
  const state = loadState();

  switch (action) {
    case "login":
      return { user: state.user, demo: true };
    case "listBusinesses":
      return { businesses: state.businesses };
    case "upsertBusiness": {
      const business = payload.business || {};
      const next = business.id ? business : { ...business, id: makeId("CS") };
      const exists = state.businesses.some((item) => item.id === next.id);
      const businesses = exists
        ? state.businesses.map((item) => (item.id === next.id ? { ...item, ...next } : item))
        : [next, ...state.businesses];
      return { business: next, businesses: saveState({ ...state, businesses }).businesses };
    }
    case "listPlans":
      return {
        plans: state.plans,
        inspections: state.inspections,
        checklistItems: state.checklistItems,
        officers: state.users.filter((user) => user.status === "active" && ["admin", "canbo"].includes(user.role)),
      };
    case "upsertChecklistItem": {
      const item = payload.item || {};
      const next = item.id ? item : { ...item, id: makeId("PCCC") };
      const exists = state.checklistItems.some((entry) => entry.id === next.id);
      const checklistItemsNext = exists
        ? state.checklistItems.map((entry) => (entry.id === next.id ? { ...entry, ...next } : entry))
        : [...state.checklistItems, next];
      return { item: next, checklistItems: saveState({ ...state, checklistItems: checklistItemsNext }).checklistItems };
    }
    case "upsertPlan": {
      const plan = payload.plan || {};
      const next = plan.id ? plan : { ...plan, id: makeId(`KH-${plan.month || monthKey()}`), status: plan.status || "planned" };
      const exists = state.plans.some((item) => item.id === next.id);
      const plans = exists
        ? state.plans.map((item) => (item.id === next.id ? { ...item, ...next } : item))
        : [next, ...state.plans];
      return { plan: next, plans: saveState({ ...state, plans }).plans };
    }
    case "submitInspection": {
      const inspection = payload.inspection || {};
      const next = inspection.id ? inspection : { ...inspection, id: makeId("KT") };
      const inspections = state.inspections.some((item) => item.id === next.id)
        ? state.inspections.map((item) => (item.id === next.id ? { ...item, ...next } : item))
        : [next, ...state.inspections];
      const plans = state.plans.map((plan) => (plan.id === next.planId ? { ...plan, status: "completed" } : plan));
      return { inspection: next, inspections: saveState({ ...state, plans, inspections }).inspections };
    }
    case "getDashboard":
      return { dashboard: computeDashboard(state, payload.month) };
    case "generateMonthlyReport": {
      const dashboard = computeDashboard(state, payload.month);
      const report = {
        id: makeId("BC"),
        month: dashboard.month,
        generatedAt: new Date().toISOString(),
        checked: dashboard.totals.completed,
        passed: dashboard.totals.passed,
        failed: dashboard.totals.failed,
        overdue: dashboard.totals.overdue,
        pdfUrl: "",
        xlsxUrl: "",
        demo: true,
      };
      const reports = [report, ...state.reports];
      return { report, reports: saveState({ ...state, reports }).reports };
    }
    case "listReports":
      return { reports: state.reports };
    default:
      throw new Error(`Unknown mock action: ${action}`);
  }
}
