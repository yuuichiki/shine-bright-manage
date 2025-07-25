import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button } from "@/components/ui/button";
import { Download, Printer } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

type Invoice = {
  id: number;
  date: string;
  customer: {
    name: string;
    phone?: string;
    address?: string;
  };
  services: {
    name: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  status: string;
};

interface InvoicePDFProps {
  invoice: Invoice;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoice }) => {
  const { toast } = useToast();

  const generatePDF = async () => {
    const element = document.getElementById(`invoice-${invoice.id}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`hoa-don-${invoice.id}.pdf`);
      
      toast({
        title: "Thành công",
        description: "Hóa đơn đã được xuất thành file PDF."
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xuất hóa đơn ra PDF.",
        variant: "destructive"
      });
    }
  };

  const printInvoice = () => {
    const element = document.getElementById(`invoice-${invoice.id}`);
    if (!element) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${invoice.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; color: #333; margin-bottom: 5px; }
            .company-info { font-size: 14px; color: #666; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .invoice-info, .customer-info { flex: 1; }
            .invoice-info { margin-right: 20px; }
            .info-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; color: #333; }
            .info-item { margin-bottom: 5px; }
            .services-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .services-table th, .services-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .services-table th { background-color: #f5f5f5; font-weight: bold; }
            .services-table .text-right { text-align: right; }
            .total-section { text-align: right; margin-top: 20px; }
            .total-row { font-size: 18px; font-weight: bold; color: #333; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 no-print">
        <Button onClick={generatePDF} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Xuất PDF
        </Button>
        <Button onClick={printInvoice} variant="outline" className="flex items-center gap-2">
          <Printer className="h-4 w-4" />
          In hóa đơn
        </Button>
      </div>

      <div id={`invoice-${invoice.id}`} className="invoice-container bg-white p-8 rounded-lg shadow-lg">
        <div className="header">
          <div className="company-name">TRUNG TÂM CHĂM SÓC XE K-AUTO</div>
          <div className="company-info">
            <div>Địa chỉ: Máng Nước,Thôn Vân Tra, An Đồng, An Dương, Hải Phòng, Việt Nam</div>
            <div>Điện thoại: (84) 1234 5678 | Email: k-auto@car.com</div>
            <div>Mã số thuế: 0123456789</div>
          </div>
        </div>

        <div className="invoice-details">
          <div className="invoice-info">
            <div className="info-title">THÔNG TIN HÓA ĐƠN</div>
            <div className="info-item"><strong>Số hóa đơn:</strong> #{invoice.id}</div>
            <div className="info-item"><strong>Ngày lập:</strong> {formatDate(invoice.date)}</div>
            <div className="info-item"><strong>Trạng thái:</strong> {invoice.status}</div>
          </div>
          
          <div className="customer-info">
            <div className="info-title">THÔNG TIN KHÁCH HÀNG</div>
            <div className="info-item"><strong>Tên khách hàng:</strong> {invoice.customer.name}</div>
            {invoice.customer.phone && (
              <div className="info-item"><strong>Số điện thoại:</strong> {invoice.customer.phone}</div>
            )}
            {invoice.customer.address && (
              <div className="info-item"><strong>Địa chỉ:</strong> {invoice.customer.address}</div>
            )}
          </div>
        </div>

        <table className="services-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên dịch vụ</th>
              <th className="text-right">Số lượng</th>
              <th className="text-right">Đơn giá</th>
              <th className="text-right">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {invoice.services.map((service, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{service.name}</td>
                <td className="text-right">{service.quantity}</td>
                <td className="text-right">{formatCurrency(service.price)}</td>
                <td className="text-right">{formatCurrency(service.price * service.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="total-section">
          <div className="total-row">
            <strong>TỔNG CỘNG: {formatCurrency(invoice.total)}</strong>
          </div>
        </div>

        <div className="footer" style={{ textAlign: 'left' }}>
          <div>Cảm ơn quý khách đã sử dụng dịch vụ!</div>
          <div>Hóa đơn được in lúc: {new Date().toLocaleString('vi-VN')}</div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePDF;