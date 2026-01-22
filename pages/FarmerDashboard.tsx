
import React, { useState, useEffect } from 'react';
import { 
  Plus, LayoutDashboard, ShoppingBag, BarChart3, 
  Settings, LogOut, Package, TrendingUp, AlertCircle, 
  CheckCircle2, IndianRupee, MapPin, Sparkles, Camera, Trash2, Clock, Leaf
} from 'lucide-react';
import { Product, Order } from '../types';
import { FarmerAnalytics } from '../components/FarmerAnalytics';
import { getPriceSuggestion, getCropRecommendations, checkProductQuality } from '../services/geminiService';

interface FarmerDashboardProps {
  onLogout: () => void;
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrder: (id: string, status: Order['status']) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({ 
  onLogout, products, orders, onAddProduct, onDeleteProduct, onUpdateOrder 
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'ai'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Vegetables' as Product['category'],
    price: '',
    unit: 'kg',
    quantity: '',
    location: 'Nashik, Maharashtra'
  });
  const [aiPriceHint, setAiPriceHint] = useState<{suggestedPrice: number, explanation: string} | null>(null);
  const [qualityFeedback, setQualityFeedback] = useState<{score: number, feedback: string} | null>(null);

  useEffect(() => {
    fetchAIRecommendations();
  }, []);

  const fetchAIRecommendations = async () => {
    setLoadingAI(true);
    const res = await getCropRecommendations('Maharashtra');
    setRecommendations(res);
    setLoadingAI(false);
  };

  const handlePriceSuggestion = async () => {
    if (!newProduct.name) return;
    setLoadingAI(true);
    const res = await getPriceSuggestion(newProduct.name, newProduct.location, newProduct.category);
    setAiPriceHint(res);
    setNewProduct(prev => ({ ...prev, price: res.suggestedPrice.toString() }));
    setLoadingAI(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoadingAI(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(',')[1];
      const res = await checkProductQuality(base64);
      setQualityFeedback(res);
      setLoadingAI(false);
    };
    reader.readAsDataURL(file);
  };

  const submitProduct = () => {
    // Generate a thematic image based on keywords in the product name
    const keywords = newProduct.name.toLowerCase().split(' ').join(',');
    const p: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProduct.name,
      category: newProduct.category,
      price: parseFloat(newProduct.price),
      unit: newProduct.unit,
      quantity: parseInt(newProduct.quantity),
      harvestDate: new Date().toISOString().split('T')[0],
      isOrganic: true,
      imageUrl: `https://loremflickr.com/600/400/${keywords}`,
      farmerId: 'f1',
      farmerName: 'Rajesh Kumar',
      location: newProduct.location,
      qualityScore: qualityFeedback?.score || 8.5
    };
    onAddProduct(p);
    setIsAddModalOpen(false);
    setNewProduct({ name: '', category: 'Vegetables', price: '', unit: 'kg', quantity: '', location: 'Nashik, Maharashtra' });
    setAiPriceHint(null);
    setQualityFeedback(null);
  };

