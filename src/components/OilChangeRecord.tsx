
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from 'lucide-react';

type OilChangeProps = {
  carId?: string;
  carModel?: string;
  customerId?: string;
};

const OilChangeRecord = ({ carId, carModel, customerId }: OilChangeProps) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [record, setRecord] = useState({
    currentKm: '',
    oilType: '',
    oilAmount: '',
    nextChangeKm: '',
    nextChangeDate: '',
    filterChanged: false,
    notes: ''
  });

  const oilTypes = [
    { value: 'synthetic-5w30', label: 'Dầu tổng hợp 5W-30' },
    { value: 'synthetic-5w40', label: 'Dầu tổng hợp 5W-40' },
    { value: 'synthetic-10w40', label: 'Dầu tổng hợp 10W-40' },
    { value: 'mineral-15w40', label: 'Dầu khoáng 15W-40' },
    { value: 'mineral-20w50', label: 'Dầu khoáng 20W-50' }
  ];

  const calculateNextChangeDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + 6);
    return today.toISOString().split('T')[0];
  };

  const calculateNextChangeKm = (currentKm: string) => {
    return parseInt(currentKm) + 5000;
  };

  const handleCurrentKmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const km = e.target.value;
    setRecord({
      ...record,
      currentKm: km,
      nextChangeKm: km ? calculateNextChangeKm(km).toString() : ''
    });
  };

  const handleSave = () => {
    console.log("Saving oil change record:", record);
    // Here you would typically save this to your database
    setOpenDialog(false);
    
    // Reset form
    setRecord({
      currentKm: '',
      oilType: '',
      oilAmount: '',
      nextChangeKm: '',
      nextChangeDate: '',
      filterChanged: false,
      notes: ''
    });
  };
  
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Ghi nhận thay dầu
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ghi Nhận Thay Dầu</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {carModel && (
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="text-sm font-medium">Xe:</div>
              <div>{carModel}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 items-center gap-4">
            <label htmlFor="current-km" className="text-sm font-medium">
              Số Km hiện tại:
            </label>
            <Input 
              id="current-km" 
              type="number" 
              value={record.currentKm}
              onChange={handleCurrentKmChange}
            />
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <label htmlFor="oil-type" className="text-sm font-medium">
              Loại dầu:
            </label>
            <Select value={record.oilType} onValueChange={(value) => setRecord({...record, oilType: value})}>
              <SelectTrigger id="oil-type">
                <SelectValue placeholder="Chọn loại dầu" />
              </SelectTrigger>
              <SelectContent>
                {oilTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <label htmlFor="oil-amount" className="text-sm font-medium">
              Lượng dầu (Lít):
            </label>
            <Input 
              id="oil-amount" 
              type="number" 
              step="0.1"
              value={record.oilAmount}
              onChange={(e) => setRecord({...record, oilAmount: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <label htmlFor="next-change-km" className="text-sm font-medium">
              Km thay dầu tiếp theo:
            </label>
            <Input 
              id="next-change-km" 
              value={record.nextChangeKm}
              readOnly 
              className="bg-gray-100"
            />
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <label htmlFor="next-change-date" className="text-sm font-medium">
              Ngày thay dầu tiếp theo:
            </label>
            <Input 
              id="next-change-date" 
              type="date" 
              value={record.nextChangeDate || calculateNextChangeDate()}
              onChange={(e) => setRecord({...record, nextChangeDate: e.target.value})}
            />
          </div>
          
          <div className="grid grid-cols-2 items-center gap-4">
            <label htmlFor="filter-changed" className="text-sm font-medium">
              Thay lọc dầu:
            </label>
            <Select 
              value={record.filterChanged ? "yes" : "no"} 
              onValueChange={(value) => setRecord({...record, filterChanged: value === "yes"})}>
              <SelectTrigger id="filter-changed">
                <SelectValue placeholder="Có thay lọc dầu không?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Có</SelectItem>
                <SelectItem value="no">Không</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <label htmlFor="notes" className="text-sm font-medium">
              Ghi chú:
            </label>
            <Input 
              id="notes" 
              value={record.notes}
              onChange={(e) => setRecord({...record, notes: e.target.value})}
            />
          </div>
          
          <Button onClick={handleSave}>Lưu Thông Tin</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OilChangeRecord;
