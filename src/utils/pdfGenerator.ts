import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface ReportData {
  title: string;
  headers: string[];
  data: any[][];
  summary?: { label: string; value: string }[];
}

export const generatePDFReport = (reportData: ReportData) => {
  const doc = new jsPDF();
  
  // Tiêu đề báo cáo
  doc.setFontSize(18);
  doc.text(reportData.title, 20, 20);
  
  // Ngày tạo báo cáo
  doc.setFontSize(10);
  doc.text(`Ngày tạo: ${new Date().toLocaleDateString('vi-VN')}`, 20, 30);
  
  // Bảng dữ liệu
  (doc as any).autoTable({
    head: [reportData.headers],
    body: reportData.data,
    startY: 40,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  
  // Thông tin tổng kết (nếu có)
  if (reportData.summary) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(12);
    doc.text('Thống kê tổng kết:', 20, finalY);
    
    reportData.summary.forEach((item, index) => {
      doc.setFontSize(10);
      doc.text(`${item.label}: ${item.value}`, 20, finalY + 10 + (index * 8));
    });
  }
  
  return doc;
};

export const downloadPDF = (doc: jsPDF, filename: string) => {
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`);
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { 
    style: 'currency', 
    currency: 'VND' 
  }).format(amount);
};

export const generatePromotionReport = (promotions: any[]) => {
  const reportData: ReportData = {
    title: 'Báo Cáo Khuyến Mãi',
    headers: ['Tên khuyến mãi', 'Loại', 'Giá trị', 'Ngày bắt đầu', 'Ngày kết thúc', 'Trạng thái'],
    data: promotions.map(promo => [
      promo.name,
      promo.type === 'percentage' ? 'Phần trăm' : 'Số tiền',
      promo.type === 'percentage' ? `${promo.value}%` : formatCurrency(promo.value),
      new Date(promo.start_date).toLocaleDateString('vi-VN'),
      new Date(promo.end_date).toLocaleDateString('vi-VN'),
      promo.is_active ? 'Hoạt động' : 'Tạm dừng'
    ])
  };
  
  const doc = generatePDFReport(reportData);
  downloadPDF(doc, 'bao-cao-khuyen-mai');
};

export const generateCustomerGroupReport = (groups: any[]) => {
  const reportData: ReportData = {
    title: 'Báo Cáo Nhóm Khách Hàng',
    headers: ['Tên nhóm', 'Mô tả', 'Tiêu chí', 'Số thành viên', 'Ngày tạo'],
    data: groups.map(group => [
      group.name,
      group.description || 'Không có',
      group.criteria || 'Không có',
      group.member_count.toString(),
      new Date(group.created_at).toLocaleDateString('vi-VN')
    ])
  };
  
  const doc = generatePDFReport(reportData);
  downloadPDF(doc, 'bao-cao-nhom-khach-hang');
};

export const generateVoucherReport = (vouchers: any[]) => {
  const reportData: ReportData = {
    title: 'Báo Cáo Voucher',
    headers: ['Mã voucher', 'Tên', 'Loại', 'Giá trị', 'Số lượng', 'Đã sử dụng', 'Trạng thái'],
    data: vouchers.map(voucher => [
      voucher.code,
      voucher.name,
      voucher.type === 'percentage' ? 'Phần trăm' : 'Số tiền',
      voucher.type === 'percentage' ? `${voucher.value}%` : formatCurrency(voucher.value),
      voucher.quantity.toString(),
      voucher.used_count.toString(),
      voucher.is_active ? 'Hoạt động' : 'Tạm dừng'
    ])
  };
  
  const doc = generatePDFReport(reportData);
  downloadPDF(doc, 'bao-cao-voucher');
};