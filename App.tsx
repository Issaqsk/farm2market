
import React, { useState } from 'react';
import { UserRole, Product, Order } from './types';
import { Landing } from './pages/Landing';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { BuyerDashboard } from './pages/BuyerDashboard';
import { AIChatModal } from './components/AIChatModal';
import { MOCK_PRODUCTS, MOCK_ORDERS } from './constants';

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);

  const handleStart = (role: 'FARMER' | 'BUYER') => {
    setUserRole(role === 'FARMER' ? UserRole.FARMER : UserRole.BUYER);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  const addProduct = (newProduct: Product) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const placeOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <div className="min-h-screen">
      {!userRole && <Landing onStart={handleStart} />}
      
      {userRole === UserRole.FARMER && (
        <>
          <FarmerDashboard 
            onLogout={handleLogout} 
            products={products} 
            orders={orders}
            onAddProduct={addProduct}
            onDeleteProduct={deleteProduct}
            onUpdateOrder={updateOrderStatus}
          />
          <AIChatModal role="FARMER" />
        </>
      )}
      
      {userRole === UserRole.BUYER && (
        <>
          <BuyerDashboard 
            onLogout={handleLogout} 
            products={products}
            onPlaceOrder={placeOrder}
          />
          <AIChatModal role="BUYER" />
        </>
      )}

      {/* Global Trust Banner for Hackathon Demo */}
      <div className="fixed bottom-0 left-0 right-0 bg-emerald-900 text-white py-2 text-center text-xs font-bold tracking-widest uppercase z-50">
        100% Direct Trade • Zero Commission • AI Verified Quality 🍃
      </div>
    </div>
  );
};

export default App;
