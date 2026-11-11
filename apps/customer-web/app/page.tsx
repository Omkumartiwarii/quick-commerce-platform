'use client';

import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Search,
  ShoppingBag,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ChevronDown,
  X,
  Plus,
  Minus,
  ArrowRight,
  Award,
  Truck,
  Percent,
  Sparkles,
  Phone,
  Tag,
  Check
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  weight: string;
  mrp: number;
  price: number;
  discount: number;
  eta: string;
  image: string;
  badge?: string;
}

const NOIDA_LOCATIONS = [
  { id: 'sec-62', name: 'Noida Sector 62', sub: 'Electronic City, B-Block, Sector 62', eta: '8-10 mins', store: 'JaldiWala Hub #04' },
  { id: 'sec-18', name: 'Noida Sector 18', sub: 'Atta Market, Wave Silver Tower', eta: '9-11 mins', store: 'JaldiWala Hub #01' },
  { id: 'sec-137', name: 'Noida Sector 137', sub: 'Paras Tierea, Blossom County, Expressway', eta: '10-12 mins', store: 'JaldiWala Hub #07' },
  { id: 'sec-76', name: 'Noida Sector 76', sub: 'Silicon City, Amrapali Silicon', eta: '10-12 mins', store: 'JaldiWala Hub #09' },
  { id: 'gr-noida-w', name: 'Greater Noida West', sub: 'Gaur City 1 & 2, Char Murti', eta: '12-14 mins', store: 'JaldiWala Hub #12' },
  { id: 'indirapuram', name: 'Indirapuram', sub: 'Vaibhav Khand, Shipra Mall Area', eta: '11-13 mins', store: 'JaldiWala Hub #06' },
];

const CATEGORIES = [
  { id: 'all', name: 'All Products', icon: '🛒', bg: 'from-amber-50 to-orange-50 border-orange-200' },
  { id: 'dairy', name: 'Dairy, Bread & Eggs', icon: '🥛', bg: 'from-blue-50 to-indigo-50 border-blue-200' },
  { id: 'produce', name: 'Fresh Fruits & Veggies', icon: '🥬', bg: 'from-emerald-50 to-green-50 border-emerald-200' },
  { id: 'munchies', name: 'Munchies & Chips', icon: '🍿', bg: 'from-yellow-50 to-amber-50 border-yellow-200' },
  { id: 'drinks', name: 'Cold Drinks & Juices', icon: '🥤', bg: 'from-cyan-50 to-sky-50 border-cyan-200' },
  { id: 'instant', name: 'Maggi & Instant Food', icon: '🍜', bg: 'from-rose-50 to-pink-50 border-rose-200' },
  { id: 'staples', name: 'Atta, Rice & Dals', icon: '🌾', bg: 'from-orange-50 to-amber-50 border-orange-200' },
  { id: 'sweets', name: 'Ice Creams & Sweets', icon: '🍦', bg: 'from-purple-50 to-fuchsia-50 border-purple-200' },
];

const PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Amul Taaza Homogenised Toned Milk',
    category: 'dairy',
    weight: '500 ml pouch',
    mrp: 28,
    price: 27,
    discount: 4,
    eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=80',
    badge: 'FRESH TODAY',
  },
  {
    id: 'prod-2',
    name: 'Farm Fresh Red Tomatoes (Hybrid)',
    category: 'produce',
    weight: '1 kg pack',
    mrp: 50,
    price: 36,
    discount: 28,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80',
    badge: 'MANDI FRESH',
  },
  {
    id: 'prod-3',
    name: "Lay's India's Magic Masala Potato Chips",
    category: 'munchies',
    weight: '48 g pouch',
    mrp: 20,
    price: 20,
    discount: 0,
    eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-4',
    name: 'Coca-Cola Zero Sugar Can',
    category: 'drinks',
    weight: '300 ml can',
    mrp: 40,
    price: 38,
    discount: 5,
    eta: '7 mins',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=80',
    badge: 'CHILLED 4°C',
  },
  {
    id: 'prod-5',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    category: 'instant',
    weight: '4 x 70 g pack',
    mrp: 60,
    price: 54,
    discount: 10,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=80',
    badge: 'BESTSELLER',
  },
  {
    id: 'prod-6',
    name: 'Aashirvaad Superior MP Shudh Chakki Atta',
    category: 'staples',
    weight: '5 kg bag',
    mrp: 295,
    price: 254,
    discount: 14,
    eta: '10 mins',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-7',
    name: 'Britannia 100% Whole Wheat Brown Bread',
    category: 'dairy',
    weight: '400 g loaf',
    mrp: 50,
    price: 45,
    discount: 10,
    eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-8',
    name: 'Nagpur Sweet Seedless Oranges',
    category: 'produce',
    weight: '1 kg (~5-6 pcs)',
    mrp: 130,
    price: 99,
    discount: 24,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=80',
    badge: 'FARM DIRECT',
  },
  {
    id: 'prod-9',
    name: "Haldiram's Nagpur Spicy Bhujia Sev",
    category: 'munchies',
    weight: '350 g pouch',
    mrp: 120,
    price: 104,
    discount: 13,
    eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-10',
    name: 'Kwality Walls Dark Chocolate Feast Bar',
    category: 'sweets',
    weight: '70 ml',
    mrp: 50,
    price: 45,
    discount: 10,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=80',
    badge: 'COLD CHAIN -18°C',
  },
  {
    id: 'prod-11',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    category: 'staples',
    weight: '1 L pouch',
    mrp: 175,
    price: 148,
    discount: 15,
    eta: '10 mins',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-12',
    name: 'Mother Dairy Classic Creamy Dahi Tub',
    category: 'dairy',
    weight: '400 g tub',
    mrp: 40,
    price: 36,
    discount: 10,
    eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=80',
  },
];

