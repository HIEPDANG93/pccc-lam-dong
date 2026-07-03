export const checklistItems = [
  { id: "PCCC-001", group: "Hồ sơ", content: "Hồ sơ quản lý, theo dõi hoạt động PCCC được lập và cập nhật", required: true },
  { id: "PCCC-002", group: "Lối thoát nạn", content: "Lối thoát nạn thông thoáng, có đèn chỉ dẫn và biển báo", required: true },
  { id: "PCCC-003", group: "Điện", content: "Hệ thống điện, aptomat và dây dẫn bảo đảm an toàn", required: true },
  { id: "PCCC-004", group: "Phương tiện", content: "Bình chữa cháy, chuông báo, vòi nước và phương tiện tại chỗ còn hiệu lực", required: true },
  { id: "PCCC-005", group: "Tập huấn", content: "Nhân viên được huấn luyện nghiệp vụ PCCC và cứu nạn cứu hộ", required: false },
  { id: "PCCC-006", group: "Khắc phục", content: "Các kiến nghị lần trước đã được khắc phục đúng hạn", required: false },
];

export const seedUsers = [
  { email: "admin@example.com", name: "Quản trị demo", role: "admin", status: "active" },
  { email: "canbo@example.com", name: "Cán bộ phụ trách", role: "canbo", status: "active" },
  { email: "canbo2@example.com", name: "Tổ kiểm tra Bảo Lộc", role: "canbo", status: "active" },
  { email: "canbo3@example.com", name: "Tổ kiểm tra Đức Trọng", role: "canbo", status: "active" },
  { email: "viewer@example.com", name: "Tài khoản xem", role: "viewer", status: "active" },
];

