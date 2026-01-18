export type ProductCategory = 
  | 'Fungicide'
  | 'Insecticide'
  | 'Herbicide'
  | 'PGR'
  | 'Water Soluble'
  | 'Chelated Micronutrient';

export interface Product {
  id: string;
  name: string;
  company: string;
  category: ProductCategory;
  quantity: number;
  quantityAlert: number;
  buyingPrice: number;
  sellingPriceCash: number;
  sellingPriceUdhaar: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  address: string;
}

export interface BillItem {
  productId: string;
  productName: string;
  quantity: number;
  rate: number;
  total: number;
}

export type PaymentMode = 'Cash' | 'Udhaar';

export interface KacchaBill {
  id: string;
  billNumber: string;
  customer: Customer;
  items: BillItem[];
  paymentMode: PaymentMode;
  dueDate?: Date;
  subtotal: number;
  total: number;
  createdAt: Date;
  status: 'pending' | 'paid' | 'partial';
}

export interface PakkaBill extends KacchaBill {
  gstAmount: number;
  gstPercentage: number;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockCount: number;
  todaySales: number;
  pendingUdhaar: number;
  monthlySalesData: { month: string; sales: number }[];
}
