const CONFIG = {
  sheetId: PropertiesService.getScriptProperties().getProperty("SHEET_ID"),
  googleClientId: PropertiesService.getScriptProperties().getProperty("GOOGLE_CLIENT_ID"),
  reportFolderId: PropertiesService.getScriptProperties().getProperty("REPORT_FOLDER_ID"),
};

const SHEETS = {
  Users: ["email", "name", "role", "status"],
  DoanhNghiep: [
    "id", "tenCoSo", "bangHieu", "nganhNghe", "tinhCu", "xaPhuong", "diaChi", "diaDiemKinhDoanh",
    "nguoiDungDau", "soDienThoai", "soGpkd", "ngayCapPccc", "soGiayAntt", "soPhong", "soGiuong",
    "soLaoDong", "latitude", "longitude", "googleMapsUrl", "trangThai", "updatedAt",
  ],
  HangMucPCCC: ["id", "group", "content", "required"],
  KeHoachKiemTra: ["id", "month", "businessId", "officerEmail", "officerName", "scheduledDate", "status", "updatedAt"],
  KetQuaKiemTra: [
    "id", "planId", "businessId", "inspectionDate", "overallStatus", "overallConclusion", "checklistJson", "notes",
    "recommendations", "dueDate", "minutesUrl", "updatedAt",
  ],
  BaoCaoThang: ["id", "month", "generatedAt", "checked", "passed", "failed", "overdue", "pdfUrl", "xlsxUrl"],
};

const DEFAULT_CHECKLIST = [
  ["PCCC-001", "Hồ sơ", "Hồ sơ quản lý, theo dõi hoạt động PCCC được lập và cập nhật", true],
  ["PCCC-002", "Lối thoát nạn", "Lối thoát nạn thông thoáng, có đèn chỉ dẫn và biển báo", true],
  ["PCCC-003", "Điện", "Hệ thống điện, aptomat và dây dẫn bảo đảm an toàn", true],
  ["PCCC-004", "Phương tiện", "Bình chữa cháy, chuông báo, vòi nước và phương tiện tại chỗ còn hiệu lực", true],
  ["PCCC-005", "Tập huấn", "Nhân viên được huấn luyện nghiệp vụ PCCC và cứu nạn cứu hộ", false],
  ["PCCC-006", "Khắc phục", "Các kiến nghị lần trước đã được khắc phục đúng hạn", false],
];

function doGet() {
  return jsonResponse({ ok: true, name: "PCCC Lam Dong API", time: new Date().toISOString() });
}

function doPost(e) {
  try {
    const body = JSON.parse((e.postData && e.postData.contents) || "{}");
    const action = body.action;
    const payload = body.payload || {};
    const user = action === "login" ? verifyLogin(body.idToken) : requireUser(body.idToken);

    const handlers = {
      login: () => ({ user }),
      listBusinesses: () => ({ businesses: readObjects("DoanhNghiep") }),
      upsertBusiness: () => {
        requireRole(user, ["admin"]);
        return upsertBusiness(payload.business || {});
      },
      listPlans: () => ({
        plans: readObjects("KeHoachKiemTra"),
        inspections: readObjects("KetQuaKiemTra").map(parseInspection),
        checklistItems: readObjects("HangMucPCCC").map((item) => ({ ...item, required: item.required === true || item.required === "TRUE" || item.required === "true" })),
        officers: readObjects("Users").filter((item) => item.status === "active" && ["admin", "canbo"].indexOf(item.role) !== -1),
      }),
      upsertChecklistItem: () => {
        requireRole(user, ["admin"]);
        return upsertChecklistItem(payload.item || {});
      },
      upsertPlan: () => {
        requireRole(user, ["admin"]);
        return upsertPlan(payload.plan || {});
      },
      submitInspection: () => {
        requireRole(user, ["admin", "canbo"]);
        return submitInspection(payload.inspection || {});
      },
      getDashboard: () => ({ dashboard: getDashboard(payload.month) }),
      generateMonthlyReport: () => {
        requireRole(user, ["admin"]);
        return generateMonthlyReport(payload.month);
      },
      listReports: () => ({ reports: readObjects("BaoCaoThang") }),
    };

    if (!handlers[action]) throw new Error("Action không hợp lệ: " + action);
    return jsonResponse({ ok: true, data: handlers[action]() });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.message || String(err) });
  }
}

