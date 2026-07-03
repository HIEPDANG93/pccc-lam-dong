# Quản Lý PCCC Lâm Đồng

Web app nhẹ để quản lý danh sách cơ sở kinh doanh, phân công cán bộ kiểm tra PCCC, nhập kết quả theo hạng mục, xem bản đồ cơ sở và xuất báo cáo tháng.

## 1. Tổng Quan Hệ Thống

- Frontend: React + Vite, deploy miễn phí trên Netlify.
- Backend: Google Apps Script Web App.
- Database: Google Sheets.
- Báo cáo: Google Spreadsheet/PDF sinh bằng Apps Script và lưu Google Drive.
- Bản đồ: Leaflet + OpenStreetMap trong app, Google Maps nhúng khi chọn cơ sở.
- Xác thực: Google Identity token, backend kiểm tra email trong tab `Users`.

Khi chưa cấu hình backend thật, app chạy chế độ demo bằng `localStorage`.

## 2. Cấu Trúc Thư Mục

```text
pccc-lam-dong/
├── apps-script/
│   ├── Code.gs              # Backend Apps Script, API, báo cáo, xác thực
│   └── appsscript.json      # Scope và cấu hình Apps Script
├── data/import/
│   ├── DoanhNghiep.csv      # CSV doanh nghiệp đã chuẩn hóa từ Excel mẫu
│   ├── HangMucPCCC.csv      # Hạng mục kiểm tra PCCC mẫu
│   ├── KeHoachKiemTra.csv   # Kế hoạch kiểm tra mẫu tháng 2026-07
│   ├── KetQuaKiemTra.csv    # Kết quả kiểm tra PCCC mẫu tháng 2026-07
│   └── Users.csv            # Người dùng mẫu
├── src/
│   ├── App.jsx              # Toàn bộ giao diện và luồng màn hình chính
│   ├── data/seed.js         # Dữ liệu demo local
│   ├── services/api.js      # Gọi Apps Script hoặc mock local
│   ├── services/mockStore.js # Mock database bằng localStorage
│   ├── main.jsx             # Entry React
│   └── styles.css           # UI responsive
├── tools/
│   └── import_excel_to_csv.py # Chuyển Excel khách gửi thành CSV import
├── .env.example             # Biến môi trường mẫu
├── netlify.toml             # Cấu hình deploy Netlify
├── package.json             # Scripts và dependencies
└── vite.config.js
```

## 3. Cấu Trúc Google Sheet

Apps Script dùng hàm `setupDatabase()` để tạo các tab sau:

| Tab | Mục đích |
| --- | --- |
| `Users` | Danh sách tài khoản được phép truy cập, vai trò và trạng thái |
| `DoanhNghiep` | Hồ sơ cơ sở kinh doanh, địa chỉ, ngành nghề, giấy tờ, tọa độ |
| `HangMucPCCC` | Danh mục hạng mục kiểm tra PCCC có thể thêm/sửa |
| `KeHoachKiemTra` | Kế hoạch tháng, cơ sở được kiểm tra, cán bộ phụ trách |
| `KetQuaKiemTra` | Kết quả kiểm tra, checklist, kết quả tổng quan, kết luận cuối |
| `BaoCaoThang` | Lịch sử báo cáo tháng và link file PDF/XLSX |

Vai trò trong `Users`:

- `admin`: quản lý cơ sở, hạng mục, phân công, báo cáo.
- `canbo`: nhập kết quả kiểm tra.
- `viewer`: chỉ xem dashboard, danh sách, bản đồ và báo cáo.

## 4. Luồng Vận Hành

### 4.1. Đăng Nhập

1. Người dùng đăng nhập bằng tài khoản Google.
2. Frontend gửi Google ID token về Apps Script.
3. Apps Script xác thực token với Google.
4. Apps Script kiểm tra email trong tab `Users`.
5. Nếu email `active`, app trả về vai trò tương ứng.

### 4.2. Quản Lý Cơ Sở

1. Vào trang `Cơ sở`.
2. Tìm kiếm theo tên, bảng hiệu, địa bàn hoặc địa chỉ.
3. Lọc theo ngành nghề.
4. Thêm hoặc sửa hồ sơ cơ sở.
5. Nhập `Vĩ độ`, `Kinh độ` hoặc `Link Google Maps` để cơ sở hiện trên bản đồ.

### 4.3. Xem Bản Đồ

1. Vào trang `Bản đồ`.
2. App hiển thị các cơ sở có tọa độ bằng marker Leaflet.
3. Bấm marker hoặc bấm cơ sở ở danh sách bên phải.
4. Khung Google Maps nhúng sẽ mở đúng cơ sở đã chọn.
5. Có thể bấm `Mở trên Google Maps` để xem ngoài Google Maps.

### 4.4. Quản Lý Hạng Mục Kiểm Tra

1. Vào trang `Kiểm tra`.
2. Khối `Quản lý hạng mục kiểm tra` cho phép thêm hạng mục mới.
3. Bấm một hạng mục có sẵn để đưa dữ liệu lên form sửa.
4. Chọn tính chất `Bắt buộc` hoặc `Khuyến nghị`.
5. Lưu lại, danh sách hạng mục sẽ dùng cho các lần kiểm tra sau.

