import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SEED_CATEGORIES = [
  { id: 'cat-dairy', name: 'Dairy, Bread & Eggs', slug: 'dairy-bread-eggs', icon: '🥛', displayOrder: 1 },
  { id: 'cat-produce', name: 'Fresh Fruits & Vegetables', slug: 'fresh-produce', icon: '🥬', displayOrder: 2 },
  { id: 'cat-munchies', name: 'Munchies & Chips', slug: 'munchies-chips', icon: '🍿', displayOrder: 3 },
  { id: 'cat-drinks', name: 'Cold Drinks & Juices', slug: 'cold-drinks-juices', icon: '🥤', displayOrder: 4 },
  { id: 'cat-instant', name: 'Instant Food & Noodles', slug: 'instant-food', icon: '🍜', displayOrder: 5 },
  { id: 'cat-staples', name: 'Atta, Rice & Dals', slug: 'atta-rice-dals', icon: '🌾', displayOrder: 6 },
  { id: 'cat-sweets', name: 'Ice Creams & Sweets', slug: 'ice-creams-sweets', icon: '🍦', displayOrder: 7 },
];

const SEED_PRODUCTS = [
  {
    id: 'prod-1',
    sku: 'AMUL-TAAZA-500ML',
    barcode: '8901262010053',
    name: 'Amul Taaza Homogenised Toned Milk',
    categorySlug: 'dairy-bread-eggs',
    packSize: '500 ml pouch',
    mrpPaise: 2800,
    sellingPricePaise: 2700,
    discountPercent: 4,
    taxRatePercent: 5.0,
    hsnCode: '0401',
    weightGrams: 515,
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&auto=format&fit=crop&q=60',
    availableQuantity: 45,
  },
  {
    id: 'prod-2',
    sku: 'MANDI-TOMATO-HYB-1KG',
    barcode: '8908001001012',
    name: 'Fresh Farm Red Tomatoes (Hybrid)',
    categorySlug: 'fresh-produce',
    packSize: '1 kg pack',
    mrpPaise: 5000,
    sellingPricePaise: 3600,
    discountPercent: 28,
    taxRatePercent: 0.0,
    hsnCode: '0702',
    weightGrams: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=60',
    availableQuantity: 80,
  },
  {
    id: 'prod-3',
    sku: 'LAYS-MAGIC-MASALA-48G',
    barcode: '8901491101836',
    name: "Lay's India's Magic Masala Potato Chips",
    categorySlug: 'munchies-chips',
    packSize: '48 g pouch',
    mrpPaise: 2000,
    sellingPricePaise: 2000,
    discountPercent: 0,
    taxRatePercent: 12.0,
    hsnCode: '2005',
    weightGrams: 55,
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60',
    availableQuantity: 120,
  },
  {
    id: 'prod-4',
    sku: 'COCA-COLA-ZERO-300ML',
    barcode: '8901764012224',
    name: 'Coca-Cola Zero Sugar Refreshing Can',
    categorySlug: 'cold-drinks-juices',
    packSize: '300 ml can',
    mrpPaise: 4000,
    sellingPricePaise: 3800,
    discountPercent: 5,
    taxRatePercent: 28.0,
    hsnCode: '2202',
    weightGrams: 330,
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&auto=format&fit=crop&q=60',
    availableQuantity: 65,
  },
  {
    id: 'prod-5',
    sku: 'MAGGI-2MIN-NOODLES-4P',
    barcode: '8901058852391',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    categorySlug: 'instant-food',
    packSize: '4 x 70 g pack',
    mrpPaise: 6000,
    sellingPricePaise: 5400,
    discountPercent: 10,
    taxRatePercent: 18.0,
    hsnCode: '1902',
    weightGrams: 280,
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60',
    availableQuantity: 90,
  },
  {
    id: 'prod-6',
    sku: 'AASHIRVAAD-ATTA-5KG',
    barcode: '8901725121111',
    name: 'Aashirvaad Superior MP Shudh Chakki Atta',
    categorySlug: 'atta-rice-dals',
    packSize: '5 kg bag',
    mrpPaise: 29500,
    sellingPricePaise: 25400,
    discountPercent: 14,
    taxRatePercent: 5.0,
    hsnCode: '1101',
    weightGrams: 5050,
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60',
    availableQuantity: 30,
  },
];

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async listCategories() {
    return SEED_CATEGORIES;
  }

  async listProducts(categorySlug?: string, query?: string) {
    return SEED_PRODUCTS.filter((p) => {
      const matchCat = !categorySlug || categorySlug === 'all' || p.categorySlug === categorySlug;
      const matchQuery = !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase());
      return matchCat && matchQuery;
    });
  }

  async getProductById(id: string) {
    return SEED_PRODUCTS.find((p) => p.id === id || p.sku === id) || null;
  }
}
