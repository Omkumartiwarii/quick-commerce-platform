'use client';

import React, { useState, useMemo } from 'react';
import {
  Zap,
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
  { id: 'sec-62', name: 'Noida Sector 62 (Electronic City)', zone: 'Central Noida', eta: '9 mins', store: 'MFC-04 Sec 62' },
  { id: 'sec-18', name: 'Noida Sector 18 (Atta Market)', zone: 'South Noida', eta: '11 mins', store: 'MFC-01 Sec 18' },
  { id: 'sec-137', name: 'Noida Sector 137 (Expressway)', zone: 'Expressway', eta: '10 mins', store: 'MFC-07 Sec 137' },
  { id: 'sec-76', name: 'Noida Sector 76 (Central Noida)', zone: 'East Noida', eta: '12 mins', store: 'MFC-09 Sec 76' },
  { id: 'gr-noida-w', name: 'Greater Noida West (Gaur City)', zone: 'Noida Extension', eta: '14 mins', store: 'MFC-12 Gaur City' },
  { id: 'indirapuram', name: 'Ghaziabad / Indirapuram', zone: 'NCR Border', eta: '13 mins', store: 'MFC-06 Indirapuram' },
];

const CATEGORIES = [
  { id: 'all', name: 'All Items', icon: '🛍️' },
  { id: 'dairy', name: 'Dairy, Bread & Eggs', icon: '🥛' },
  { id: 'produce', name: 'Fruits & Veggies', icon: '🥬' },
  { id: 'munchies', name: 'Munchies & Chips', icon: '🍿' },
  { id: 'drinks', name: 'Cold Drinks & Juices', icon: '🥤' },
  { id: 'instant', name: 'Instant Food', icon: '🍜' },
  { id: 'staples', name: 'Atta, Rice & Dals', icon: '🌾' },
  { id: 'sweets', name: 'Ice Creams & Sweets', icon: '🍦' },
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
    badge: 'FRESH TODAY',
  },
  {
    id: 'prod-2',
    name: 'Fresh Farm Red Tomatoes (Hybrid)',
    category: 'produce',
    weight: '1 kg pack',
    mrp: 50,
    price: 36,
    discount: 28,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60',
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
    name: 'Fresh Nagpur Seedless Sweet Oranges',
    category: 'produce',
    weight: '1 kg (~5-6 pcs)',
    mrp: 130,
    price: 99,
    discount: 24,
    eta: '9 mins',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=500&auto=format&fit=crop&q=60',
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
    name: 'Mother Dairy Classic Creamy Dahi Tub',
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
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 selection:bg-pink-500 selection:text-white">
      {/* 1. TOP LIVE OPS STRIP */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white text-xs py-2 px-4 border-b border-purple-800/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-emerald-400">NOIDA LIVE:</span>
            <span>Own-Inventory Dark Stores Active in Sectors 62, 18, 137 & Indirapuram.</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              100% Owned Inventory
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              FSSAI Lic. #10022051000123
            </span>
            <span>•</span>
            <span className="text-pink-400 font-bold">Cold Chain (0-4°C) Verified</span>
          </div>
        </div>
      </div>

      {/* 2. STICKY HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-pink-500/25 group-hover:scale-105 transition-transform">
                <Zap className="w-6 h-6 fill-white stroke-none" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  FlashDrop
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-slate-400 uppercase -mt-1">
                  10-MIN GROCERY
                </span>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <button
                onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200 transition-colors text-left"
              >
                <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                <div className="max-w-[200px]">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {selectedLocation.name.split('(')[0]}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-pink-100 text-pink-700">
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
                    <p className="text-[11px] text-slate-500">Stores mapped by PostGIS geofence</p>
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
                            ? 'bg-pink-50 text-pink-700 font-bold border border-pink-200'
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

          <div className="flex-1 max-w-xl mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder='Search "milk", "atta", "mangoes", "chips", "coke zero"...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-100/80 focus:bg-white text-xs md:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all shadow-inner"
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

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm shadow-md shadow-pink-600/30 hover:shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">My Cart</span>
              {totalCartCount > 0 && (
                <span className="flex items-center justify-center bg-white text-pink-600 text-xs font-black px-1.5 py-0.5 rounded-full ml-1 min-w-[20px]">
                  {totalCartCount}
                </span>
              )}
              {cartCalculations.subtotal > 0 && (
                <span className="hidden md:inline border-l border-pink-400/40 pl-2">
                  ₹{cartCalculations.finalTotal}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO & PROMO BANNER */}
      <section className="relative overflow-hidden bg-gradient-to-b from-purple-900 via-slate-900 to-slate-950 text-white py-12 px-4">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-300 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Noida Launch Special: 100% Owned Inventory Delivery</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Groceries Delivered in{' '}
              <span className="bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
                10 Minutes.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              No middleman vendors. We own the inventory in dedicated dark stores across Noida.
              Fresh milk, farm veggies, chilled drinks, and snacks at your doorstep before your water boils.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2 max-w-lg">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-pink-400">8.4 mins</div>
                <div className="text-[11px] text-slate-400">Avg Noida Delivery SLA</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-emerald-400">7,500+</div>
                <div className="text-[11px] text-slate-400">Active SKUs In Stock</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                <div className="text-xl sm:text-2xl font-black text-amber-400">0%</div>
                <div className="text-[11px] text-slate-400">Out of Stock Cancellations</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 bg-gradient-to-r from-pink-950/80 to-purple-950/80 border border-pink-500/40 p-3 rounded-2xl max-w-lg">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
                <Percent className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-white">Use Coupon: <span className="font-mono text-pink-300 font-black">NOIDA100</span></p>
                <p className="text-[11px] text-slate-300">Get ₹100 Flat OFF on orders above ₹199</p>
              </div>
              <button
                onClick={() => setCouponApplied(true)}
                className="px-3 py-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all shadow"
              >
                {couponApplied ? 'Applied ✓' : 'Apply'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-800/80 to-slate-900/90 border border-slate-700/60 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Truck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Noida Sector 62 Dark Store</h3>
                    <p className="text-xs text-slate-400">Hub Code: MFC-NOIDA-04</p>
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
                  <span className="font-bold text-pink-400">72 seconds average</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <span className="text-slate-400">Cold Chain Storage</span>
                  <span className="font-bold text-cyan-400">Dairy: 3.8°C | Frozen: -18°C</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
                  <span className="text-slate-400">Service Coverage</span>
                  <span className="font-bold text-emerald-400">2.8 km Radius geofence</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center gap-3">
                <Clock className="w-5 h-5 text-pink-400 shrink-0" />
                <p className="text-[11px] text-pink-200">
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
          <h2 className="text-xl font-black text-slate-900">Explore Grocery Categories</h2>
          <span className="text-xs font-semibold text-pink-600">Fresh Stock Inwarded Today</span>
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
                    ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20 scale-105'
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
              ⚡ Fastest Delivery
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredProducts.map((product) => {
            const count = cart[product.id] || 0;
            return (
              <div
                key={product.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-3 flex flex-col justify-between hover:shadow-xl hover:border-pink-300 transition-all duration-200 group"
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
                    <Clock className="w-3 h-3 text-pink-600" />
                    <span>{product.eta}</span>
                  </div>

                  {product.badge && (
                    <div className="absolute bottom-2 left-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white px-2 py-0.5 rounded text-[9px] font-black tracking-wider uppercase shadow">
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
                        className="px-3.5 py-1.5 rounded-xl border border-pink-500 bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white font-black text-xs transition-all active:scale-95 shadow-sm"
                      >
                        ADD
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-pink-600 text-white rounded-xl px-1.5 py-1 text-xs font-black shadow-md shadow-pink-600/30">
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-pink-700 active:scale-90"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center">{count}</span>
                        <button
                          onClick={() => addToCart(product.id)}
                          className="w-5 h-5 flex items-center justify-center rounded-lg hover:bg-pink-700 active:scale-90"
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

      {/* 6. WHY OWN INVENTORY SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-tr from-slate-900 via-purple-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white border border-purple-800/40 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-widest">
              The Own-Inventory Difference
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mt-2 mb-4">
              Why FlashDrop is 3x faster and 100% reliable.
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-8">
              Traditional aggregator apps list local kirana stores without knowing actual shelf stock.
              FlashDrop owns every single dark store, cold room, and item from procurement to delivery.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Zero Ghost Items</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Every SKU is tracked in real-time. If it shows in app, it exists on our shelf.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">FEFO Expiry Audited</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    First-Expiry-First-Out system prevents near-expiry goods from reaching customers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Cold Chain Maintained</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Ice creams and dairy remain at -18°C and 4°C until sealed inside insulated rider totes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-white">Dedicated Rider Fleet</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Full-time partner riders stationed at the store entrance ready to roll in 60 seconds.
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
                <ShoppingBag className="w-5 h-5 text-pink-600" />
                <h3 className="font-black text-slate-900 text-base">Your Cart ({totalCartCount} items)</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-200/70 hover:bg-slate-300 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-pink-50 border-b border-pink-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-pink-900">
                <MapPin className="w-4 h-4 text-pink-600 shrink-0" />
                <div>
                  <p className="font-bold">Delivering to: {selectedLocation.name.split('(')[0]}</p>
                  <p className="text-[10px] text-pink-700">Estimated delivery in {selectedLocation.eta}</p>
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
                  <p className="text-base font-bold text-slate-700">Your basket is empty</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs">
                    Explore daily fresh produce, milk, chips and snacks to fill your 10-minute basket.
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
                        <span className="w-4 text-center text-pink-600">{qty}</span>
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
                    <div className="flex justify-between text-pink-600 font-bold">
                      <span>Promo Discount (NOIDA100)</span>
                      <span>-₹{cartCalculations.promoDiscount}</span>
                    </div>
                  )}
                  <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                    <span>To Pay</span>
                    <span className="text-pink-600 text-base">₹{cartCalculations.finalTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black text-sm shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <span>Place Order • ₹{cartCalculations.finalTotal}</span>
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
              <div>
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest">
                  Live Dispatch Telematics
                </span>
                <h3 className="text-xl font-black text-slate-900">Order #ORD-NOIDA-62-9821</h3>
              </div>
              <button
                onClick={() => setIsOrderModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-4 mb-6 shadow-md shadow-pink-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider font-semibold opacity-90">Arriving in</p>
                  <p className="text-3xl font-black tracking-tight">8 Mins 42 Secs</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl">
                  ⚡
                </div>
              </div>
              <p className="text-[11px] text-pink-100 mt-2">
                Delivering to: <span className="font-bold text-white">{selectedLocation.name}</span>
              </p>
            </div>

            <div className="space-y-4 mb-6">
              {[
                { step: 1, title: 'Order Placed & Confirmed', desc: 'Payment verified via Razorpay UPI', icon: CheckCircle2 },
                { step: 2, title: 'Store Accepted & Items Picking', desc: 'MFC-04 Noida Sec 62 (Aisle 3 & Cold Bay)', icon: Clock },
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
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-pink-100 text-pink-700 animate-pulse">
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
                <p className="text-[11px] text-amber-700">Share this with rider upon bag handover</p>
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
                      orderStep === s ? 'bg-pink-600 text-white' : 'bg-slate-100 hover:bg-slate-200'
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
            className="w-full bg-pink-600 hover:bg-pink-700 text-white p-3.5 rounded-2xl shadow-xl shadow-pink-600/40 flex items-center justify-between font-bold text-sm"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-white text-pink-600 text-xs flex items-center justify-center font-black">
                {totalCartCount}
              </span>
              <span>View Basket</span>
            </div>
            <span>₹{cartCalculations.finalTotal} • Checkout &rarr;</span>
          </button>
        </div>
      )}

      {/* 10. COMPREHENSIVE FOOTER */}
      <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-pink-600 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-white stroke-none" />
              </div>
              <span className="text-xl font-black text-slate-900">FlashDrop</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              India's vertically integrated own-inventory quick commerce platform. Serving Noida & Delhi NCR with 10-minute grocery fulfillment.
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
              <li>MFC-01: Noida Sector 18 (Atta Market)</li>
              <li>MFC-04: Noida Sector 62 (Electronic City)</li>
              <li>MFC-07: Noida Sector 137 (Expressway)</li>
              <li>MFC-09: Noida Sector 76 (Central Noida)</li>
              <li>MFC-12: Greater Noida West (Gaur City)</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-sm">Ecosystem Platforms</h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>Customer Web Portal (Next.js 15)</li>
              <li>Customer iOS & Android (Expo React Native)</li>
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
              <li>DPDP Privacy Compliance</li>
              <li>DLT-registered Indian SMS OTP</li>
              <li>Razorpay Verified 256-bit SSL</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 py-4 px-4 text-center text-slate-400 text-[11px]">
          © 2026 FlashDrop Technologies Pvt. Ltd. All rights reserved. Built for Noida / Delhi NCR.
        </div>
      </footer>
    </div>
  );
}
