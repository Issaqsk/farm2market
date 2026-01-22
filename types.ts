
export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER'
}

export interface Product {
  id: string;
  name: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Dairy' | 'Organic';
  price: number;
  unit: string;
  quantity: number;
  harvestDate: string;
  isOrganic: boolean;
  imageUrl: string;
  farmerId: string;
  farmerName: string;
  location: string;
  qualityScore?: number;
}

export interface FarmerProfile {
  id: string;
  name: string;
  location: string;
  farmSize: string;
  joinedDate: string;
  isVerified: boolean;
  products: Product[];
  totalEarnings: number;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerName: string;
  quantity: number;
  totalPrice: number;
  status: 'Pending' | 'Accepted' | 'Completed' | 'Cancelled';
  date: string;
}

export interface AIInsight {
  suggestedPrice: number;
  demandTrend: 'High' | 'Medium' | 'Low';
  reasoning: string;
}