const businessRows = [
  {
    tenCoSo: "Công ty TNHH Demo Du lịch Hồ Tuyền Lâm",
    bangHieu: "Khách sạn Demo Tuyền Lâm",
    nganhNghe: "Lưu trú; Nhà hàng",
    xaPhuong: "Phường Xuân Hương - Đà Lạt",
    diaChi: "Khu chức năng VII.2 - KDL Hồ Tuyền Lâm",
    diaDiemKinhDoanh: "Khu chức năng VII.2 - KDL Hồ Tuyền Lâm, Phường 4, Thành phố Đà Lạt",
    nguoiDungDau: "Nguyễn Minh An",
    soGpkd: "5801000001",
    soGiayAntt: "PCCC-DEMO-001",
    soPhong: "68",
    soGiuong: "120",
    soLaoDong: "42",
    latitude: 11.8991,
    longitude: 108.4051,
  },
  {
    tenCoSo: "Công ty TNHH Demo Mai Anh Đào",
    bangHieu: "Khách sạn Demo Mai Anh Đào",
    nganhNghe: "Lưu trú; Xoa bóp",
    xaPhuong: "Phường Lâm Viên - Đà Lạt",
    diaChi: "Số 106A Mai Anh Đào",
    diaDiemKinhDoanh: "Số 106A Mai Anh Đào, Phường 8, Thành phố Đà Lạt",
    nguoiDungDau: "Trần Hữu Nghĩa",
    soGpkd: "5801000002",
    soGiayAntt: "PCCC-DEMO-002",
    soPhong: "92",
    soGiuong: "150",
    soLaoDong: "55",
    latitude: 11.9744,
    longitude: 108.4451,
  },
  {
    tenCoSo: "Chi nhánh Công ty Demo Dịch vụ Prenn",
    bangHieu: "Khu du lịch Demo Prenn",
    nganhNghe: "Khu du lịch; Nhà hàng; Lưu trú",
    xaPhuong: "Phường Xuân Hương - Đà Lạt",
    diaChi: "Chân đèo Prenn, QL20",
    diaDiemKinhDoanh: "Chân đèo Prenn, QL20, Phường 3, Thành phố Đà Lạt",
    nguoiDungDau: "Lê Kim Anh",
    soGpkd: "5801000003",
    soGiayAntt: "PCCC-DEMO-003",
    soPhong: "81",
    soGiuong: "132",
    soLaoDong: "64",
    latitude: 11.8721,
    longitude: 108.4437,
  },
  {
    tenCoSo: "Công ty Cổ phần Demo Trung tâm Đà Lạt",
    bangHieu: "Khách sạn Demo Trần Phú",
    nganhNghe: "Lưu trú; Karaoke; Nhà hàng",
    xaPhuong: "Phường 3",
    diaChi: "Số 15 Trần Phú",
    diaDiemKinhDoanh: "Số 15 Trần Phú, Phường 3, Thành phố Đà Lạt",
    nguoiDungDau: "Phạm Hồng Xuân",
    soGpkd: "5801000004",
    soGiayAntt: "PCCC-DEMO-004",
    soPhong: "120",
    soGiuong: "210",
    soLaoDong: "76",
    latitude: 11.9405,
    longitude: 108.4382,
  },
  {
    tenCoSo: "Công ty TNHH Demo Sản xuất Bảo Lộc",
    bangHieu: "Xưởng Demo Hà Giang",
    nganhNghe: "Sản xuất; Kho hàng",
    xaPhuong: "Phường Lộc Sơn",
    diaChi: "Số 22 đường Hà Giang",
    diaDiemKinhDoanh: "Số 22 đường Hà Giang, Phường Lộc Sơn, Thành phố Bảo Lộc",
    nguoiDungDau: "Nguyễn Thị Thảo",
    soGpkd: "5801000005",
    soGiayAntt: "PCCC-DEMO-005",
    soLaoDong: "38",
    latitude: 11.548,
    longitude: 107.806,
  },
  {
    tenCoSo: "Công ty TNHH Demo Kho vận Lộc Phát",
    bangHieu: "Kho Demo Lộc Phát",
    nganhNghe: "Kho hàng; Sản xuất; Thương mại",
    xaPhuong: "Phường Lộc Phát",
    diaChi: "Số 76 Phạm Ngọc Thạch, KCN Hà Giang",
    diaDiemKinhDoanh: "Số 76 Phạm Ngọc Thạch, KCN Hà Giang, Phường Lộc Phát, Thành phố Bảo Lộc",
    nguoiDungDau: "Võ Thành Sơn",
    soGpkd: "5801000006",
    soGiayAntt: "PCCC-DEMO-006",
    soLaoDong: "44",
    latitude: 11.546,
    longitude: 107.822,
  },
  { tenCoSo: "Công ty TNHH Demo Tân Hồng Tây Nguyên", bangHieu: "Nhà xưởng Demo Tân Hồng", nganhNghe: "Sản xuất; Thiết bị; Kho hàng", xaPhuong: "Phường Lộc Phát", diaChi: "Khu công nghiệp Hà Giang", diaDiemKinhDoanh: "Khu công nghiệp Hà Giang, Phường Lộc Phát, Thành phố Bảo Lộc", nguoiDungDau: "Đặng Minh Khôi", soGpkd: "5801000007", soGiayAntt: "PCCC-DEMO-007", soLaoDong: "52", latitude: 11.551, longitude: 107.824 },
  { tenCoSo: "Công ty Cổ phần Demo May Lâm Đồng", bangHieu: "Xưởng may Demo Bảo Lộc", nganhNghe: "Sản xuất; May mặc; Kho hàng", xaPhuong: "Phường Lộc Phát", diaChi: "Số 80 Phạm Ngọc Thạch", diaDiemKinhDoanh: "Số 80 Phạm Ngọc Thạch, Phường Lộc Phát, Thành phố Bảo Lộc", nguoiDungDau: "Lê Viết Thái", soGpkd: "5801000008", soGiayAntt: "PCCC-DEMO-008", soLaoDong: "118", latitude: 11.544, longitude: 107.826 },
  { tenCoSo: "Công ty TNHH Demo Công nghệ Mới EU", bangHieu: "Văn phòng Demo Phan Đình Phùng", nganhNghe: "Thương mại; Thiết bị", xaPhuong: "Phường Lộc Tiến", diaChi: "389 Phan Đình Phùng", diaDiemKinhDoanh: "389 Phan Đình Phùng, Phường Lộc Tiến, Thành phố Bảo Lộc", nguoiDungDau: "Nguyễn Mậu Linh", soGpkd: "5801000009", soGiayAntt: "PCCC-DEMO-009", soLaoDong: "21", latitude: 11.553, longitude: 107.815 },
  { tenCoSo: "Công ty TNHH Demo Z20 Lộc Sơn", bangHieu: "Cửa hàng Demo Nguyễn Văn Cừ", nganhNghe: "Thương mại; Kho hàng", xaPhuong: "Phường Lộc Sơn", diaChi: "101A/35 Nguyễn Văn Cừ", diaDiemKinhDoanh: "101A/35 Nguyễn Văn Cừ, Phường Lộc Sơn, Thành phố Bảo Lộc", nguoiDungDau: "Mai Thị Nụ", soGpkd: "5801000010", soGiayAntt: "PCCC-DEMO-010", soLaoDong: "18", latitude: 11.536, longitude: 107.807 },
  { tenCoSo: "Công ty TNHH Demo Phú Bảo Vinh", bangHieu: "Kho Demo Đạm Bri", nganhNghe: "Kho hàng; Thương mại", xaPhuong: "Xã Đạm Bri", diaChi: "9/1 Tản Đà", diaDiemKinhDoanh: "9/1 Tản Đà, Xã Đạm Bri, Thành phố Bảo Lộc", nguoiDungDau: "Lê Thị Mỹ Nhân", soGpkd: "5801000011", soGiayAntt: "PCCC-DEMO-011", soLaoDong: "16", latitude: 11.588, longitude: 107.748 },
  { tenCoSo: "Công ty TNHH Demo Tuấn Tài Phát", bangHieu: "Cửa hàng Demo Lộc Tiến", nganhNghe: "Thương mại; Dịch vụ", xaPhuong: "Phường Lộc Tiến", diaChi: "380/1/12B Phan Đình Phùng", diaDiemKinhDoanh: "380/1/12B Phan Đình Phùng, Phường Lộc Tiến, Thành phố Bảo Lộc", nguoiDungDau: "Phạm Văn Thành", soGpkd: "5801000012", soGiayAntt: "PCCC-DEMO-012", soLaoDong: "12", latitude: 11.557, longitude: 107.818 },
  { tenCoSo: "Công ty TNHH Demo Lữ hành Langbiang", bangHieu: "Khu dịch vụ Demo Langbiang", nganhNghe: "Khu du lịch; Nhà hàng; Dịch vụ vui chơi", xaPhuong: "Thị trấn Lạc Dương", diaChi: "Đường Langbiang", diaDiemKinhDoanh: "Đường Langbiang, Thị trấn Lạc Dương, Huyện Lạc Dương", nguoiDungDau: "K'Brừm Hòa", soGpkd: "5801000013", soGiayAntt: "PCCC-DEMO-013", soLaoDong: "36", latitude: 12.016, longitude: 108.441 },
  { tenCoSo: "Hộ kinh doanh Demo Nhà hàng Liên Nghĩa", bangHieu: "Nhà hàng Demo Liên Nghĩa", nganhNghe: "Nhà hàng; Karaoke", xaPhuong: "Thị trấn Liên Nghĩa", diaChi: "Đường Thống Nhất", diaDiemKinhDoanh: "Đường Thống Nhất, Thị trấn Liên Nghĩa, Huyện Đức Trọng", nguoiDungDau: "Đỗ Thanh Bình", soGpkd: "5801000014", soGiayAntt: "PCCC-DEMO-014", soLaoDong: "24", latitude: 11.735, longitude: 108.373 },
  { tenCoSo: "Công ty TNHH Demo Kho Nông sản Đức Trọng", bangHieu: "Kho Demo Liên Khương", nganhNghe: "Kho hàng; Nông sản", xaPhuong: "Xã Liên Hiệp", diaChi: "Khu vực Liên Khương", diaDiemKinhDoanh: "Khu vực Liên Khương, Xã Liên Hiệp, Huyện Đức Trọng", nguoiDungDau: "Hoàng Đức Tài", soGpkd: "5801000015", soGiayAntt: "PCCC-DEMO-015", soLaoDong: "31", latitude: 11.752, longitude: 108.392 },
  { tenCoSo: "Công ty TNHH Demo Xăng dầu Phú Hội", bangHieu: "Cửa hàng xăng dầu Demo Phú Hội", nganhNghe: "Xăng dầu; Khí hóa lỏng", xaPhuong: "Xã Phú Hội", diaChi: "Quốc lộ 20", diaDiemKinhDoanh: "Quốc lộ 20, Xã Phú Hội, Huyện Đức Trọng", nguoiDungDau: "Nguyễn Quốc Tuấn", soGpkd: "5801000016", soGiayAntt: "PCCC-DEMO-016", soLaoDong: "14", latitude: 11.708, longitude: 108.321 },
  { tenCoSo: "Công ty Cổ phần Demo Chè Di Linh", bangHieu: "Nhà máy Demo Di Linh", nganhNghe: "Sản xuất; Chế biến nông sản; Kho hàng", xaPhuong: "Thị trấn Di Linh", diaChi: "Đường Hùng Vương", diaDiemKinhDoanh: "Đường Hùng Vương, Thị trấn Di Linh, Huyện Di Linh", nguoiDungDau: "Trương Văn Phúc", soGpkd: "5801000017", soGiayAntt: "PCCC-DEMO-017", soLaoDong: "86", latitude: 11.58, longitude: 108.076 },
  { tenCoSo: "Hộ kinh doanh Demo Karaoke Hòa Ninh", bangHieu: "Karaoke Demo Hòa Ninh", nganhNghe: "Karaoke; Dịch vụ giải trí", xaPhuong: "Xã Hòa Ninh", diaChi: "Đường liên xã Hòa Ninh", diaDiemKinhDoanh: "Đường liên xã Hòa Ninh, Huyện Di Linh", nguoiDungDau: "Bùi Thị Kim Chi", soGpkd: "5801000018", soGiayAntt: "PCCC-DEMO-018", soPhong: "12", soLaoDong: "10", latitude: 11.653, longitude: 108.036 },
  { tenCoSo: "Công ty TNHH Demo Nông sản Lâm Hà", bangHieu: "Kho Demo Nam Ban", nganhNghe: "Kho hàng; Nông sản; Sản xuất", xaPhuong: "Thị trấn Nam Ban", diaChi: "Đường 2 tháng 4", diaDiemKinhDoanh: "Đường 2 tháng 4, Thị trấn Nam Ban, Huyện Lâm Hà", nguoiDungDau: "Phan Nhật Minh", soGpkd: "5801000019", soGiayAntt: "PCCC-DEMO-019", soLaoDong: "47", latitude: 11.808, longitude: 108.203 },
  { tenCoSo: "Công ty TNHH Demo Resort Tà Nung", bangHieu: "Resort Demo Tà Nung", nganhNghe: "Lưu trú; Nhà hàng; Dịch vụ vui chơi", xaPhuong: "Xã Tà Nung", diaChi: "Đường tỉnh 725", diaDiemKinhDoanh: "Đường tỉnh 725, Xã Tà Nung, Thành phố Đà Lạt", nguoiDungDau: "Vũ Thị Thu Hà", soGpkd: "5801000020", soGiayAntt: "PCCC-DEMO-020", soPhong: "35", soGiuong: "70", soLaoDong: "32", latitude: 11.914, longitude: 108.322 },
  { tenCoSo: "Trung tâm thương mại Demo Đơn Dương", bangHieu: "Siêu thị Demo Dran", nganhNghe: "Trung tâm thương mại; Kho hàng", xaPhuong: "Thị trấn Dran", diaChi: "Đường Lê Lợi", diaDiemKinhDoanh: "Đường Lê Lợi, Thị trấn Dran, Huyện Đơn Dương", nguoiDungDau: "Lâm Quốc Dũng", soGpkd: "5801000021", soGiayAntt: "PCCC-DEMO-021", soLaoDong: "62", latitude: 11.764, longitude: 108.585 },
  { tenCoSo: "Công ty TNHH Demo Rau hoa Đơn Dương", bangHieu: "Kho lạnh Demo Ka Đô", nganhNghe: "Kho lạnh; Nông sản; Sản xuất", xaPhuong: "Xã Ka Đô", diaChi: "Khu sản xuất Ka Đô", diaDiemKinhDoanh: "Khu sản xuất Ka Đô, Huyện Đơn Dương", nguoiDungDau: "Ngô Anh Khoa", soGpkd: "5801000022", soGiayAntt: "PCCC-DEMO-022", soLaoDong: "58", latitude: 11.768, longitude: 108.512 },
  { tenCoSo: "Công ty TNHH Demo Chế biến Bảo Lâm", bangHieu: "Nhà máy Demo Lộc An", nganhNghe: "Sản xuất; Chế biến nông sản", xaPhuong: "Xã Lộc An", diaChi: "Cụm công nghiệp Lộc An", diaDiemKinhDoanh: "Cụm công nghiệp Lộc An, Huyện Bảo Lâm", nguoiDungDau: "Hồ Minh Quân", soGpkd: "5801000023", soGiayAntt: "PCCC-DEMO-023", soLaoDong: "74", latitude: 11.7, longitude: 107.735 },
  { tenCoSo: "Hộ kinh doanh Demo Nhà nghỉ Lộc Thắng", bangHieu: "Nhà nghỉ Demo Lộc Thắng", nganhNghe: "Lưu trú", xaPhuong: "Thị trấn Lộc Thắng", diaChi: "Đường 20 tháng 3", diaDiemKinhDoanh: "Đường 20 tháng 3, Thị trấn Lộc Thắng, Huyện Bảo Lâm", nguoiDungDau: "Đinh Thị Hương", soGpkd: "5801000024", soGiayAntt: "PCCC-DEMO-024", soPhong: "24", soGiuong: "36", soLaoDong: "11", latitude: 11.648, longitude: 107.768 },
  { tenCoSo: "Công ty TNHH Demo Dịch vụ Đạ Huoai", bangHieu: "Nhà hàng Demo Đạ M'ri", nganhNghe: "Nhà hàng; Lưu trú", xaPhuong: "Thị trấn Đạ M'ri", diaChi: "Quốc lộ 20", diaDiemKinhDoanh: "Quốc lộ 20, Thị trấn Đạ M'ri, Huyện Đạ Huoai", nguoiDungDau: "Nguyễn Thị Thu Vân", soGpkd: "5801000025", soGiayAntt: "PCCC-DEMO-025", soPhong: "18", soLaoDong: "19", latitude: 11.385, longitude: 107.671 },
  { tenCoSo: "Công ty TNHH Demo Xăng dầu Madaguôi", bangHieu: "Cửa hàng xăng dầu Demo Madaguôi", nganhNghe: "Xăng dầu; Khí hóa lỏng", xaPhuong: "Thị trấn Madaguôi", diaChi: "Quốc lộ 20", diaDiemKinhDoanh: "Quốc lộ 20, Thị trấn Madaguôi, Huyện Đạ Huoai", nguoiDungDau: "Trịnh Văn Khải", soGpkd: "5801000026", soGiayAntt: "PCCC-DEMO-026", soLaoDong: "13", latitude: 11.422, longitude: 107.545 },
  { tenCoSo: "Công ty TNHH Demo Chợ Đạ Tẻh", bangHieu: "Chợ Demo Đạ Tẻh", nganhNghe: "Chợ; Trung tâm thương mại", xaPhuong: "Thị trấn Đạ Tẻh", diaChi: "Đường 30 tháng 4", diaDiemKinhDoanh: "Đường 30 tháng 4, Thị trấn Đạ Tẻh, Huyện Đạ Tẻh", nguoiDungDau: "Lê Quốc Việt", soGpkd: "5801000027", soGiayAntt: "PCCC-DEMO-027", soLaoDong: "80", latitude: 11.586, longitude: 107.527 },
  { tenCoSo: "Công ty TNHH Demo Gỗ Cát Tiên", bangHieu: "Xưởng Demo Cát Tiên", nganhNghe: "Sản xuất; Chế biến gỗ; Kho hàng", xaPhuong: "Thị trấn Cát Tiên", diaChi: "Đường Nguyễn Văn Trỗi", diaDiemKinhDoanh: "Đường Nguyễn Văn Trỗi, Thị trấn Cát Tiên, Huyện Cát Tiên", nguoiDungDau: "Huỳnh Văn Hiệp", soGpkd: "5801000028", soGiayAntt: "PCCC-DEMO-028", soLaoDong: "46", latitude: 11.662, longitude: 107.342 },
  { tenCoSo: "Công ty TNHH Demo Du lịch Cát Tiên", bangHieu: "Khu lưu trú Demo Nam Cát Tiên", nganhNghe: "Lưu trú; Nhà hàng; Dịch vụ vui chơi", xaPhuong: "Xã Nam Cát Tiên", diaChi: "Khu vực bến phà Cát Tiên", diaDiemKinhDoanh: "Khu vực bến phà Cát Tiên, Huyện Cát Tiên", nguoiDungDau: "Phạm Thị Hạnh", soGpkd: "5801000029", soGiayAntt: "PCCC-DEMO-029", soPhong: "28", soGiuong: "48", soLaoDong: "23", latitude: 11.427, longitude: 107.428 },
  { tenCoSo: "Công ty TNHH Demo Nông nghiệp Đam Rông", bangHieu: "Kho Demo Đạ Rsal", nganhNghe: "Kho hàng; Nông sản", xaPhuong: "Xã Đạ Rsal", diaChi: "Đường tỉnh 722", diaDiemKinhDoanh: "Đường tỉnh 722, Xã Đạ Rsal, Huyện Đam Rông", nguoiDungDau: "K'Hoan Minh", soGpkd: "5801000030", soGiayAntt: "PCCC-DEMO-030", soLaoDong: "26", latitude: 12.08, longitude: 108.143 },
];

