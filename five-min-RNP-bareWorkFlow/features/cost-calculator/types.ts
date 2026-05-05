export interface PhoneOrderMenu {
  id: string;
  category: string;
  name: string;
  price: number;
  updatedAt?: string;
}

export interface PhoneOrderMenuInput {
  category: string;
  name: string;
  price: number;
}

export interface CalculatorRow {
  id: string;
  category: string;
  menuName: string;
  price: number;
  quantity: number;
  isCustom: boolean;
}