function setupDatabase() {
  const ss = getSpreadsheet();
  Object.keys(SHEETS).forEach((name) => {
    const sheet = ss.getSheetByName(name) || ss.insertSheet(name);
    sheet.clear();
    sheet.getRange(1, 1, 1, SHEETS[name].length).setValues([SHEETS[name]]);
    sheet.setFrozenRows(1);
    sheet.autoResizeColumns(1, SHEETS[name].length);
  });

  const checklistSheet = ss.getSheetByName("HangMucPCCC");
  checklistSheet.getRange(2, 1, DEFAULT_CHECKLIST.length, SHEETS.HangMucPCCC.length).setValues(DEFAULT_CHECKLIST);

  const userSheet = ss.getSheetByName("Users");
  if (userSheet.getLastRow() < 2) {
    userSheet.appendRow(["admin@example.com", "Quản trị hệ thống", "admin", "active"]);
  }
}

function getSpreadsheet() {
  if (!CONFIG.sheetId) throw new Error("Chưa cấu hình Script Property SHEET_ID");
  return SpreadsheetApp.openById(CONFIG.sheetId);
}

function getSheet(name) {
  const sheet = getSpreadsheet().getSheetByName(name);
  if (!sheet) throw new Error("Thiếu sheet: " + name);
  return sheet;
}

function readObjects(name) {
  const sheet = getSheet(name);
  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  return values.slice(1)
    .filter((row) => row.some((cell) => cell !== "" && cell !== null))
    .map((row) => rowToObject(headers, row));
}

function rowToObject(headers, row) {
  return headers.reduce((obj, header, index) => {
    obj[header] = row[index];
    return obj;
  }, {});
}