export const seedBusinesses = businessRows.map((business, index) => ({
  id: `CS-${String(index + 1).padStart(4, "0")}`,
  tinhCu: "Lâm Đồng",
  soDienThoai: "",
  ngayCapPccc: "",
  googleMapsUrl: "",
  trangThai: "Đang hoạt động",
  soPhong: "",
  soGiuong: "",
  soLaoDong: "",
  ...business,
}));

const officers = [
  { officerEmail: "canbo@example.com", officerName: "Cán bộ phụ trách" },
  { officerEmail: "canbo2@example.com", officerName: "Tổ kiểm tra Bảo Lộc" },
  { officerEmail: "canbo3@example.com", officerName: "Tổ kiểm tra Đức Trọng" },
];

export const seedPlans = seedBusinesses.map((business, index) => {
  const officer = officers[index % officers.length];
  return {
    id: `KH-2026-07-${String(index + 1).padStart(4, "0")}`,
    month: "2026-07",
    businessId: business.id,
    ...officer,
    scheduledDate: `2026-07-${String((index % 24) + 1).padStart(2, "0")}`,
    status: index < 24 ? "completed" : "planned",
  };
});

const failedInspectionIndexes = new Set([3, 8, 14, 18, 22]);
const findingNotes = {
  "PCCC-002": "Một số lối thoát nạn còn đặt vật dụng tạm thời.",
  "PCCC-003": "Tủ điện phụ chưa có nhãn cảnh báo rõ ràng.",
  "PCCC-004": "Có bình chữa cháy cần nạp sạc bổ sung.",
  "PCCC-005": "Cần tổ chức huấn luyện bổ sung cho nhân viên mới.",
  "PCCC-006": "Một kiến nghị kỳ trước đang trong thời hạn khắc phục.",
};

