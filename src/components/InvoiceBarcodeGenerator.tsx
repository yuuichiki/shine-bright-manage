
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, Download } from 'lucide-react';

type InvoiceBarcodeProps = {
  invoiceId: string;
  amount: number;
  accountNumber?: string;
  bankName?: string;
  description?: string;
};

const InvoiceBarcodeGenerator = ({ 
  invoiceId, 
  amount, 
  accountNumber = "0123456789", 
  bankName = "ACME Bank", 
  description = ""
}: InvoiceBarcodeProps) => {
  
  // Placeholder for actual QR/barcode generation logic
  // In a real app, you would use a library like react-qr-code to generate the QR code
  // containing the payment information in a format that banking apps can scan
  
  const getBarcodeUrl = () => {
    // This is a placeholder for the actual QR code generation
    // In a real implementation, you would create a proper payment QR code
    // according to bank standards like VietQR
    const data = {
      accountNumber,
      bankName,
      amount,
      description: description || `Thanh toán hóa đơn #${invoiceId}`,
    };
    
    // Placeholder URL - in a real app, you'd generate an actual QR code
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(JSON.stringify(data))}`;
  };

  const handlePrint = () => {
    console.log("Printing barcode for invoice:", invoiceId);
    // In a real app, you would trigger the print dialog for the barcode
  };

  const handleDownload = () => {
    console.log("Downloading barcode for invoice:", invoiceId);
    // In a real app, you would download the barcode as an image
  };

  return (
    <Card>
      <CardContent className="flex flex-col items-center p-6">
        <h3 className="font-medium text-lg mb-2">Thanh toán qua QR Banking</h3>
        <div className="border border-gray-200 rounded-md p-2 mb-4">
          <img 
            src={getBarcodeUrl()} 
            alt="Payment QR Code" 
            width={200} 
            height={200} 
            className="mx-auto"
          />
        </div>
        <div className="text-sm text-center mb-4">
          <p>Quét mã QR để thanh toán</p>
          <p className="font-medium">{amount.toLocaleString('vi-VN')} đ</p>
          <p className="text-xs text-gray-500 mt-1">
            {accountNumber} - {bankName}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-1" /> In mã
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-1" /> Tải về
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceBarcodeGenerator;
