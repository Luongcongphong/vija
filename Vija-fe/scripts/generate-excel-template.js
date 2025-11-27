import XLSX from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dữ liệu mẫu
const templateData = [
  {
    'Mã PO': 'PO001',
    'Mã BV': 'BV001',
    'Ngày tạo': '2024-01-15',
    'Ngày giao': '2024-01-20'
  },
  {
    'Mã PO': 'PO001',
    'Mã BV': 'BV002',
    'Ngày tạo': '2024-01-15',
    'Ngày giao': '2024-01-20'
  },
  {
    'Mã PO': 'PO002',
    'Mã BV': 'BV003',
    'Ngày tạo': '2024-01-16',
    'Ngày giao': '2024-01-21'
  },
  {
    'Mã PO': 'PO002',
    'Mã BV': 'BV004',
    'Ngày tạo': '2024-01-16',
    'Ngày giao': '2024-01-21'
  },
  {
    'Mã PO': 'PO003',
    'Mã BV': 'BV005',
    'Ngày tạo': '2024-01-17',
    'Ngày giao': '2024-01-22'
  }
];

// Hướng dẫn sử dụng
const instructions = [
  ['HƯỚNG DẪN SỬ DỤNG FILE MẪU IMPORT QUẢN LÝ PO'],
  [''],
  ['CẤU TRÚC DỮ LIỆU:'],
  ['1. Mã PO: Mã định danh của Purchase Order (VD: PO001, PO002, PO003)'],
  ['   - Bắt buộc phải có'],
  ['   - Các dòng có cùng Mã PO sẽ được gộp thành 1 nhóm'],
  [''],
  ['2. Mã BV: Mã bao vải'],
  ['   - Bắt buộc phải có'],
  ['   - Mã BV phải tồn tại trong hệ thống (Quản lý Danh mục)'],
  ['   - Mỗi dòng là 1 Mã BV riêng biệt'],
  [''],
  ['3. Ngày tạo: Ngày tạo PO'],
  ['   - Định dạng: YYYY-MM-DD (VD: 2024-01-15)'],
  ['   - Hoặc định dạng ngày Excel (sẽ tự động chuyển đổi)'],
  ['   - Có thể để trống'],
  [''],
  ['4. Ngày giao: Ngày giao hàng dự kiến'],
  ['   - Định dạng: YYYY-MM-DD (VD: 2024-01-20)'],
  ['   - Hoặc định dạng ngày Excel (sẽ tự động chuyển đổi)'],
  ['   - Nên sau ngày tạo'],
  ['   - Có thể để trống'],
  [''],
  ['CÁCH SỬ DỤNG:'],
  ['1. Xem dữ liệu mẫu ở sheet "Dữ liệu mẫu"'],
  ['2. Sao chép cấu trúc và điền dữ liệu của bạn'],
  ['3. Đảm bảo các Mã BV đã tồn tại trong hệ thống'],
  ['4. Lưu file Excel'],
  ['5. Vào trang Quản lý PO, click nút "📤 Import Excel"'],
  ['6. Chọn file Excel của bạn'],
  ['7. Hệ thống sẽ tự động import và báo kết quả'],
  [''],
  ['LƯU Ý QUAN TRỌNG:'],
  ['- Không cần xóa sheet hướng dẫn này, hệ thống chỉ đọc sheet đầu tiên'],
  ['- Nếu import thất bại, kiểm tra lại Mã BV có tồn tại không'],
  ['- Các dòng trùng lặp (cùng Mã PO và Mã BV) sẽ báo lỗi'],
  ['- Có thể import nhiều lần, dữ liệu sẽ được thêm vào hệ thống'],
  [''],
  ['VÍ DỤ DỮ LIỆU:'],
  ['- PO001 có 2 Mã BV: BV001, BV002'],
  ['- PO002 có 2 Mã BV: BV003, BV004'],
  ['- PO003 có 1 Mã BV: BV005'],
  [''],
  ['Chúc bạn sử dụng thành công!']
];

// Tạo workbook
const wb = XLSX.utils.book_new();

// Tạo sheet hướng dẫn
const wsInstructions = XLSX.utils.aoa_to_sheet(instructions);

// Điều chỉnh độ rộng cột cho sheet hướng dẫn
wsInstructions['!cols'] = [{ wch: 80 }];

// Tạo sheet dữ liệu mẫu
const wsData = XLSX.utils.json_to_sheet(templateData);

// Điều chỉnh độ rộng cột cho sheet dữ liệu
wsData['!cols'] = [
  { wch: 15 }, // Mã PO
  { wch: 15 }, // Mã BV
  { wch: 15 }, // Ngày tạo
  { wch: 15 }  // Ngày giao
];

// Thêm các sheet vào workbook
XLSX.utils.book_append_sheet(wb, wsInstructions, 'Hướng dẫn');
XLSX.utils.book_append_sheet(wb, wsData, 'Dữ liệu mẫu');

// Lưu file
const outputPath = path.join(__dirname, '..', 'public', 'QLPO_Template.xlsx');
XLSX.writeFile(wb, outputPath);

console.log('✅ Đã tạo file Excel mẫu thành công tại:', outputPath);
