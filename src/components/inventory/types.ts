
export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorderPoint: number;
  unitPrice: number;
  type: 'consumable' | 'equipment';
  usageRate?: string;
  importDate: string;
  invoiceImage?: string;
};