export default function LandingPage() {
  const [selectedLocation, setSelectedLocation] = useState(NOIDA_LOCATIONS[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<Record<string, number>>({ 'prod-1': 2, 'prod-4': 1 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderStep, setOrderStep] = useState(1);
  const [couponApplied, setCouponApplied] = useState(true);

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const totalCartCount = useMemo(() => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  }, [cart]);

  const cartCalculations = useMemo(() => {
    let subtotal = 0;
    let totalDiscount = 0;

    Object.entries(cart).forEach(([id, qty]) => {
      const prod = PRODUCTS.find((p) => p.id === id);
      if (prod) {
        subtotal += prod.price * qty;
        totalDiscount += (prod.mrp - prod.price) * qty;
      }
    });

    const freeDeliveryThreshold = 199;
    const deliveryFee = subtotal >= freeDeliveryThreshold || subtotal === 0 ? 0 : 15;
    const handlingFee = subtotal > 0 ? 4 : 0;
    const promoDiscount = couponApplied && subtotal >= freeDeliveryThreshold ? Math.min(100, Math.floor(subtotal * 0.2)) : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee + handlingFee - promoDiscount);
    const amountToFreeDelivery = Math.max(0, freeDeliveryThreshold - subtotal);

    return {
      subtotal,
      totalDiscount,
      deliveryFee,
      handlingFee,
      promoDiscount,
      finalTotal,
      amountToFreeDelivery,
    };
  }, [cart, couponApplied]);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
    setOrderStep(1);

    setTimeout(() => setOrderStep(2), 2200);
    setTimeout(() => setOrderStep(3), 4800);
    setTimeout(() => setOrderStep(4), 7200);
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900 pb-20 antialiased selection:bg-red-600 selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-950 text-white text-xs py-2 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-medium">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider">
              Launch Offer
            </span>
            <span className="truncate">
              Flat <strong>₹100 OFF</strong> on your first order with code{' '}
              <span className="font-mono bg-white text-red-600 px-1.5 py-0.5 rounded font-black">
                JALDI100
              </span>{' '}
              • Free delivery above ₹199!
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs shrink-0 text-white/90">
            <div className="flex items-center gap-1.5 bg-amber-400/20 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-bold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
              <span>Powered by <strong className="text-white font-black underline decoration-amber-400">MultiWorkWala</strong></span>
            </div>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              100% Owned Inventory
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-300" />
              FSSAI Certified Cold Chain
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo & Location */}
          <div className="flex items-center gap-5 shrink-0">
            {/* Official JaldiWala Logo & MultiWorkWala Badge */}
            <div className="cursor-pointer group flex items-center gap-2.5" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img
                src="/logo.png"
                alt="JaldiWala - 10-Minute Grocery Delivery"
                className="h-12 md:h-16 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div className="hidden lg:flex flex-col">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-amber-400/50 text-[10px] font-bold text-slate-200 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Powered by <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent font-black tracking-wide">MultiWorkWala</span>
                </span>
              </div>
            </div>

            {/* Location Selector Pill */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-left"
            >
              <div className="w-7 h-7 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="max-w-[170px] lg:max-w-[210px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Delivery in</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                    ⚡ {selectedLocation.eta}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-black text-slate-900 truncate">{selectedLocation.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              </div>
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder='Search "milk", "atta", "chips", "coke zero", "tomatoes"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100/90 hover:bg-slate-100 focus:bg-white text-xs md:text-sm pl-11 pr-10 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-2xl font-black text-xs md:text-sm shadow-md shadow-red-600/25 hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My Basket</span>
              {totalCartCount > 0 ? (
                <span className="bg-white text-red-600 text-xs font-black px-2 py-0.5 rounded-full">
                  {totalCartCount} • ₹{cartCalculations.finalTotal}
                </span>
              ) : (
                <span className="text-xs opacity-90">Empty</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO PROMOTIONAL BANNER */}
      <section className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Main Hero Card */}
          <div className="md:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-red-950 text-white p-6 sm:p-8 flex flex-col justify-between shadow-lg">
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 space-y-3 max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                Guaranteed 10-Minute Delivery
              </span>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                Daily Essentials & Groceries, <br className="hidden sm:inline" />
                Delivered in <span className="text-red-400 underline decoration-wavy decoration-orange-400">10 Minutes!</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Direct from mandi & certified FMCG brands. Stored in temperature-controlled dark stores across Noida.
              </p>
            </div>

            <div className="relative z-10 pt-6 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 px-3.5 py-1.5 rounded-xl text-xs font-bold text-amber-200 shadow-md backdrop-blur-md">
                <span className="text-sm">⚡</span>
                <span>Powered by <strong className="text-white font-black underline decoration-amber-400">MultiWorkWala™</strong></span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs">
                <Truck className="w-4 h-4 text-orange-400" />
                <span>Dedicated EV Delivery Fleet</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Owned Inventory</span>
              </div>
            </div>
          </div>

          {/* Side Promo Card */}
          <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
            <div className="space-y-2">
              <span className="bg-black/20 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                Noida Special
              </span>
              <h3 className="text-xl font-black leading-tight">
                Get ₹100 Flat OFF on Orders Above ₹199
              </h3>
              <p className="text-xs text-amber-100">
                Use code <strong className="font-mono bg-white text-orange-600 px-1.5 py-0.5 rounded">JALDI100</strong> at checkout!
              </p>
            </div>

            <div className="pt-4">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl border border-white/20 flex items-center justify-between">
                <div>
                  <div className="text-xs text-amber-100">Dark Store Serving You</div>
                  <div className="text-sm font-black">{selectedLocation.store}</div>
                </div>
                <div className="text-2xl font-black bg-white text-orange-600 px-3 py-1 rounded-xl shadow-sm">
                  ⚡ 8m
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HORIZONTAL CATEGORY CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Explore Categories</h2>
          <span className="text-xs font-bold text-red-600">Fresh Inward Today</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3 rounded-2xl flex flex-col items-center text-center transition-all duration-200 border ${
                  isSelected
                    ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/30 scale-105'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 shadow-sm'
                }`}
              >
                <div className="text-2xl mb-1.5">{cat.icon}</div>
                <span className="text-[11px] font-bold line-clamp-2 leading-tight">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. PRODUCT CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {selectedCategory === 'all'
                ? 'Trending in Noida Today'
                : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {filteredProducts.length} items in stock at {selectedLocation.store}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              100% In-Stock Guarantee
            </span>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.map((product) => {
            const count = cart[product.id] || 0;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-3 flex flex-col justify-between hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)] hover:border-red-300 transition-all duration-200 group relative"
              >
                {/* Image Box */}
                <div className="relative mb-2.5">
                  <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-50 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* ETA Pill */}
                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-black text-slate-800 shadow-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-600" />
                    <span>{product.eta}</span>
                  </div>

                  {/* Discount Pill */}
                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white px-1.5 py-0.5 rounded-md text-[10px] font-black shadow-sm">
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">{product.weight}</p>
                  </div>

                  {/* Price & Add Button */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm sm:text-base font-black text-slate-900">₹{product.price}</div>
                      {product.mrp > product.price && (
                        <div className="text-[10px] text-slate-400 line-through">₹{product.mrp}</div>
                      )}
                    </div>

                    {/* Add / Counter */}
                    {count === 0 ? (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-4 py-1.5 rounded-xl border-2 border-red-600 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-black text-xs transition-all active:scale-95 shadow-sm"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-600 text-white rounded-xl px-2 py-1 text-xs font-black shadow-md shadow-red-600/30">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-700 active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center">{count}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-700 active:scale-90"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. TRUST & VALUE PROPOSITION */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl shrink-0">
              ⚡
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">10-Minute Rapid Delivery</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Hyperlocal dark stores located within a 3 km radius across Noida ensure delivery before your tea is ready.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">100% Owned Inventory</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                We own our warehouses, cold chains, and inventory. No third-party kirana shop delays or out-of-stock cancellations.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl shrink-0">
              ❄️
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Certified Cold Chain (0-4°C)</h4>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Dairy, meats, and ice creams are preserved at certified sub-zero temperatures and delivered in insulated rider bags.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SLIDE-OUT BASKET DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                <h3 className="font-black text-slate-900 text-base">My Basket ({totalCartCount} items)</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/80 hover:bg-slate-300 flex items-center justify-center text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Delivery address pill */}
            <div className="p-3 bg-red-50 border-b border-red-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-red-950">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold">Delivering to: {selectedLocation.name}</p>
                  <p className="text-[10px] text-red-700">{selectedLocation.sub}</p>
                </div>
              </div>
              <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                ⚡ {selectedLocation.eta}
              </span>
            </div>

            {/* Free Delivery Meter */}
            {totalCartCount > 0 && (
              <div className="p-3 bg-slate-50 border-b border-slate-200 text-xs">
                {cartCalculations.amountToFreeDelivery > 0 ? (
                  <div>
                    <div className="flex justify-between text-slate-700 font-semibold mb-1">
                      <span>Add ₹{cartCalculations.amountToFreeDelivery} more for <strong>FREE Delivery</strong></span>
                      <span className="text-red-600">₹{cartCalculations.subtotal} / ₹199</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-red-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (cartCalculations.subtotal / 199) * 100)}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Yay! You've unlocked FREE Delivery on this order</span>
                  </div>
                )}
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {totalCartCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mb-3">
                    🛒
                  </div>
                  <p className="text-base font-bold text-slate-800">Your basket is empty</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Add fresh milk, bread, farm vegetables or snacks to start your 10-minute order.
                  </p>
                </div>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const prod = PRODUCTS.find((p) => p.id === id);
                  if (!prod) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                    >
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                        <p className="text-[10px] text-slate-500">{prod.weight}</p>
                        <p className="text-xs font-black text-slate-900 mt-0.5">₹{prod.price * qty}</p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-2 py-1 text-xs font-black shadow-sm">
                        <button
                          onClick={() => removeFromCart(id)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-red-600">{qty}</span>
                        <button
                          onClick={() => addToCart(id)}
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-700 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Bill Summary */}
            {totalCartCount > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-semibold text-slate-900">₹{cartCalculations.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-emerald-600">
                      {cartCalculations.deliveryFee === 0 ? 'FREE' : `₹${cartCalculations.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handling Fee</span>
                    <span className="font-semibold text-slate-900">₹{cartCalculations.handlingFee}</span>
                  </div>
                  {cartCalculations.promoDiscount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Promo Savings (JALDI100)</span>
                      <span>-₹{cartCalculations.promoDiscount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-base text-slate-900">
                    <span>To Pay</span>
                    <span className="text-red-600">₹{cartCalculations.finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Place Order • ₹{cartCalculations.finalTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. LOCATION SELECTOR MODAL */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsLocationModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-900 text-lg">Select Noida Delivery Zone</h3>
                <p className="text-xs text-slate-500">Pick your sector to map nearest JaldiWala Dark Store</p>
              </div>
              <button
                onClick={() => setIsLocationModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {NOIDA_LOCATIONS.map((loc) => {
                const isSelected = selectedLocation.id === loc.id;
                return (
                  <button
                    key={loc.id}
                    onClick={() => {
                      setSelectedLocation(loc);
                      setIsLocationModalOpen(false);
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-red-600 bg-red-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-slate-900">{loc.name}</span>
                        {isSelected && <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded">SELECTED</span>}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{loc.sub}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black shrink-0">
                      ⚡ {loc.eta}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 9. LIVE ORDER TRACKING MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/75 backdrop-blur-md"
            onClick={() => setIsOrderModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="JaldiWala" className="h-10 w-auto object-contain" />
                <div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                    Live Telematics Dispatch
                  </span>
                  <h3 className="text-lg font-black text-slate-900">Order #JW-NOIDA-62-9821</h3>
                </div>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* ETA Countdown Card */}
            <div className="bg-gradient-to-r from-red-600 via-rose-600 to-indigo-950 text-white rounded-2xl p-4 mb-5 shadow-md shadow-red-600/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-90">Arriving At Your Door</p>
                  <p className="text-3xl font-black tracking-tight">8 Mins 42 Secs</p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  ⚡
                </div>
              </div>
              <p className="text-[11px] text-red-100 mt-2">
                Delivering to: <strong className="text-white">{selectedLocation.name}</strong>
              </p>
            </div>

            {/* Stepper Visualizer */}
            <div className="space-y-3.5 mb-5">
              {[
                { step: 1, title: 'Order Placed & Confirmed', desc: 'Verified via Razorpay UPI', icon: CheckCircle2 },
                { step: 2, title: 'Store Accepted & Picking Items', desc: `${selectedLocation.store} (Barcode scan SLA 72s)`, icon: Clock },
                { step: 3, title: 'Packed & Barcode Verified', desc: 'FEFO checked & security sealed', icon: ShieldCheck },
                { step: 4, title: 'Rider Out for Delivery', desc: 'Ramesh Kumar (Hero Splendor EV • 4.9 ★)', icon: Truck },
              ].map((item) => {
                const isPassed = orderStep >= item.step;
                const isCurrent = orderStep === item.step;
                const Icon = item.icon;
                return (
                  <div key={item.step} className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`text-xs font-bold ${isPassed ? 'text-slate-900' : 'text-slate-400'}`}>
                          {item.title}
                        </h4>
                        {isCurrent && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-black bg-red-100 text-red-700 animate-pulse">
                            IN PROGRESS
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Delivery OTP */}
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Delivery Confirmation OTP</p>
                <p className="text-[11px] text-amber-700">Share with rider upon bag handover</p>
              </div>
              <div className="font-mono text-xl font-black text-amber-950 tracking-widest bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-sm">
                4829
              </div>
            </div>

            {/* Test Step Controller */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Showcase State Simulator:</span>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((s) => (
                  <button
                    key={s}
                    onClick={() => setOrderStep(s)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      orderStep === s ? 'bg-red-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    Step {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 10. STICKY MOBILE CART BAR */}
      {totalCartCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 md:hidden z-30">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 text-white p-3.5 rounded-2xl shadow-xl shadow-red-600/40 flex items-center justify-between font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-red-600 text-xs flex items-center justify-center font-black">
                {totalCartCount}
              </span>
              <span>View Basket</span>
            </div>
            <span>₹{cartCalculations.finalTotal} • Checkout &rarr;</span>
          </button>
        </div>
      )}

      {/* 11. FOOTER */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs mt-16">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* 4-Column Directory Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
            <div className="space-y-3">
              <img src="/logo.png" alt="JaldiWala" className="h-16 w-auto object-contain" />
              <p className="text-slate-500 text-xs leading-relaxed">
                India's vertically integrated own-inventory quick commerce platform. Serving Noida & Delhi NCR with 10-minute grocery fulfillment.
              </p>
              <div className="pt-2 text-[11px] text-slate-400">
                FSSAI License: <span className="font-mono text-slate-600 font-bold">10022051000123</span>
                <br />
                GSTIN: <span className="font-mono text-slate-600 font-bold">09AAACF1234D1Z5</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">Noida Dark Store Hubs</h4>
              <ul className="space-y-1.5 text-slate-500">
                <li>JW-01: Noida Sector 18 (Atta Market)</li>
                <li>JW-04: Noida Sector 62 (Electronic City)</li>
                <li>JW-07: Noida Sector 137 (Expressway)</li>
                <li>JW-09: Noida Sector 76 (Central Noida)</li>
                <li>JW-12: Greater Noida West (Gaur City)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">JaldiWala Platforms</h4>
              <ul className="space-y-1.5 text-slate-500">
                <li>Customer Web Portal (Next.js 15)</li>
                <li>Customer Mobile App (React Native Expo)</li>
                <li>Delivery Partner App (GPS Telematics)</li>
                <li>Dark Store Operations Web (Picking/Packing)</li>
                <li>Super Admin Command Center</li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-3 text-sm">Compliance & Trust</h4>
              <ul className="space-y-1.5 text-slate-500">
                <li>100% Owned Inventory & Cold Chain</li>
                <li>Consumer Protection E-Commerce Rules 2020</li>
                <li>DPDP Act 2023 Compliant</li>
                <li>DLT-registered Indian SMS OTP</li>
                <li>Razorpay Verified 256-bit SSL</li>
              </ul>
            </div>
          </div>

          {/* POWERED BY MULTIWORKWALA ENTERPRISE SHOWCASE CARD (HIGH-IMPACT HIGHLIGHT) */}
          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute left-1/3 top-0 w-44 h-44 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4 sm:gap-5 flex-col sm:flex-row text-center sm:text-left">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-amber-500/30 shrink-0">
                  ⚡
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-[11px] font-black uppercase tracking-wider text-amber-300 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    Official Technology & Infrastructure Partner
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Powered by{' '}
                    <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent underline decoration-amber-400 decoration-wavy">
                      MultiWorkWala
                    </span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-2xl leading-relaxed">
                    Proprietary Quick Commerce Architecture, 14-State Order Automation Engine, High-Concurrency FEFO Dark Store Inventory, and Sub-10ms PostGIS Geofencing telematics engineered by MultiWorkWala.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
                <div className="px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-white text-xs font-black backdrop-blur-md flex items-center gap-2 shadow-inner w-full sm:w-auto justify-center">
                  <span className="text-emerald-400 text-sm">✔</span> MultiWorkWala Enterprise Core v2.4
                </div>
              </div>
            </div>
          </div>

          {/* COPYRIGHT CLAIM & LEGAL PROTECTION */}
          <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="text-center md:text-left leading-relaxed">
              <p className="font-bold text-slate-800 text-xs">
                © 2026 JaldiWala Technologies Private Limited. All Rights Reserved.
              </p>
              <p className="mt-1 text-slate-500 max-w-3xl">
                Architected & <strong className="text-slate-800 font-bold">Powered by MultiWorkWala™</strong>. All proprietary source code, dark store telematics, inventory allocation algorithms, and creative visual assets are legally copyrighted under the <strong>Indian Copyright Act, 1957</strong> and relevant international conventions. Any unauthorized copying, distribution, decompilation, or commercial imitation will invoke strict legal action.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-slate-600 font-semibold shrink-0">
              <span className="hover:text-red-600 cursor-pointer">Terms of Use</span>
              <span>•</span>
              <span className="hover:text-red-600 cursor-pointer">Privacy Policy</span>
              <span>•</span>
              <span className="hover:text-red-600 cursor-pointer">Copyright Claim</span>
              <span>•</span>
              <span className="hover:text-red-600 cursor-pointer">DPDP Act Compliance</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
