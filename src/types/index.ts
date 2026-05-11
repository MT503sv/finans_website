export enum Category {
  FOOD_DRINK = "Food / Drink",
  GROCERIES = "Groceries",
  ELECTRONICS = "Electronics",
  CLOTHING = "Clothing / Accessories",
  HOME = "Home",
  HARDWARE = "Hardware",
  SERVICES = "Services",
  OTHERS = "Others"
}

export interface SaleRecord {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  category: Category;
  timestamp: number;
  notes?: string;
}

export interface ExtractedData {
  items: Array<{
    productName: string;
    price: number;
    quantity: number;
    category: string;
  }>;
}