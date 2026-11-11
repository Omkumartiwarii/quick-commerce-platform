'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
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
  Sparkles,
  ArrowRight,
  Award,
  Truck,
  Percent
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
  { id: 'sec-62', name: 'Noida Sector 62 (Electronic City)', zone: 'Central Noida', eta: '9 mins', store: 'JW-MFC-04 Sec 62' },
  { id: 'sec-18', name: 'Noida Sector 18 (Atta Market)', zone: 'South Noida', eta: '11 mins', store: 'JW-MFC-01 Sec 18' },
  { id: 'sec-137', name: 'Noida Sector 137 (Expressway)', zone: 'Expressway', eta: '10 mins', store: 'JW-MFC-07 Sec 137' },
  { id: 'sec-76', name: 'Noida Sector 76 (Central Noida)', zone: 'East Noida', eta: '12 mins', store: 'JW-MFC-09 Sec 76' },
  { id: 'gr-noida-w', name: 'Greater Noida West (Gaur City)', zone: 'Noida Extension', eta: '14 mins', store: 'JW-MFC-12 Gaur City' },
  { id: 'indirapuram', name: 'Ghaziabad / Indirapuram', zone: 'NCR Border', eta: '13 mins', store: 'JW-MFC-06 Indirapuram' },
];

const CATEGORIES = [
  { id: 'all', name: 'Sabhi Items', icon: '🛍️' },
  { id: 'dairy', name: 'Doodh, Dahi & Eggs', icon: '🥛' },
  { id: 'produce', name: 'Taaza Phal & Sabziyan', icon: '🥬' },
  { id: 'munchies', name: 'Namkeen & Chips', icon: '🍿' },
  { id: 'drinks', name: 'Cold Drinks & Juices', icon: '🥤' },
  { id: 'instant', name: 'Maggi & Instant Food', icon: '🍜' },
  { id: 'staples', name: 'Atta, Chawal & Tel', icon: '🌾' },
  { id: 'sweets', name: 'Ice Creams & Meetha', icon: '🍦' },
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
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60',
    badge: 'AAJ KA TAAZA',
  },
  {
    id: 'prod-2',
    name: 'Farm Fresh Laal Tamatar (Hybrid)',
    category: 'produce',
    weight: '1 kg pack',
    mrp: 50,
    price: 36,
    discount: 28,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60',
    badge: 'MANDI SE SEEDHA',
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
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'prod-4',
    name: 'Coca-Cola Zero Sugar Refreshing Can',
    category: 'drinks',
    weight: '300 ml can',
    mrp: 40,
    price: 38,
    discount: 5,
    eta: '7 mins',
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60',
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
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60',
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
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60',
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
    image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'prod-8',
    name: 'Nagpur Raseele Meethe Santre (Oranges)',
    category: 'produce',
    weight: '1 kg (~5-6 pcs)',
    mrp: 130,
    price: 99,
    discount: 24,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=60',
    badge: 'FARM FRESH',
  },
  {
    id: 'prod-9',
    name: "Haldiram's Nagpur Chatpati Bhujia Sev",
    category: 'munchies',
    weight: '350 g pouch',
    mrp: 120,
    price: 104,
    discount: 13,
    eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=60',
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
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=500&auto=format&fit=crop&q=60',
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
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 'prod-12',
    name: 'Mother Dairy Classic Meetha & Creamy Dahi',
    category: 'dairy',
    weight: '400 g tub',
    mrp: 40,
    price: 36,
    discount: 10,
    eta: '8 mins',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60',
  },
];