  const totalEarnings = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-emerald-600 p-2 rounded-lg"><Package className="text-white" size={20} /></div>
            <span className="text-xl font-bold text-slate-800 font-heading">FarmerPanel</span>
          </div>
          <nav className="space-y-1">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><LayoutDashboard size={20} /> Overview</button>
            <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'products' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><ShoppingBag size={20} /> My Products</button>
            <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'orders' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><Package size={20} /> Orders</button>
            <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'ai' ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}><Sparkles size={20} /> AI Insights</button>
          </nav>
        </div>
        <div className="mt-auto p-6 border-t border-slate-100">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:text-red-600 rounded-xl transition-all"><LogOut size={20} /> Logout</button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 font-heading">Namaste, Rajesh! 👋</h1>
            <p className="text-slate-500">Managing {products.length} active listings today.</p>
          </div>
          <button onClick={() => setIsAddModalOpen(true)} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all flex items-center gap-2"><Plus size={20} /> Add New Crop</button>
        </header>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-emerald-50 w-fit rounded-2xl mb-4 text-emerald-600"><IndianRupee size={24}/></div>
                <p className="text-slate-500 text-sm font-medium">Total Earnings</p>
                <h2 className="text-3xl font-bold text-slate-800">₹{totalEarnings.toLocaleString()}</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-blue-50 w-fit rounded-2xl mb-4 text-blue-600"><ShoppingBag size={24}/></div>
                <p className="text-slate-500 text-sm font-medium">Active Crops</p>
                <h2 className="text-3xl font-bold text-slate-800">{products.length}</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-amber-50 w-fit rounded-2xl mb-4 text-amber-600"><AlertCircle size={24}/></div>
                <p className="text-slate-500 text-sm font-medium">Pending Orders</p>
                <h2 className="text-3xl font-bold text-slate-800">{orders.filter(o => o.status === 'Pending').length}</h2>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                <div className="p-3 bg-green-50 w-fit rounded-2xl mb-4 text-green-600"><CheckCircle2 size={24}/></div>
                <p className="text-slate-500 text-sm font-medium">Success Rate</p>
                <h2 className="text-3xl font-bold text-slate-800">98.5%</h2>
              </div>
            </div>
            <FarmerAnalytics />
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-slate-800">My Listed Crops</h3>
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-bold">Product</th>
                      <th className="px-6 py-4 font-bold">Category</th>
                      <th className="px-6 py-4 font-bold">Price</th>
                      <th className="px-6 py-4 font-bold">Inventory</th>
                      <th className="px-6 py-4 font-bold">Quality</th>
                      <th className="px-6 py-4 font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.imageUrl} className="w-12 h-12 rounded-xl object-cover" />
                            <span className="font-bold text-slate-800">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{p.category}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">₹{p.price}/{p.unit}</td>
                        <td className="px-6 py-4 text-slate-500">{p.quantity} {p.unit}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded">{p.qualityScore} AI</span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => onDeleteProduct(p.id)} className="text-slate-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"><Trash2 size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold text-slate-800">Order Management</h3>
            <div className="grid gap-4">
              {orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200"><p className="text-slate-400 font-medium">No orders received yet.</p></div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className={`p-4 rounded-2xl ${order.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        <Clock size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-lg">{order.productName}</h4>
                        <p className="text-sm text-slate-500">Buyer: <span className="font-semibold text-slate-700">{order.buyerName}</span></p>
                        <p className="text-xs text-slate-400">{order.date} • {order.quantity} units</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Total Value</p>
                        <p className="text-2xl font-black text-slate-900">₹{order.totalPrice}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'Pending' && (
                          <button onClick={() => onUpdateOrder(order.id, 'Accepted')} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-md">Accept</button>
                        )}
                        {order.status === 'Accepted' && (
                          <button onClick={() => onUpdateOrder(order.id, 'Completed')} className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-md">Complete</button>
                        )}
                        <span className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${order.status === 'Completed' ? 'bg-slate-100 text-slate-500' : 'hidden'}`}>{order.status}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-emerald-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden">
              <Sparkles className="absolute top-10 right-10 opacity-20" size={120} />
              <div className="max-w-xl space-y-4 relative z-10">
                <h2 className="text-4xl font-bold font-heading">Smart Harvest Predictions</h2>
                <p className="text-emerald-100 opacity-80 leading-relaxed">AI analyzes weather, soil data, and current trends in Maharashtra to suggest profitable planting strategies.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:border-emerald-500 transition-all group">
                  <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-emerald-600 group-hover:scale-110 transition-transform"><Leaf /></div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2 font-heading">{rec.cropName}</h3>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase mb-4 inline-block">Demand: {rec.expectedDemand}</span>
                  <p className="text-slate-600 text-sm leading-relaxed">{rec.reason}</p>
                </div>
              ))}
              {loadingAI && <div className="col-span-3 text-center py-12 text-slate-500 font-medium animate-pulse">Consulting AI experts...</div>}
            </div>
          </div>
        )}
      </main>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-emerald-50">
              <div>
                <h2 className="text-2xl font-bold text-emerald-900 font-heading">List Your Harvest</h2>
                <p className="text-emerald-700/60 font-medium">Use AI to ensure fair pricing and quality.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="bg-white p-2 rounded-full shadow-sm hover:bg-slate-50 transition-colors"><AlertCircle size={24} /></button>
            </div>
            
            <div className="p-8 space-y-6 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Crop Name</label>
                  <input type="text" placeholder="e.g. Basmati Rice" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                  <button onClick={handlePriceSuggestion} className="text-xs font-bold text-emerald-600 flex items-center gap-1 hover:underline"><Sparkles size={14} /> Get AI Price Suggestion</button>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value as any})} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                    <option>Vegetables</option><option>Fruits</option><option>Grains</option><option>Dairy</option>
                  </select>
                </div>
              </div>
              {aiPriceHint && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl animate-in slide-in-from-top-2">
                  <p className="text-sm font-bold text-amber-800 flex items-center gap-2"><TrendingUp size={16} /> AI Market Guidance</p>
                  <p className="text-xs text-amber-700 mt-1">{aiPriceHint.explanation}</p>
                </div>
              )}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Price (INR)</label><input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} placeholder="0.00" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Unit</label><input type="text" value={newProduct.unit} onChange={(e) => setNewProduct({...newProduct, unit: e.target.value})} placeholder="kg" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></div>
                <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Quantity</label><input type="number" value={newProduct.quantity} onChange={(e) => setNewProduct({...newProduct, quantity: e.target.value})} placeholder="100" className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:outline-none" /></div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Upload Harvest Photo</label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center bg-slate-50 relative group hover:border-emerald-500 transition-colors">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} accept="image/*" />
                  <div className="space-y-2">
                    <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm group-hover:scale-110 transition-transform"><Camera className="text-slate-400 group-hover:text-emerald-500" /></div>
                    <p className="text-sm text-slate-500 font-medium">Click to upload harvest photo</p>
                    <p className="text-xs text-slate-400">AI will auto-check quality upon upload</p>
                  </div>
                </div>
              </div>
              {qualityFeedback && (
                <div className="flex items-start gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="bg-white px-3 py-2 rounded-xl border border-emerald-200 text-center"><p className="text-xs font-bold text-emerald-800 uppercase">Score</p><p className="text-2xl font-black text-emerald-600">{qualityFeedback.score}</p></div>
                  <div className="flex-1"><p className="text-sm font-bold text-emerald-900">AI Quality Check Result</p><p className="text-xs text-emerald-700 leading-relaxed mt-1">{qualityFeedback.feedback}</p></div>
                </div>
              )}
            </div>
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-4 bg-white text-slate-600 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">Cancel</button>
              <button onClick={submitProduct} className="flex-2 px-12 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all" disabled={loadingAI}>{loadingAI ? 'AI Processing...' : 'Publish to Market'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