function makeChecklist(index) {
  if (!failedInspectionIndexes.has(index)) {
    return checklistItems.map((item) => ({ itemId: item.id, status: "dat", note: "" }));
  }

  const failedItemIds = index % 2 === 0 ? ["PCCC-004", "PCCC-005"] : ["PCCC-002", "PCCC-003"];
  return checklistItems.map((item) => ({
    itemId: item.id,
    status: failedItemIds.includes(item.id) ? "khong_dat" : "dat",
    note: failedItemIds.includes(item.id) ? findingNotes[item.id] : "",
  }));
}

export const seedInspections = seedPlans.slice(0, 24).map((plan, index) => {
  const failed = failedInspectionIndexes.has(index);
  return {
    id: `KT-2026-07-${String(index + 1).padStart(4, "0")}`,
    planId: plan.id,
    businessId: plan.businessId,
    inspectionDate: plan.scheduledDate,
    overallStatus: failed ? "khong_dat" : "dat",
    overallConclusion: failed
      ? "Cơ sở còn tồn tại một số nội dung cần khắc phục để bảo đảm điều kiện an toàn PCCC."
      : "Cơ sở bảo đảm các điều kiện PCCC tại thời điểm kiểm tra.",
    checklist: makeChecklist(index),
    notes: failed
      ? "Đã lập biên bản ghi nhận tồn tại và hướng dẫn cơ sở khắc phục đúng thời hạn."
      : "Hồ sơ, lối thoát nạn, hệ thống điện và phương tiện chữa cháy tại chỗ cơ bản bảo đảm.",
    recommendations: failed
      ? "Khắc phục các tồn tại được nêu trong checklist, báo cáo kết quả sau khi hoàn thành."
      : "Tiếp tục duy trì tự kiểm tra định kỳ và cập nhật hồ sơ quản lý PCCC.",
    dueDate: failed ? `2026-08-${String((index % 10) + 5).padStart(2, "0")}` : "",
    minutesUrl: "",
  };
});
