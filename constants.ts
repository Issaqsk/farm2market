
import { Product, FarmerProfile, Order } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Fresh Organic Tomatoes',
    category: 'Vegetables',
    price: 45,
    unit: 'kg',
    quantity: 120,
    harvestDate: '2023-10-25',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f02bad67b?q=80&w=600&h=400&auto=format&fit=crop',
    farmerId: 'f1',
    farmerName: 'Rajesh Kumar',
    location: 'Nashik, Maharashtra',
    qualityScore: 9.2
  },
  {
    id: 'p2',
    name: 'Alphonso Mangoes',
    category: 'Fruits',
    price: 600,
    unit: 'dozen',
    quantity: 50,
    harvestDate: '2023-10-20',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=600&h=400&auto=format&fit=crop',
    farmerId: 'f1',
    farmerName: 'Rajesh Kumar',
    location: 'Ratnagiri, Maharashtra',
    qualityScore: 9.8
  },
  {
    id: 'p3',
    name: 'Pure Buffalo Ghee',
    category: 'Dairy',
    price: 850,
    unit: 'kg',
    quantity: 15,
    harvestDate: '2023-10-22',
    isOrganic: false,
    imageUrl: 'https://images.unsplash.com/photo-1589927986089-35812388d1f4?q=80&w=600&h=400&auto=format&fit=crop',
    farmerId: 'f2',
    farmerName: 'Lakshmi Devi',
    location: 'Ambala, Punjab',
    qualityScore: 8.5
  },
  {
    id: 'p4',
    name: 'Basmati Rice',
    category: 'Grains',
    price: 120,
    unit: 'kg',
    quantity: 500,
    harvestDate: '2023-10-15',
    isOrganic: true,
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&h=400&auto=format&fit=crop',
    farmerId: 'f1',
    farmerName: 'Rajesh Kumar',
    location: 'Karnal, Haryana',
    qualityScore: 9.5
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    productId: 'p1',
    productName: 'Fresh Organic Tomatoes',
    buyerName: 'Green Grocers Retail',
    quantity: 50,
    totalPrice: 2250,
    status: 'Accepted',
    date: '2023-10-26'
  },
  {
    id: 'o2',
    productId: 'p3',
    productName: 'Pure Buffalo Ghee',
    buyerName: 'Urban Pantry',
    quantity: 2,
    totalPrice: 1700,
    status: 'Pending',
    date: '2023-10-27'
  }
];

export const FARMER_STATS = {
  totalSales: 45000,
  activeProducts: 5,
  pendingOrders: 2,
  completedOrders: 124
};