export default function LandingPage() {
  const [selectedLocation, setSelectedLocation] = useState(NOIDA_LOCATIONS[0]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
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

    const deliveryFee = subtotal >= 199 || subtotal === 0 ? 0 : 15;
    const handlingFee = subtotal > 0 ? 4 : 0;
    const promoDiscount = couponApplied && subtotal >= 199 ? Math.min(100, Math.floor(subtotal * 0.2)) : 0;
    const finalTotal = Math.max(0, subtotal + deliveryFee + handlingFee - promoDiscount);

    return {
      subtotal,
      totalDiscount,
      deliveryFee,
      handlingFee,
      promoDiscount,
      finalTotal,
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

    setTimeout(() => setOrderStep(2), 2000);
    setTimeout(() => setOrderStep(3), 4500);
    setTimeout(() => setOrderStep(4), 7000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-red-600 selection:text-white">
      {/* 1. TOP LIVE OPS STRIP */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white text-xs py-2 px-4 border-b border-indigo-900/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-red-500 tracking-wide">JALDIWALA NOIDA LIVE:</span>
            <span>Own-Inventory Dark Stores Active in Sectors 62, 18, 137 & Indirapuram.</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              100% Apna Inventory
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              FSSAI Lic. #10022051000123
            </span>
            <span>•</span>
            <span className="text-orange-400 font-bold">Cold Chain (0-4°C) Verified</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY HEADER WITH OFFICIAL JALDIWALA LOGO */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            {/* JaldiWala Brand Logo */}
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="relative w-12 h-12 shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="JaldiWala"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="leading-tight">
                <div className="flex items-baseline text-2xl font-black tracking-tight">
                  <span className="text-red-600">Jaldi</span>
                  <span className="text-indigo-950 ml-0.5">Wala</span>
                </div>
                <span className="block text-[10px] font-black tracking-widest text-orange-600 uppercase -mt-0.5">
                  10-MIN MEIN DELIVERY
                </span>
              </div>
            </div>

            {/* Location Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div className="max-w-[200px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {selectedLocation.name.split('(')[0]}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-red-100 text-red-700">
                      ⚡ {selectedLocation.eta}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{selectedLocation.zone} • {selectedLocation.store}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>

              {isLocationDropdownOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-bold text-slate-800">Select Noida Delivery Zone</p>
                    <p className="text-[11px] text-slate-500">Nearest JaldiWala Dark Store mapped</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1">
                    {NOIDA_LOCATIONS.map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocationDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                          selectedLocation.id === loc.id
                            ? 'bg-red-50 text-red-700 font-bold border border-red-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{loc.name}</div>
                          <div className="text-[11px] text-slate-400">{loc.store}</div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-black">
                          {loc.eta}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder='Khojein "Doodh", "Atta", "Tamatar", "Chips", "Coke Zero", "Maggi"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs md:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cart CTA */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm shadow-md shadow-red-600/30 hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Meri Basket</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center bg-white text-red-600 text-xs font-black px-1.5 py-0.5 rounded-full ml-1 min-w-[20px]">
                  {totalCartCount}
                </span>
              )}
              {cartCalculations.subtotal > 0 && (
                <span className="hidden md:inline border-l border-red-400/40 pl-2">
                  ₹{cartCalculations.finalTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO & PROMO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white py-12 px-4">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" />
              <span>JaldiWala: Har Roz 10 Minute Me Delivery!</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Rozmarra Ki Grocery, Seedha{' '}
              <span className="bg-gradient-to-r from-red-500 via-orange-400 to-amber-300 bg-clip-text text-transparent">
                10 Minute Mein.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              No middleman, no marketplace delay. <strong>JaldiWala</strong> owns its dark stores, employs dedicated EV delivery partners, and guarantees 100% in-stock availability across Noida.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-red-400">8.4 mins</div>
                <div className="text-[11px] text-slate-400">Avg Noida Delivery Time</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">7,500+</div>
                <div className="text-[11px] text-slate-400">Verified SKUs In Stock</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-400">0%</div>
                <div className="text-[11px] text-slate-400">Out-of-Stock Cancellations</div>
              </div>
            </div>

            {/* Promo Coupon */}
            <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-red-950/80 via-slate-900 to-indigo-950/80 border border-red-500/40 p-3 rounded-2xl max-w-lg">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400">
                <Percent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Use Coupon: <span className="font-mono text-orange-300 font-black">JALDI100</span></p>
                <p className="text-[11px] text-slate-300">Get ₹100 Flat OFF on your first 3 orders above ₹199</p>
              </div>
              <button
                onClick={() => setCouponApplied(true)}
                className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow"
              >
                {couponApplied ? 'Applied ✓' : 'Apply'}
              </button>
            </div>
          </div>

          {/* JaldiWala Dark Store Live Telematics Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900/90 to-indigo-950/90 border border-slate-700/60 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">JaldiWala Dark Store #04</h3>
                    <p className="text-xs text-slate-400">Noida Sector 62 (Electronic City)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <span className="text-slate-400">Active Delivery Fleet</span>
                  <span className="font-bold text-white">18 Dedicated EV Riders</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <span className="text-slate-400">Picker SLA (Barcode scan)</span>
                  <span className="font-bold text-orange-400">72 seconds average</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <span className="text-slate-400">Cold Chain Storage</span>
                  <span className="font-bold text-cyan-400">Dairy: 3.8°C | Frozen: -18°C</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <span className="text-slate-400">Geospatial Coverage</span>
                  <span className="font-bold text-emerald-400">2.8 km Radius geofence</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-400 shrink-0" />
                <p className="text-[11px] text-red-200">
                  Current dispatch ETA to Sector 62: <strong className="text-white">8 to 11 minutes</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CATEGORIES NAVIGATION */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-black text-slate-900">Grocery Categories</h2>
          <span className="text-xs font-semibold text-red-600">Mandi Se Taaza Stock</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-indigo-950 text-white shadow-md shadow-indigo-950/20 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. PRODUCT CATALOG SHELF */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {selectedCategory === 'all'
                ? 'Trending in Noida Today'
                : CATEGORIES.find((c) => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-xs text-slate-500">
              Showing {filteredProducts.length} verified products available for instant 10-minute dispatch
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 hidden sm:inline">Sort:</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800">
              ⚡ Sabse Tez Delivery
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.map((product) => {
            const count = cart[product.id] || 0;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-3 flex flex-col justify-between hover:shadow-xl hover:border-red-300 transition-all duration-200 group"
              >
                <div className="relative mb-3">
                  <div className="w-full h-36 rounded-2xl overflow-hidden bg-slate-100 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] font-black text-slate-800 shadow-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 text-red-600" />
                    <span>{product.eta}</span>
                  </div>

                  {product.badge && (
                    <div className="absolute bottom-2 left-2 bg-gradient-to-r from-red-600 to-orange-600 text-white px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase shadow">
                      {product.badge}
                    </div>
                  )}

                  {product.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white px-1.5 py-0.5 rounded-md text-[10px] font-black shadow">
                      {product.discount}% OFF
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-1 font-medium">{product.weight}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs sm:text-sm font-black text-slate-900">₹{product.price}</div>
                      {product.mrp > product.price && (
                        <div className="text-[10px] text-slate-400 line-through">₹{product.mrp}</div>
                      )}
                    </div>

                    {count === 0 ? (
                      <button
                        onClick={() => addToCart(product.id)}
                        className="px-3.5 py-1.5 rounded-xl border border-red-500 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-black text-xs transition-all active:scale-95 shadow-sm"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-red-600 text-white rounded-xl px-1.5 py-1 text-xs font-black shadow-md shadow-red-600/30">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-red-700 active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center">{count}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-red-700 active:scale-90"
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

      {/* 6. WHY JALDIWALA SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white border border-indigo-800/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
              Kyun Chunein JaldiWala?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 mb-4">
              Own-Inventory Ka Matlab: 100% Guaranteed Stock & Superfast Delivery!
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Local market app mein kirana dukan par samaan na hone par order cancel ho jata hai.
              <strong> JaldiWala</strong> har ek dark store aur har ek item ka malik khud hai.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">0% Order Cancellation</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Jo app par dikhega, woh dark store rack par 100% available hoga.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">FEFO Expiry Checking</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Kabhi bhi purana doodh ya bread nahi milega. Fresh batch guarantee.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Cold Chain Maintained</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Ice cream aur butter pighalte nahi hain, -18°C temperature control tote bag.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Dedicated EV Fleet</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Store ke bahar tainaat partner riders, order pack hote hi 60 second mein rawana.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SLIDE-OUT CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-red-600" />
                <h3 className="font-black text-slate-900 text-base">Aapki Basket ({totalCartCount} items)</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-red-50 border-b border-red-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-red-950">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div>
                  <p className="font-bold">Delivering to: {selectedLocation.name.split('(')[0]}</p>
                  <p className="text-[10px] text-red-700">Estimated delivery in {selectedLocation.eta}</p>
                </div>
              </div>
              <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                FAST DISPATCH
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {totalCartCount === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                  <ShoppingBag className="w-16 h-16 text-slate-300 mb-3 stroke-[1.5]" />
                  <p className="text-base font-bold text-slate-700">Aapki basket abhi khaali hai</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Taaza doodh, fal, sabziyan ya snacks add kijiye aur 10 minute mein payiye.
                  </p>
                </div>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const prod = PRODUCTS.find((p) => p.id === id);
                  if (!prod) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                    >
                      <img src={prod.image} alt={prod.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                        <p className="text-[10px] text-slate-500">{prod.weight}</p>
                        <p className="text-xs font-black text-slate-900 mt-0.5">₹{prod.price * qty}</p>
                      </div>

                      <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-1.5 py-1 text-xs font-black shadow-sm">
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

            {totalCartCount > 0 && (
              <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Items Total</span>
                    <span className="font-semibold text-slate-800">₹{cartCalculations.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-emerald-600">
                      {cartCalculations.deliveryFee === 0 ? 'FREE' : `₹${cartCalculations.deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Handling & Packaging</span>
                    <span className="font-semibold text-slate-800">₹{cartCalculations.handlingFee}</span>
                  </div>
                  {cartCalculations.promoDiscount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Promo Discount (JALDI100)</span>
                      <span>-₹{cartCalculations.promoDiscount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                    <span>Kul Rakam (To Pay)</span>
                    <span className="text-red-600 text-base">₹{cartCalculations.finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-orange-600 hover:from-red-700 text-white font-black text-sm shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Order Karein • ₹{cartCalculations.finalTotal}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. LIVE ORDER TRACKING MODAL */}
      {isOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/75 backdrop-blur-md"
            onClick={() => setIsOrderModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 z-10 animate-in zoom-in-95 duration-200 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="JaldiWala" className="w-8 h-8 object-contain" />
                <div>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                    JaldiWala Live Telematics
                  </span>
                  <h3 className="text-xl font-black text-slate-900">Order #JW-NOIDA-62-9821</h3>
                </div>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-red-600 to-indigo-900 text-white rounded-2xl p-4 mb-6 shadow-md shadow-red-600/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-90">Pahunch Raha Hai</p>
                  <p className="text-3xl font-black tracking-tight">8 Mins 42 Secs</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  ⚡
                </div>
              </div>
              <p className="text-[11px] text-red-100 mt-2">
                Address: <span className="font-bold text-white">{selectedLocation.name}</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { step: 1, title: 'Order Placed & Confirmed', desc: 'Razorpay UPI Se Payment Verified', icon: CheckCircle2 },
                { step: 2, title: 'Store Accepted & Items Picking', desc: 'JW-MFC-04 Noida Sec 62 (Barcode scanner SLA 72s)', icon: Clock },
                { step: 3, title: 'Packed & Barcode Verified', desc: 'FEFO checked & security sealed in tote', icon: ShieldCheck },
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
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-100 text-red-700 animate-pulse">
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

            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-amber-900">Delivery Confirmation OTP</p>
                <p className="text-[11px] text-amber-700">Rider ko bag lene par ye OTP dein</p>
              </div>
              <div className="font-mono text-xl font-black text-amber-950 tracking-widest bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-sm">
                4829
              </div>
            </div>

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

      {/* 9. STICKY MOBILE CART BAR */}
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
              <span>Basket Dekhein</span>
            </div>
            <span>₹{cartCalculations.finalTotal} • Order Karein &rarr;</span>
          </button>
        </div>
      )}

      {/* 10. FOOTER WITH JALDIWALA BRANDING */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="JaldiWala" className="w-9 h-9 object-contain" />
              <div className="flex items-baseline text-2xl font-black">
                <span className="text-red-600">Jaldi</span>
                <span className="text-indigo-950">Wala</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              India ka vertically integrated own-inventory quick commerce platform. Noida & Delhi NCR mein 10-minute grocery fulfillment.
            </p>
            <div className="pt-2 text-[11px] text-slate-400">
              FSSAI License: <span className="font-mono text-slate-600">10022051000123</span>
              <br />
              GSTIN: <span className="font-mono text-slate-600">09AAACF1234D1Z5</span>
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
            <h4 className="font-bold text-slate-900 mb-3 text-sm">JaldiWala Ecosystem</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>Customer Web Portal (Next.js 15)</li>
              <li>Customer Mobile App (React Native Expo)</li>
              <li>Rider Partner App (GPS Telematics)</li>
              <li>Dark Store Operations Web (Picking/Packing)</li>
              <li>Super Admin Command Center</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-sm">Compliance & Suraksha</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>100% Owned Inventory & Cold Chain</li>
              <li>Consumer Protection E-Commerce Rules 2020</li>
              <li>DPDP Privacy Compliance</li>
              <li>DLT-registered Indian SMS OTP</li>
              <li>Razorpay Verified 256-bit SSL</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 py-4 px-4 text-center text-slate-400 text-[11px]">
          © 2026 JaldiWala Technologies Pvt. Ltd. All rights reserved. Built for Noida / Delhi NCR.
        </div>
      </footer>
    </div>
  );
}