### 4.5. Phân Công Kiểm Tra

1. Vào trang `Phân công`.
2. Chọn tháng kiểm tra.
3. Chọn cơ sở cần kiểm tra.
4. Chọn cán bộ phụ trách từ danh sách kéo thả.
5. Chọn ngày dự kiến kiểm tra.
6. Bấm `Lưu phân công`.

Danh sách cán bộ lấy từ tab `Users`, gồm các tài khoản `admin` và `canbo` đang `active`.

### 4.6. Nhập Kết Quả Kiểm Tra

1. Vào trang `Kiểm tra`.
2. Chọn kế hoạch kiểm tra.
3. Nhập ngày kiểm tra.
4. Chọn `Kết quả tổng quan`: `Đạt` hoặc `Không đạt`.
5. Nhập `Kết luận cuối đánh giá`.
6. Đánh giá từng hạng mục: `Đạt`, `Không đạt`, `Không áp dụng`.
7. Nhập ghi chú hạng mục nếu cần.
8. Nhập hạn khắc phục, link biên bản, ghi chú và kiến nghị.
9. Bấm `Lưu kết quả`.

Sau khi lưu, kế hoạch được chuyển sang trạng thái `Đã kiểm tra`.

### 4.7. Xuất Báo Cáo Tháng

1. Vào trang `Báo cáo`.
2. Chọn tháng cần xuất.
3. Bấm `Xuất báo cáo`.
4. Apps Script tổng hợp số liệu từ `KeHoachKiemTra` và `KetQuaKiemTra`.
5. Apps Script tạo Google Spreadsheet báo cáo và xuất PDF.
6. Link file được lưu vào tab `BaoCaoThang`.

Báo cáo gồm tổng số cơ sở, số đã phân công, đã kiểm tra, đạt, không đạt, quá hạn và danh sách chi tiết.

## 5. Chạy Local

```bash
npm install
npm run dev
```

Mở app tại:

```text
http://localhost:5173/
```

Nếu chưa cấu hình `.env`, app tự dùng dữ liệu demo cục bộ.

## 6. Cấu Hình Frontend

Tạo file `.env` từ `.env.example`:

```bash
VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id.apps.googleusercontent.com
```

Trên Netlify, đặt 2 biến này trong phần Environment variables.

## 7. Cài Đặt Google Sheet Và Apps Script

1. Tạo Google Sheet trống.
2. Tạo Apps Script project.
3. Copy nội dung `apps-script/Code.gs`.
4. Copy cấu hình `apps-script/appsscript.json`.
5. Trong Apps Script, đặt Script Properties:
   - `SHEET_ID`: ID của Google Sheet database.
   - `GOOGLE_CLIENT_ID`: OAuth client ID dùng ở frontend.
   - `REPORT_FOLDER_ID`: ID thư mục Drive lưu báo cáo, có thể bỏ trống.
6. Chạy hàm `setupDatabase()` một lần.
7. Vào tab `Users`, đổi `admin@example.com` thành email Google thật của quản trị.
8. Deploy Apps Script dạng Web app:
   - Execute as: `Me`
   - Who has access: `Anyone`

Google Sheet không public trực tiếp. Frontend chỉ gọi Apps Script API, còn Apps Script tự kiểm tra token và phân quyền.

## 8. Import Dữ Liệu Excel

File Excel mẫu đã được chuyển thành dữ liệu import mẫu:

```text
data/import/DoanhNghiep.csv
data/import/KeHoachKiemTra.csv
data/import/KetQuaKiemTra.csv
```

Import các file này vào đúng tab tương ứng sau khi chạy `setupDatabase()`.

Khi có file Excel mới:

```bash
python3 tools/import_excel_to_csv.py "/path/to/file.xlsx" data/import
```

Script sẽ gom các sheet ngành nghề thành một bảng doanh nghiệp, bỏ dòng rỗng và bỏ trùng rõ ràng theo tên + địa điểm kinh doanh.

## 9. Deploy Netlify

Build production:

```bash
npm run build
```

Netlify dùng:

- Build command: `npm run build`
- Publish directory: `dist`

File `netlify.toml` đã cấu hình redirect SPA về `index.html`.

## 10. Kiểm Tra Trước Bàn Giao

```bash
npm run lint
npm run build
```

Các màn cần test tay:

- Đăng nhập demo hoặc Google.
- Tìm kiếm/lọc cơ sở.
- Thêm/sửa cơ sở và tọa độ.
- Bấm marker bản đồ và kiểm tra Google Maps nhúng.
- Thêm/sửa hạng mục kiểm tra.
- Phân công cán bộ từ danh sách kéo thả.
- Nhập kết quả tổng quan và kết luận cuối đánh giá.
- Xuất báo cáo tháng.

## 11. Ghi Chú Nâng Cấp Schema

Nếu đã tạo Google Sheet bằng bản cũ, cần bảo đảm:

- Tab `KetQuaKiemTra` có cột `overallConclusion` sau `overallStatus`.
- Tab `HangMucPCCC` có các cột `id`, `group`, `content`, `required`.
- Tab `Users` có đủ email cán bộ với vai trò `admin` hoặc `canbo`.

Với sheet mới, chỉ cần chạy lại `setupDatabase()`.
