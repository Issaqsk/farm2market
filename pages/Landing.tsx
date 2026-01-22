
import React from 'react';
import { ArrowRight, Leaf, TrendingUp, ShieldCheck, Users } from 'lucide-react';

interface LandingProps {
  onStart: (role: 'FARMER' | 'BUYER') => void;
}

export const Landing: React.FC<LandingProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Leaf className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-emerald-900 font-heading">Farm2Market</span>
        </div>
        <div className="hidden md:flex gap-8 text-slate-600 font-medium">
          <a href="#how-it-works" className="hover:text-emerald-600">How it Works</a>
          <a href="#impact" className="hover:text-emerald-600">Our Impact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-semibold text-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Empowering 10,000+ Indian Farmers
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-slate-900 leading-[1.1]">
            From Farm to Buyer. <br />
            <span className="text-emerald-600">No Middlemen.</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
            Eliminate exploitation. Farmers get 100% of the profits. Buyers get the freshest harvest directly from the source.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onStart('FARMER')}
              className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 group"
            >
              I am a Farmer <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => onStart('BUYER')}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 group"
            >
              I am a Buyer <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <p className="text-sm text-slate-400 font-medium italic">
            "Eliminating commission-based agents since 2024"
          </p>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-200/50 rounded-full blur-3xl opacity-30 -z-10"></div>
          <img 
            src="https://picsum.photos/seed/farmer/800/600" 
            alt="Farmer in Field" 
            className="rounded-[2.5rem] shadow-2xl w-full object-cover aspect-[4/3]"
          />
          <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-3xl shadow-xl border hidden md:block max-w-xs animate-bounce-slow">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-2xl">
                <TrendingUp className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Farmer Profit Boost</p>
                <p className="text-2xl font-bold text-slate-900">+35.8%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900">Why Farm2Market?</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We use advanced AI to ensure fairness and quality in every transaction.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <ShieldCheck className="text-emerald-600" />, title: "Verified Farmers", desc: "Every seller is manually verified to ensure high-quality organic practices." },
              { icon: <TrendingUp className="text-emerald-600" />, title: "AI Price Guidance", desc: "Our AI analyzes local market rates to suggest the best price for your hard work." },
              { icon: <Users className="text-emerald-600" />, title: "Direct Connection", desc: "No agents, no hidden fees. Chat directly with farmers and build trust." }
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition-all">
                <div className="bg-emerald-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="py-20 bg-emerald-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">"Zero Hidden Fees. 100% Transparency."</h2>
          <p className="text-emerald-200 text-lg">We charge zero commission from farmers. Our goal is to make healthy food affordable for buyers and profitable for farmers.</p>
          <div className="flex justify-center gap-12">
            <div>
              <p className="text-4xl font-bold">12k+</p>
              <p className="text-emerald-400">Products Listed</p>
            </div>
            <div>
              <p className="text-4xl font-bold">₹2Cr+</p>
              <p className="text-emerald-400">Farmer Earnings</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t text-center text-slate-500 text-sm">
        <p>© 2024 Farm2Market. Built for India's Green Future.</p>
      </footer>
    </div>
  );
};
