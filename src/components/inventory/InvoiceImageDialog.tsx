
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  image: string | null;
}

export const InvoiceImageDialog: React.FC<Props> = ({ open, setOpen, image }) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Hình Ảnh Hóa Đơn</DialogTitle>
      </DialogHeader>
      <div className="flex justify-center p-4">
        {image && (
          <img
            src={image}
            alt="Hóa đơn nhập hàng"
            className="max-w-full max-h-[70vh] object-contain"
          />
        )}
      </div>
      <DialogFooter>
        <Button onClick={() => setOpen(false)}>Đóng</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