function writeObjects(name, objects) {
  const sheet = getSheet(name);
  const headers = SHEETS[name];
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (!objects.length) return;
  const rows = objects.map((obj) => headers.map((header) => obj[header] ?? ""));
  sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function makeId(prefix) {
  return (prefix + "-" + Utilities.getUuid().slice(0, 8)).toUpperCase();
}

function upsertBusiness(business) {
  if (!business.tenCoSo) throw new Error("Tên cơ sở là bắt buộc");
  const businesses = readObjects("DoanhNghiep");
  const next = {
    ...business,
    id: business.id || makeId("CS"),
    updatedAt: new Date().toISOString(),
  };
  const exists = businesses.some((item) => item.id === next.id);
  const updated = exists
    ? businesses.map((item) => (item.id === next.id ? { ...item, ...next } : item))
    : [next].concat(businesses);
  writeObjects("DoanhNghiep", updated);
  return { business: next, businesses: updated };
}

function upsertPlan(plan) {
  if (!plan.month || !plan.businessId || !plan.scheduledDate) throw new Error("Thiếu tháng, cơ sở hoặc ngày dự kiến");
  const plans = readObjects("KeHoachKiemTra");
  const next = {
    ...plan,
    id: plan.id || makeId("KH-" + plan.month),
    status: plan.status || "planned",
    updatedAt: new Date().toISOString(),
  };
  const exists = plans.some((item) => item.id === next.id);
  const updated = exists
    ? plans.map((item) => (item.id === next.id ? { ...item, ...next } : item))
    : [next].concat(plans);
  writeObjects("KeHoachKiemTra", updated);
  return { plan: next, plans: updated };
}

function upsertChecklistItem(item) {
  if (!item.group || !item.content) throw new Error("Thiếu nhóm hoặc nội dung hạng mục");
  const checklistItems = readObjects("HangMucPCCC");
  const next = {
    ...item,
    id: item.id || makeId("PCCC"),
    required: item.required === true || item.required === "TRUE" || item.required === "true",
  };
  const exists = checklistItems.some((entry) => entry.id === next.id);
  const updated = exists
    ? checklistItems.map((entry) => (entry.id === next.id ? { ...entry, ...next } : entry))
    : checklistItems.concat([next]);
  writeObjects("HangMucPCCC", updated);
  return { item: next, checklistItems: updated };
}

function submitInspection(inspection) {
  if (!inspection.planId || !inspection.businessId || !inspection.inspectionDate) {
    throw new Error("Thiếu kế hoạch, cơ sở hoặc ngày kiểm tra");
  }
  const inspections = readObjects("KetQuaKiemTra");
  const next = {
    ...inspection,
    id: inspection.id || makeId("KT"),
    checklistJson: JSON.stringify(inspection.checklist || []),
    updatedAt: new Date().toISOString(),
  };
  delete next.checklist;
  const exists = inspections.some((item) => item.id === next.id);
  const updated = exists
    ? inspections.map((item) => (item.id === next.id ? { ...item, ...next } : item))
    : [next].concat(inspections);
  writeObjects("KetQuaKiemTra", updated);

  const plans = readObjects("KeHoachKiemTra").map((plan) => (
    plan.id === inspection.planId ? { ...plan, status: "completed", updatedAt: new Date().toISOString() } : plan
  ));
  writeObjects("KeHoachKiemTra", plans);
  return { inspection: parseInspection(next), inspections: updated.map(parseInspection) };
}

function parseInspection(inspection) {
  return {
    ...inspection,
    checklist: safeJson(inspection.checklistJson, []),
  };
}

function safeJson(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (err) {
    return fallback;
  }
}

function getDashboard(month) {
  const activeMonth = month || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM");
  const businesses = readObjects("DoanhNghiep");
  const plans = readObjects("KeHoachKiemTra").filter((plan) => plan.month === activeMonth);
  const inspections = readObjects("KetQuaKiemTra").map(parseInspection).filter((inspection) => {
    const plan = plans.find((item) => item.id === inspection.planId);
    return Boolean(plan) || String(inspection.inspectionDate || "").indexOf(activeMonth) === 0;
  });
  const completedBusinessIds = unique(inspections.map((item) => item.businessId));
  const today = Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM-dd");
  const overduePlans = plans.filter((plan) => plan.status !== "completed" && plan.scheduledDate && String(plan.scheduledDate) < today);
  const byIndustry = {};
  const byWard = {};

  businesses.forEach((business) => {
    const industry = String(business.nganhNghe || "Chưa phân loại").split(";")[0].trim() || "Chưa phân loại";
    const ward = business.xaPhuong || "Chưa có địa bàn";
    byIndustry[industry] = (byIndustry[industry] || 0) + 1;
    byWard[ward] = (byWard[ward] || 0) + 1;
  });

  return {
    month: activeMonth,
    totals: {
      businesses: businesses.length,
      planned: plans.length,
      completed: completedBusinessIds.length,
      pending: Math.max(plans.length - completedBusinessIds.length, 0),
      passed: inspections.filter((item) => item.overallStatus === "dat").length,
      failed: inspections.filter((item) => item.overallStatus === "khong_dat").length,
      overdue: overduePlans.length,
    },
    byIndustry,
    byWard,
    failedInspections: inspections.filter((item) => item.overallStatus === "khong_dat"),
    overduePlans,
  };
}

function generateMonthlyReport(month) {
  const activeMonth = month || Utilities.formatDate(new Date(), "Asia/Ho_Chi_Minh", "yyyy-MM");
  const dashboard = getDashboard(activeMonth);
  const businesses = readObjects("DoanhNghiep");
  const plans = readObjects("KeHoachKiemTra").filter((plan) => plan.month === activeMonth);
  const inspections = readObjects("KetQuaKiemTra").map(parseInspection);
  const businessById = {};
  businesses.forEach((business) => { businessById[business.id] = business; });

  const reportBook = SpreadsheetApp.create("Báo cáo PCCC " + activeMonth);
  const summary = reportBook.getActiveSheet();
  summary.setName("Tổng hợp");
  summary.getRange("A1:B8").setValues([
    ["Báo cáo PCCC tháng", activeMonth],
    ["Tổng cơ sở quản lý", dashboard.totals.businesses],
    ["Đã phân công", dashboard.totals.planned],
    ["Đã kiểm tra", dashboard.totals.completed],
    ["Đạt", dashboard.totals.passed],
    ["Không đạt", dashboard.totals.failed],
    ["Quá hạn", dashboard.totals.overdue],
    ["Thời gian xuất", new Date()],
  ]);
  summary.getRange("A1:B1").setFontWeight("bold");
  summary.autoResizeColumns(1, 2);

  const detail = reportBook.insertSheet("Chi tiết");
  detail.appendRow(["Kế hoạch", "Cơ sở", "Địa bàn", "Ngày dự kiến", "Ngày kiểm tra", "Kết quả", "Kết luận tổng quan", "Kiến nghị"]);
  plans.forEach((plan) => {
    const inspection = inspections.find((item) => item.planId === plan.id);
    const business = businessById[plan.businessId] || {};
    detail.appendRow([
      plan.id,
      business.tenCoSo || plan.businessId,
      business.xaPhuong || "",
      plan.scheduledDate || "",
      inspection ? inspection.inspectionDate : "",
      inspection ? inspection.overallStatus : "chưa kiểm tra",
      inspection ? inspection.overallConclusion || "" : "",
      inspection ? inspection.recommendations || inspection.notes || "" : "",
    ]);
  });
  detail.autoResizeColumns(1, 8);

  const file = DriveApp.getFileById(reportBook.getId());
  const folder = CONFIG.reportFolderId ? DriveApp.getFolderById(CONFIG.reportFolderId) : DriveApp.getRootFolder();
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);

  const pdfBlob = exportSpreadsheetPdf(reportBook.getId(), "Báo cáo PCCC " + activeMonth + ".pdf");
  const pdfFile = folder.createFile(pdfBlob);

  const report = {
    id: makeId("BC"),
    month: activeMonth,
    generatedAt: new Date().toISOString(),
    checked: dashboard.totals.completed,
    passed: dashboard.totals.passed,
    failed: dashboard.totals.failed,
    overdue: dashboard.totals.overdue,
    pdfUrl: pdfFile.getUrl(),
    xlsxUrl: file.getUrl(),
  };
  const reports = [report].concat(readObjects("BaoCaoThang"));
  writeObjects("BaoCaoThang", reports);
  return { report, reports };
}

