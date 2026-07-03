import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileSpreadsheet,
  Flame,
  LayoutDashboard,
  ListFilter,
  Loader2,
  LogOut,
  Map,
  MapPin,
  Plus,
  Save,
  Search,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { apiRequest, getGoogleClientId, isDemoMode } from "./services/api";

const navItems = [
  { id: "dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { id: "businesses", label: "Cơ sở", icon: Building2 },
  { id: "map", label: "Bản đồ", icon: Map },
  { id: "plans", label: "Phân công", icon: CalendarDays },
  { id: "inspections", label: "Kiểm tra", icon: ClipboardCheck },
  { id: "reports", label: "Báo cáo", icon: FileSpreadsheet },
];

const emptyBusiness = {
  tenCoSo: "",
  bangHieu: "",
  nganhNghe: "",
  tinhCu: "Lâm Đồng",
  xaPhuong: "",
  diaChi: "",
  diaDiemKinhDoanh: "",
  nguoiDungDau: "",
  soDienThoai: "",
  soGpkd: "",
  ngayCapPccc: "",
  soGiayAntt: "",
  soPhong: "",
  soGiuong: "",
  soLaoDong: "",
  latitude: "",
  longitude: "",
  googleMapsUrl: "",
  trangThai: "Đang hoạt động",
};

const statusLabel = {
  planned: "Đã phân công",
  completed: "Đã kiểm tra",
  overdue: "Quá hạn",
  dat: "Đạt",
  khong_dat: "Không đạt",
  na: "Không áp dụng",
};

const roleLabel = {
  admin: "Quản trị",
  canbo: "Cán bộ",
  viewer: "Chỉ xem",
};

function googleMapsLink(business) {
  if (business?.googleMapsUrl) return business.googleMapsUrl;
  if (business?.latitude && business?.longitude) {
    return `https://www.google.com/maps?q=${business.latitude},${business.longitude}`;
  }
  return "";
}

function googleMapsEmbedUrl(business) {
  if (!business?.latitude || !business?.longitude) return "";
  return `https://www.google.com/maps?q=${business.latitude},${business.longitude}&z=16&output=embed`;
}

function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function GoogleLogin({ onLogin }) {
  const buttonRef = useRef(null);
  const [error, setError] = useState("");
  const clientId = getGoogleClientId();

  useEffect(() => {
    if (!clientId || !window.google || !buttonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => onLogin(response.credential),
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: 280,
      text: "signin_with",
      locale: "vi",
    });
  }, [clientId, onLogin]);

  const handleDemo = async () => {
    setError("");
    try {
      await onLogin("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="login-screen">
      <section className="login-panel">
        <div className="brand-mark">
          <Flame size={28} />
        </div>
        <h1>Quản lý PCCC Lâm Đồng</h1>
        <p>Tập trung hồ sơ cơ sở, kế hoạch kiểm tra, hạng mục PCCC, bản đồ và báo cáo tháng.</p>
        <div className="login-actions">
          {clientId ? <div ref={buttonRef} /> : null}
          <button className="primary" onClick={handleDemo} type="button">
            <ShieldCheck size={18} />
            {isDemoMode ? "Vào app demo" : "Đăng nhập"}
          </button>
        </div>
        {isDemoMode ? <span className="mode-note">Chưa cấu hình Apps Script, app đang dùng dữ liệu demo cục bộ.</span> : null}
        {error ? <span className="error-text">{error}</span> : null}
      </section>
    </main>
  );
}

function Shell({ activeTab, setActiveTab, user, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Flame size={24} />
          </div>
          <div>
            <strong>PCCC Lâm Đồng</strong>
            <span>Quản lý cơ sở</span>
          </div>
        </div>
        <nav>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={activeTab === item.id ? "active" : ""}
                onClick={() => setActiveTab(item.id)}
                type="button"
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="user-box">
          <UserRound size={18} />
          <div>
            <strong>{user?.name || user?.email}</strong>
            <span>{roleLabel[user?.role] || "Chỉ xem"}</span>
          </div>
          <button className="icon-btn" onClick={onLogout} type="button" title="Đăng xuất">
            <LogOut size={17} />
          </button>
        </div>
      </aside>
      <section className="content">{children}</section>
    </div>
  );
}

function PageHeader({ title, subtitle, action }) {
  return (
    <header className="page-header">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action}
    </header>
  );
}

function StatCard({ icon: Icon, label, value, tone = "neutral" }) {
  return (
    <article className={`stat-card ${tone}`}>
      <Icon size={22} />
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

function Dashboard({ dashboard, month, setMonth, businesses, loading }) {
  const topIndustries = Object.entries(dashboard?.byIndustry || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topWards = Object.entries(dashboard?.byWard || {}).sort((a, b) => b[1] - a[1]).slice(0, 6);

  return (
    <>
      <PageHeader
        title="Tổng quan tháng"
        subtitle="Theo dõi kế hoạch, kết quả kiểm tra và các điểm cần xử lý."
        action={
          <label className="month-input">
            <CalendarDays size={17} />
            <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
          </label>
        }
      />
      {loading ? <LoadingState /> : null}
      <section className="stats-grid">
        <StatCard icon={Building2} label="Cơ sở quản lý" value={dashboard?.totals?.businesses || businesses.length} />
        <StatCard icon={CalendarDays} label="Đã phân công" value={dashboard?.totals?.planned || 0} />
        <StatCard icon={CheckCircle2} label="Đã kiểm tra" value={dashboard?.totals?.completed || 0} tone="success" />
        <StatCard icon={XCircle} label="Không đạt" value={dashboard?.totals?.failed || 0} tone="danger" />
      </section>
      <section className="two-column">
        <div className="panel">
          <h3>Cơ sở theo ngành chính</h3>
          <div className="bars">
            {topIndustries.map(([label, value]) => (
              <div className="bar-row" key={label}>
                <span>{label}</span>
                <div><i style={{ width: `${Math.max(8, (value / Math.max(businesses.length, 1)) * 100)}%` }} /></div>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
        <div className="panel">
          <h3>Địa bàn nhiều cơ sở</h3>
          <div className="compact-list">
            {topWards.map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="panel">
        <h3>Cảnh báo tháng {month}</h3>
        <div className="warning-grid">
          <div>
            <strong>{dashboard?.totals?.pending || 0}</strong>
            <span>Chưa kiểm tra</span>
          </div>
          <div>
            <strong>{dashboard?.totals?.overdue || 0}</strong>
            <span>Quá hạn kế hoạch</span>
          </div>
          <div>
            <strong>{dashboard?.totals?.passed || 0}</strong>
            <span>Cơ sở đạt</span>
          </div>
        </div>
      </section>
    </>
  );
}

function BusinessModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(initial || emptyBusiness);

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="modal-backdrop" role="presentation">
      <form
        className="modal wide"
        onSubmit={(event) => {
          event.preventDefault();
          onSave(form);
        }}
      >
        <header>
          <div>
            <h3>{form.id ? "Cập nhật cơ sở" : "Thêm cơ sở"}</h3>
            <p>Thông tin dùng chung cho tìm kiếm, kiểm tra, bản đồ và báo cáo.</p>
          </div>
          <button className="icon-btn" type="button" onClick={onClose} title="Đóng">
            <XCircle size={18} />
          </button>
        </header>
        <div className="form-grid">
          <Field label="Tên cơ sở" value={form.tenCoSo} onChange={(value) => setField("tenCoSo", value)} required />
          <Field label="Bảng hiệu" value={form.bangHieu} onChange={(value) => setField("bangHieu", value)} />
          <Field label="Ngành nghề" value={form.nganhNghe} onChange={(value) => setField("nganhNghe", value)} required />
          <Field label="Xã, phường" value={form.xaPhuong} onChange={(value) => setField("xaPhuong", value)} required />
          <Field label="Địa chỉ" value={form.diaChi} onChange={(value) => setField("diaChi", value)} />
          <Field label="Địa điểm kinh doanh" value={form.diaDiemKinhDoanh} onChange={(value) => setField("diaDiemKinhDoanh", value)} />
          <Field label="Người đứng đầu" value={form.nguoiDungDau} onChange={(value) => setField("nguoiDungDau", value)} />
          <Field label="Số điện thoại" value={form.soDienThoai} onChange={(value) => setField("soDienThoai", value)} />
          <Field label="Số GPKD" value={form.soGpkd} onChange={(value) => setField("soGpkd", value)} />
          <Field label="Ngày cấp PCCC" type="date" value={form.ngayCapPccc} onChange={(value) => setField("ngayCapPccc", value)} />
          <Field label="Số chứng nhận ANTT" value={form.soGiayAntt} onChange={(value) => setField("soGiayAntt", value)} />
          <Field label="Trạng thái" value={form.trangThai} onChange={(value) => setField("trangThai", value)} />
          <Field label="Vĩ độ" value={form.latitude} onChange={(value) => setField("latitude", value)} />
          <Field label="Kinh độ" value={form.longitude} onChange={(value) => setField("longitude", value)} />
          <Field label="Link Google Maps" value={form.googleMapsUrl} onChange={(value) => setField("googleMapsUrl", value)} />
        </div>
        <footer>
          <button type="button" className="ghost" onClick={onClose}>Hủy</button>
          <button type="submit" className="primary"><Save size={17} />Lưu cơ sở</button>
        </footer>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} required={required} />
    </label>
  );
}

function Businesses({ businesses, onSave }) {
  const [query, setQuery] = useState("");
  const [industry, setIndustry] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const industries = useMemo(
    () => [...new Set(businesses.flatMap((item) => String(item.nganhNghe || "").split(";").map((part) => part.trim()).filter(Boolean)))],
    [businesses],
  );

  const filtered = useMemo(() => {
    const needle = normalizeText(query);
    return businesses.filter((business) => {
      const matchesText = !needle || normalizeText(`${business.tenCoSo} ${business.bangHieu} ${business.xaPhuong} ${business.diaChi}`).includes(needle);
      const matchesIndustry = !industry || normalizeText(business.nganhNghe).includes(normalizeText(industry));
      return matchesText && matchesIndustry;
    });
  }, [businesses, industry, query]);

  return (
    <>
      <PageHeader
        title="Danh sách cơ sở"
        subtitle="Tìm nhanh theo tên, bảng hiệu, địa bàn và ngành nghề."
        action={<button className="primary" type="button" onClick={() => { setSelected(null); setModalOpen(true); }}><Plus size={17} />Thêm cơ sở</button>}
      />
      <div className="toolbar">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm tên cơ sở, bảng hiệu, địa chỉ..." />
        </label>
        <label className="select-box">
          <ListFilter size={17} />
          <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
            <option value="">Tất cả ngành nghề</option>
            {industries.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th className="id-column">Mã</th>
              <th>Tên cơ sở</th>
              <th>Địa bàn</th>
              <th>Ngành nghề</th>
              <th>Người đứng đầu</th>
              <th>Bản đồ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((business) => (
              <tr key={business.id} onClick={() => { setSelected(business); setModalOpen(true); }}>
                <td className="id-cell">{business.id}</td>
                <td>
                  <strong>{business.tenCoSo}</strong>
                  <span>{business.bangHieu || business.diaChi}</span>
                </td>
                <td>{business.xaPhuong}</td>
                <td>{business.nganhNghe}</td>
                <td>{business.nguoiDungDau || "Chưa có"}</td>
                <td>{business.latitude && business.longitude ? <span className="map-status"><MapPin size={16} /> Có tọa độ</span> : "Thiếu tọa độ"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      {modalOpen ? <BusinessModal initial={selected} onClose={() => setModalOpen(false)} onSave={(business) => { onSave(business); setModalOpen(false); }} /> : null}
    </>
  );
}

function MapView({ businesses }) {
  const mapRef = useRef(null);
  const nodeRef = useRef(null);
  const markersRef = useRef([]);
  const mapped = useMemo(() => businesses.filter((item) => Number(item.latitude) && Number(item.longitude)), [businesses]);
  const [selectedBusiness, setSelectedBusiness] = useState(mapped[0] || null);

  useEffect(() => {
    if (!nodeRef.current || mapRef.current) return;
    mapRef.current = L.map(nodeRef.current, { scrollWheelZoom: true }).setView([11.75, 108.25], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(mapRef.current);
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = mapped.map((business) => {
      const marker = L.marker([Number(business.latitude), Number(business.longitude)]).addTo(mapRef.current);
      marker.bindPopup(`<strong>${business.tenCoSo}</strong><br>${business.xaPhuong || ""}<br>${business.nganhNghe || ""}<br><span>Đã mở Google Maps nhúng ở khung bên phải</span>`);
      marker.on("click", () => setSelectedBusiness(business));
      return marker;
    });
    if (mapped.length) {
      const bounds = L.latLngBounds(mapped.map((business) => [Number(business.latitude), Number(business.longitude)]));
      mapRef.current.fitBounds(bounds, { padding: [32, 32], maxZoom: 12 });
    }
    if (!selectedBusiness && mapped.length) setSelectedBusiness(mapped[0]);
  }, [mapped, selectedBusiness]);

  const embedUrl = googleMapsEmbedUrl(selectedBusiness);
  const externalUrl = googleMapsLink(selectedBusiness);

  return (
    <>
      <PageHeader title="Bản đồ cơ sở" subtitle="Marker hiển thị các cơ sở đã nhập vĩ độ và kinh độ." />
      <section className="map-layout">
        <div className="map-canvas" ref={nodeRef} />
        <aside className="panel map-list">
          <h3>Google Maps nhúng</h3>
          {selectedBusiness && embedUrl ? (
            <div className="embedded-map-panel">
              <iframe title={`Google Maps - ${selectedBusiness.tenCoSo}`} src={embedUrl} loading="lazy" />
              <strong>{selectedBusiness.tenCoSo}</strong>
              <span>{selectedBusiness.diaDiemKinhDoanh || selectedBusiness.diaChi}</span>
              {externalUrl ? (
                <a href={externalUrl} target="_blank" rel="noreferrer">
                  <ExternalLink size={15} />
                  Mở trên Google Maps
                </a>
              ) : null}
            </div>
          ) : (
            <p className="empty-note">Bấm vào một cơ sở có tọa độ để xem Google Maps nhúng.</p>
          )}
          <h3>Cơ sở có tọa độ</h3>
          <div className="compact-list">
            {mapped.map((business) => (
              <button
                className={`map-business-row ${selectedBusiness?.id === business.id ? "active" : ""}`}
                key={business.id}
                type="button"
                onClick={() => {
                  setSelectedBusiness(business);
                  mapRef.current?.setView([Number(business.latitude), Number(business.longitude)], 15);
                }}
              >
                <span>{business.tenCoSo}</span>
                <strong>{business.xaPhuong}</strong>
              </button>
            ))}
          </div>
          <h3>Cần bổ sung tọa độ</h3>
          <div className="compact-list muted">
            {businesses.filter((item) => !Number(item.latitude) || !Number(item.longitude)).slice(0, 8).map((business) => (
              <div key={business.id}>
                <span>{business.tenCoSo}</span>
                <strong>{business.xaPhuong || "Chưa có"}</strong>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </>
  );
}

function Plans({ businesses, plans, officers, onSave }) {
  const [form, setForm] = useState({
    month: currentMonth(),
    businessId: businesses[0]?.id || "",
    officerName: "",
    officerEmail: "",
    scheduledDate: new Date().toISOString().slice(0, 10),
    status: "planned",
  });

  const businessById = useMemo(() => Object.fromEntries(businesses.map((item) => [item.id, item])), [businesses]);

  useEffect(() => {
    if (!form.officerEmail && officers.length) {
      const firstOfficer = officers[0];
      setForm((prev) => ({ ...prev, officerEmail: firstOfficer.email, officerName: firstOfficer.name }));
    }
  }, [form.officerEmail, officers]);

  return (
    <>
      <PageHeader title="Phân công kiểm tra" subtitle="Lập kế hoạch tháng và giao cán bộ phụ trách từng cơ sở." />
      <section className="split-panel">
        <form
          className="panel form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            onSave(form);
          }}
        >
          <h3>Thêm kế hoạch</h3>
          <Field label="Tháng" type="month" value={form.month} onChange={(value) => setForm((prev) => ({ ...prev, month: value }))} required />
          <label className="field">
            <span>Cơ sở</span>
            <select value={form.businessId} onChange={(event) => setForm((prev) => ({ ...prev, businessId: event.target.value }))} required>
              {businesses.map((business) => <option key={business.id} value={business.id}>{business.tenCoSo}</option>)}
            </select>
          </label>
          <label className="field">
            <span>Cán bộ phụ trách</span>
            <select
              value={form.officerEmail}
              onChange={(event) => {
                const officer = officers.find((item) => item.email === event.target.value);
                setForm((prev) => ({ ...prev, officerEmail: officer?.email || "", officerName: officer?.name || "" }));
              }}
              required
            >
              <option value="">Chọn cán bộ</option>
              {officers.map((officer) => (
                <option key={officer.email} value={officer.email}>{officer.name} - {officer.email}</option>
              ))}
            </select>
          </label>
          <Field label="Ngày dự kiến" type="date" value={form.scheduledDate} onChange={(value) => setForm((prev) => ({ ...prev, scheduledDate: value }))} required />
          <button className="primary" type="submit"><Save size={17} />Lưu phân công</button>
        </form>
        <section className="table-panel">
          <table>
            <thead>
              <tr>
                <th>Tháng</th>
                <th>Cơ sở</th>
                <th>Cán bộ</th>
                <th>Ngày dự kiến</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan) => (
                <tr key={plan.id}>
                  <td>{plan.month}</td>
                  <td>{businessById[plan.businessId]?.tenCoSo || plan.businessId}</td>
                  <td>{plan.officerName || plan.officerEmail || "Chưa phân công"}</td>
                  <td>{plan.scheduledDate}</td>
                  <td><span className={`pill ${plan.status}`}>{statusLabel[plan.status] || plan.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </section>
    </>
  );
}

function ChecklistManager({ checklistItems, onSaveChecklistItem }) {
  const [form, setForm] = useState({ group: "", content: "", required: true });

  function editItem(item) {
    setForm({
      id: item.id,
      group: item.group || "",
      content: item.content || "",
      required: item.required === true || item.required === "TRUE" || item.required === "true",
    });
  }

  return (
    <section className="panel checklist-manager">
      <header className="panel-heading">
        <div>
          <h3>Quản lý hạng mục kiểm tra</h3>
          <p>Thêm hoặc sửa hạng mục kiểm tra PCCC dùng cho các lần kiểm tra sau.</p>
        </div>
      </header>
      <form
        className="checklist-edit-form"
        onSubmit={(event) => {
          event.preventDefault();
          onSaveChecklistItem(form);
          setForm({ group: "", content: "", required: true });
        }}
      >
        <Field label="Nhóm hạng mục" value={form.group} onChange={(value) => setForm((prev) => ({ ...prev, group: value }))} required />
        <Field label="Nội dung hạng mục" value={form.content} onChange={(value) => setForm((prev) => ({ ...prev, content: value }))} required />
        <label className="field">
          <span>Tính chất</span>
          <select value={form.required ? "true" : "false"} onChange={(event) => setForm((prev) => ({ ...prev, required: event.target.value === "true" }))}>
            <option value="true">Bắt buộc</option>
            <option value="false">Khuyến nghị</option>
          </select>
        </label>
        <button className="primary" type="submit"><Save size={17} />{form.id ? "Lưu sửa" : "Thêm hạng mục"}</button>
      </form>
      <div className="checklist-item-list">
        {checklistItems.map((item) => (
          <button key={item.id} type="button" onClick={() => editItem(item)}>
            <strong>{item.content}</strong>
            <span>{item.group} - {item.required ? "Bắt buộc" : "Khuyến nghị"}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Inspections({ businesses, plans, inspections, checklistItems, onSubmit, onSaveChecklistItem }) {
  const openPlans = plans.filter((plan) => plan.status !== "completed");
  const [planId, setPlanId] = useState(openPlans[0]?.id || plans[0]?.id || "");
  const selectedPlan = plans.find((plan) => plan.id === planId);
  const business = businesses.find((item) => item.id === selectedPlan?.businessId);
  const [checklist, setChecklist] = useState(checklistItems.map((item) => ({ itemId: item.id, status: "dat", note: "" })));
  const [meta, setMeta] = useState({
    inspectionDate: new Date().toISOString().slice(0, 10),
    overallStatus: "dat",
    overallConclusion: "",
    notes: "",
    recommendations: "",
    dueDate: "",
    minutesUrl: "",
  });

  useEffect(() => {
    setChecklist((prev) => checklistItems.map((item) => (
      prev.find((entry) => entry.itemId === item.id) || { itemId: item.id, status: "dat", note: "" }
    )));
  }, [checklistItems]);

  function updateChecklist(itemId, patch) {
    setChecklist((prev) => prev.map((item) => (item.itemId === itemId ? { ...item, ...patch } : item)));
  }

  return (
    <>
      <PageHeader title="Nhập kết quả kiểm tra" subtitle="Danh sách hạng mục PCCC theo kế hoạch đã phân công." />
      <ChecklistManager checklistItems={checklistItems} onSaveChecklistItem={onSaveChecklistItem} />
      <section className="split-panel inspection-layout">
        <form
          className="panel form-stack"
          onSubmit={(event) => {
            event.preventDefault();
            if (!selectedPlan) return;
            onSubmit({
              planId: selectedPlan.id,
              businessId: selectedPlan.businessId,
              overallStatus: meta.overallStatus,
              overallConclusion: meta.overallConclusion,
              checklist,
              ...meta,
            });
          }}
        >
          <h3>Thông tin biên bản</h3>
          <label className="field">
            <span>Kế hoạch</span>
            <select value={planId} onChange={(event) => setPlanId(event.target.value)} required>
              {plans.map((plan) => {
                const planBusiness = businesses.find((item) => item.id === plan.businessId);
                return <option key={plan.id} value={plan.id}>{plan.month} - {planBusiness?.tenCoSo || plan.businessId}</option>;
              })}
            </select>
          </label>
          <div className="business-snapshot">
            <strong>{business?.tenCoSo || "Chưa chọn cơ sở"}</strong>
            <span>{business?.diaDiemKinhDoanh || business?.diaChi}</span>
            <span>{business?.nganhNghe}</span>
          </div>
          <Field label="Ngày kiểm tra" type="date" value={meta.inspectionDate} onChange={(value) => setMeta((prev) => ({ ...prev, inspectionDate: value }))} required />
          <label className="field">
            <span>Kết quả tổng quan</span>
            <select value={meta.overallStatus} onChange={(event) => setMeta((prev) => ({ ...prev, overallStatus: event.target.value }))}>
              <option value="dat">Đạt</option>
              <option value="khong_dat">Không đạt</option>
            </select>
          </label>
          <label className="field">
            <span>Kết luận cuối đánh giá</span>
            <textarea
              value={meta.overallConclusion}
              onChange={(event) => setMeta((prev) => ({ ...prev, overallConclusion: event.target.value }))}
              placeholder="Nhập kết luận tổng hợp sau kiểm tra..."
              required
            />
          </label>
          <Field label="Hạn khắc phục" type="date" value={meta.dueDate} onChange={(value) => setMeta((prev) => ({ ...prev, dueDate: value }))} />
          <Field label="Link biên bản" value={meta.minutesUrl} onChange={(value) => setMeta((prev) => ({ ...prev, minutesUrl: value }))} />
          <label className="field">
            <span>Ghi chú</span>
            <textarea value={meta.notes} onChange={(event) => setMeta((prev) => ({ ...prev, notes: event.target.value }))} />
          </label>
          <label className="field">
            <span>Kiến nghị</span>
            <textarea value={meta.recommendations} onChange={(event) => setMeta((prev) => ({ ...prev, recommendations: event.target.value }))} />
          </label>
          <button className="primary" type="submit"><ClipboardCheck size={17} />Lưu kết quả</button>
        </form>
        <section className="panel checklist-panel">
          <h3>Hạng mục kiểm tra</h3>
          {checklistItems.map((item) => {
            const current = checklist.find((entry) => entry.itemId === item.id) || {};
            return (
              <article className="check-row" key={item.id}>
                <div>
                  <strong>{item.content}</strong>
                  <span>{item.group} {item.required ? "Bắt buộc" : "Khuyến nghị"}</span>
                </div>
                <select value={current.status || "dat"} onChange={(event) => updateChecklist(item.id, { status: event.target.value })}>
                  <option value="dat">Đạt</option>
                  <option value="khong_dat">Không đạt</option>
                  <option value="na">Không áp dụng</option>
                </select>
                <input value={current.note || ""} onChange={(event) => updateChecklist(item.id, { note: event.target.value })} placeholder="Ghi chú hạng mục" />
              </article>
            );
          })}
        </section>
      </section>
      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Ngày</th>
              <th>Cơ sở</th>
              <th>Kết quả</th>
              <th>Kết luận tổng quan</th>
              <th>Kiến nghị</th>
            </tr>
          </thead>
          <tbody>
            {inspections.map((inspection) => (
              <tr key={inspection.id}>
                <td>{inspection.inspectionDate}</td>
                <td>{businesses.find((item) => item.id === inspection.businessId)?.tenCoSo || inspection.businessId}</td>
                <td><span className={`pill ${inspection.overallStatus}`}>{statusLabel[inspection.overallStatus]}</span></td>
                <td>{inspection.overallConclusion || "Chưa nhập"}</td>
                <td>{inspection.recommendations || inspection.notes || "Không có"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function Reports({ month, setMonth, reports, onGenerate }) {
  return (
    <>
      <PageHeader
        title="Báo cáo tháng"
        subtitle="Sinh báo cáo tổng hợp PDF/XLSX từ dữ liệu kế hoạch và kết quả kiểm tra."
        action={
          <div className="report-actions">
            <label className="month-input">
              <CalendarDays size={17} />
              <input type="month" value={month} onChange={(event) => setMonth(event.target.value)} />
            </label>
            <button className="primary" type="button" onClick={() => onGenerate(month)}><Download size={17} />Xuất báo cáo</button>
          </div>
        }
      />
      <section className="panel report-panel">
        <h3>Quy trình xuất báo cáo</h3>
        <div className="report-steps">
          <span>1. Chọn tháng</span>
          <span>2. Tổng hợp số liệu</span>
          <span>3. Tạo file Drive</span>
          <span>4. Lưu link báo cáo</span>
        </div>
      </section>
      <section className="table-panel">
        <table>
          <thead>
            <tr>
              <th>Tháng</th>
              <th>Đã kiểm tra</th>
              <th>Đạt</th>
              <th>Không đạt</th>
              <th>Quá hạn</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>{report.month}</td>
                <td>{report.checked}</td>
                <td>{report.passed}</td>
                <td>{report.failed}</td>
                <td>{report.overdue}</td>
                <td>
                  {report.demo ? "Demo" : (
                    <div className="file-links">
                      {report.pdfUrl ? <a href={report.pdfUrl} target="_blank" rel="noreferrer">PDF</a> : null}
                      {report.xlsxUrl ? <a href={report.xlsxUrl} target="_blank" rel="noreferrer">XLSX</a> : null}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

function LoadingState() {
  return (
    <div className="loading-line">
      <Loader2 size={16} />
      Đang tải dữ liệu...
    </div>
  );
}

export default function App() {
  const [session, setSession] = useState(() => JSON.parse(sessionStorage.getItem("pccc-session") || "null"));
  const [activeTab, setActiveTab] = useState("dashboard");
  const [businesses, setBusinesses] = useState([]);
  const [plans, setPlans] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [checklistItems, setChecklistItems] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [reports, setReports] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [month, setMonth] = useState(currentMonth());
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");

  const request = useCallback((action, payload) => apiRequest(action, payload, session), [session]);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    try {
      const [businessData, planData, dashboardData, reportData] = await Promise.all([
        request("listBusinesses"),
        request("listPlans"),
        request("getDashboard", { month }),
        request("listReports").catch(() => ({ reports: [] })),
      ]);
      setBusinesses(businessData.businesses || []);
      setPlans(planData.plans || []);
      setInspections(planData.inspections || []);
      setChecklistItems(planData.checklistItems || []);
      setOfficers(planData.officers || []);
      setDashboard(dashboardData.dashboard);
      setReports(reportData.reports || []);
    } catch (err) {
      setToast(err.message);
    } finally {
      setLoading(false);
    }
  }, [month, request, session]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function handleLogin(idToken) {
    const data = await apiRequest("login", {}, { idToken });
    const nextSession = { idToken, user: data.user, demo: data.demo };
    sessionStorage.setItem("pccc-session", JSON.stringify(nextSession));
    setSession(nextSession);
  }

  async function handleSaveBusiness(business) {
    const data = await request("upsertBusiness", { business });
    setBusinesses(data.businesses || []);
    setToast("Đã lưu cơ sở");
    refresh();
  }

  async function handleSavePlan(plan) {
    const data = await request("upsertPlan", { plan });
    setPlans(data.plans || []);
    setToast("Đã lưu phân công");
    refresh();
  }

  async function handleSubmitInspection(inspection) {
    await request("submitInspection", { inspection });
    setToast("Đã lưu kết quả kiểm tra");
    refresh();
  }

  async function handleSaveChecklistItem(item) {
    const data = await request("upsertChecklistItem", { item });
    setChecklistItems(data.checklistItems || []);
    setToast(item.id ? "Đã cập nhật hạng mục" : "Đã thêm hạng mục");
    refresh();
  }

  async function handleGenerateReport(reportMonth) {
    const data = await request("generateMonthlyReport", { month: reportMonth });
    setReports(data.reports || [data.report, ...reports].filter(Boolean));
    setToast(isDemoMode ? "Đã tạo bản ghi báo cáo demo" : "Đã xuất báo cáo");
    refresh();
  }

  if (!session) return <GoogleLogin onLogin={handleLogin} />;

  return (
    <Shell
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      user={session.user}
      onLogout={() => {
        sessionStorage.removeItem("pccc-session");
        setSession(null);
      }}
    >
      <div className="top-strip">
        <span>{isDemoMode ? "Dữ liệu demo cục bộ" : "Kết nối Apps Script"}</span>
        <strong>{session.user?.email}</strong>
      </div>
      {activeTab === "dashboard" ? <Dashboard dashboard={dashboard} businesses={businesses} month={month} setMonth={setMonth} loading={loading} /> : null}
      {activeTab === "businesses" ? <Businesses businesses={businesses} onSave={handleSaveBusiness} /> : null}
      {activeTab === "map" ? <MapView businesses={businesses} /> : null}
      {activeTab === "plans" ? <Plans businesses={businesses} plans={plans} officers={officers} onSave={handleSavePlan} /> : null}
      {activeTab === "inspections" ? <Inspections businesses={businesses} plans={plans} inspections={inspections} checklistItems={checklistItems} onSubmit={handleSubmitInspection} onSaveChecklistItem={handleSaveChecklistItem} /> : null}
      {activeTab === "reports" ? <Reports month={month} setMonth={setMonth} reports={reports} onGenerate={handleGenerateReport} /> : null}
      {toast ? <button className="toast" onClick={() => setToast("")} type="button">{toast}</button> : null}
    </Shell>
  );
}
