
import React, { useState } from 'react';
import { 
  Search, Filter, MapPin, Star, ShoppingCart, 
  MessageSquare, Heart, ChevronRight, Leaf, 
  ShieldCheck, ArrowLeft, Tag, Info, CheckCircle2
} from 'lucide-react';
import { Product, Order } from '../types';

interface BuyerDashboardProps {
  onLogout: () => void;
  products: Product[];
  onPlaceOrder: (order: Order) => void;
}

export const BuyerDashboard: React.FC<BuyerDashboardProps> = ({ onLogout, products, onPlaceOrder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [view, setView] = useState<'browse' | 'product'>('browse');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showToast, setShowToast] = useState(false);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Organic'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openProduct = (p: Product) => {
    setSelectedProduct(p);
    setView('product');
  };

  const handleBuy = () => {
    if (!selectedProduct) return;
    const order: Order = {
      id: Math.random().toString(36).substr(2, 9),
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      buyerName: 'Jane Doe',
      quantity: 1,
      totalPrice: selectedProduct.price,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    onPlaceOrder(order);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setView('browse');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 z-[100] animate-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="text-emerald-400" />
          <span className="font-bold">Order Placed Successfully! Farmer notified.</span>
        </div>
      )}

      <nav className="bg-white border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-2 rounded-xl"><Leaf className="text-white" size={20} /></div>
            <span className="text-xl font-bold text-slate-800 font-heading">Farm2Market</span>
          </div>
          <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search by crop, farmer or location..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-slate-600 hover:text-emerald-600"><ShoppingCart size={24} /><span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">0</span></button>
            <button onClick={onLogout} className="text-sm font-bold text-slate-600 hover:text-red-600">Logout</button>
            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">JD</div>
          </div>
        </div>
      </nav>

      {view === 'browse' ? (
        <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 animate-in fade-in duration-500">
          <div className="bg-emerald-900 rounded-[2.5rem] p-8 md:p-12 mb-12 relative overflow-hidden text-white shadow-2xl shadow-emerald-200/50">
            <div className="absolute top-0 right-0 p-8 opacity-10"><ShieldCheck size={200} /></div>
            <div className="max-w-xl space-y-4 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-800/50 rounded-full text-[10px] font-black border border-emerald-700 uppercase tracking-[0.2em]">Our Guarantee</div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight font-heading">Farmer gets 100% profit. No middleman fees.</h1>
              <p className="text-emerald-100/70 text-lg">Direct trade means better prices for you and a better life for those who grow your food.</p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide mb-4">
            {categories.map(c => (
              <button key={c} onClick={() => setSelectedCategory(c)} className={`px-6 py-3 rounded-2xl font-bold whitespace-nowrap transition-all border ${selectedCategory === c ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-100'}`}>{c}</button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(p => (
              <div key={p.id} onClick={() => openProduct(p)} className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:-translate-y-2 transition-all group cursor-pointer">
                <div className="relative h-56 overflow-hidden">
                  <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4">
                    {p.isOrganic && <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-emerald-700 text-[10px] font-black rounded-full border border-emerald-100 shadow-sm flex items-center gap-1 uppercase tracking-wider"><Leaf size={10} /> Organic</span>}
                  </div>
                  {p.qualityScore && <div className="absolute bottom-4 left-4"><div className="px-3 py-1 bg-amber-500 text-white text-[10px] font-black rounded-lg shadow-lg uppercase tracking-tight">AI Score: {p.qualityScore}</div></div>}
                </div>
                <div className="p-6 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-slate-800 line-clamp-1 font-heading">{p.name}</h3>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-medium"><MapPin size={12} /> <span>{p.location}</span></div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="space-y-0.5"><p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Price</p><p className="text-2xl font-black text-slate-900">₹{p.price}<span className="text-sm font-normal text-slate-400">/{p.unit}</span></p></div>
                    <button className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm"><ShoppingCart size={20} /></button>
                  </div>
                  <div className="pt-4 border-t border-slate-50 flex items-center gap-3">
                    <div className="h-8 w-8 bg-slate-100 rounded-full flex items-center justify-center font-bold text-[10px] text-slate-500 uppercase">{p.farmerName[0]}</div>
                    <p className="text-xs font-bold text-slate-600">{p.farmerName} <span className="text-emerald-500 font-black">✓</span></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredProducts.length === 0 && <div className="text-center py-20"><h3 className="text-xl font-bold text-slate-400">No products found matching your search.</h3></div>}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8 w-full flex-1 animate-in slide-in-from-bottom-4 duration-500">
          <button onClick={() => setView('browse')} className="flex items-center gap-2 text-slate-500 font-bold mb-8 hover:text-emerald-600 transition-colors"><ArrowLeft size={20} /> Back to Market</button>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <img src={selectedProduct?.imageUrl} alt="" className="w-full aspect-[4/3] object-cover rounded-[2.5rem] shadow-2xl border-4 border-white" />
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <img key={i} src={`https://picsum.photos/seed/${selectedProduct?.id + i}/400/300`} className="rounded-2xl opacity-50 hover:opacity-100 cursor-pointer transition-opacity border-2 border-white shadow-md" />)}
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded-full uppercase border border-emerald-100">{selectedProduct?.category}</span>
                  {selectedProduct?.isOrganic && <span className="px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full uppercase border border-amber-100">AI Quality Verified</span>}
                </div>
                <h1 className="text-5xl font-bold text-slate-900 font-heading">{selectedProduct?.name}</h1>
                <p className="text-3xl font-black text-slate-900">₹{selectedProduct?.price} / {selectedProduct?.unit}</p>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-slate-100 rounded-[1.25rem] flex items-center justify-center text-2xl font-bold text-slate-400">{selectedProduct?.farmerName[0]}</div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Farmer</p>
                    <div className="flex items-center gap-2"><h3 className="text-xl font-bold text-slate-800">{selectedProduct?.farmerName}</h3><ShieldCheck size={18} className="text-emerald-500" /></div>
                  </div>
                  <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-all"><MessageSquare size={20} /></button>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-800 uppercase text-xs tracking-[0.2em]">Harvest Specs</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Harvested</p><p className="text-lg font-bold text-slate-700">{selectedProduct?.harvestDate}</p></div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100"><p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Quantity</p><p className="text-lg font-bold text-slate-700">{selectedProduct?.quantity} {selectedProduct?.unit}</p></div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={handleBuy} className="flex-1 bg-emerald-600 text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3 active:scale-95 transition-transform"><ShoppingCart /> Buy Directly</button>
                <button className="px-8 py-5 bg-white text-slate-600 border-2 border-slate-100 rounded-3xl font-bold hover:bg-slate-50 transition-all">Chat</button>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100"><Info className="text-blue-500 shrink-0" size={20} /><p className="text-xs text-blue-800 leading-relaxed font-bold uppercase tracking-wide">100% of your payment goes to the farmer. Farm2Market does not take commission.</p></div>
              </div>
            </div>
          </div>
        </main>
      )}
    </div>
  );
};