function exportSpreadsheetPdf(spreadsheetId, filename) {
  const url = "https://docs.google.com/spreadsheets/d/" + spreadsheetId + "/export?format=pdf&portrait=false&size=A4&fitw=true&sheetnames=false&printtitle=false&pagenumbers=true&gridlines=false&fzr=true";
  const response = UrlFetchApp.fetch(url, {
    headers: { Authorization: "Bearer " + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() >= 300) throw new Error("Không thể xuất PDF báo cáo");
  return response.getBlob().setName(filename);
}

function unique(values) {
  const seen = {};
  return values.filter((value) => {
    if (!value || seen[value]) return false;
    seen[value] = true;
    return true;
  });
}

function verifyLogin(idToken) {
  const token = verifyGoogleToken(idToken);
  const users = readObjects("Users");
  const user = users.find((item) => String(item.email).toLowerCase() === String(token.email).toLowerCase());
  if (!user || user.status !== "active") throw new Error("Tài khoản chưa được cấp quyền");
  return {
    email: user.email,
    name: user.name || token.name || user.email,
    role: user.role || "viewer",
    status: user.status,
  };
}

function requireUser(idToken) {
  return verifyLogin(idToken);
}

function verifyGoogleToken(idToken) {
  if (!CONFIG.googleClientId) throw new Error("Chưa cấu hình Script Property GOOGLE_CLIENT_ID");
  if (!idToken) throw new Error("Thiếu Google ID token");
  const response = UrlFetchApp.fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(idToken), {
    muteHttpExceptions: true,
  });
  if (response.getResponseCode() !== 200) throw new Error("Google token không hợp lệ");
  const token = JSON.parse(response.getContentText());
  if (token.aud !== CONFIG.googleClientId) throw new Error("Google client id không khớp");
  if (token.email_verified !== "true" && token.email_verified !== true) throw new Error("Email Google chưa xác thực");
  return token;
}

function requireRole(user, roles) {
  if (roles.indexOf(user.role) === -1) throw new Error("Tài khoản không có quyền thực hiện thao tác này");
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
