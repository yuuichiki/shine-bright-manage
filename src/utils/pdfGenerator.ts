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