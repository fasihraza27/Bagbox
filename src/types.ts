export type ProductCategory = 
  | 'all'
  | 'delivery-boxes'
  | 'thermal-bags'
  | 'rider-gear'
  | 'custom-packaging'
  | 'vehicle-branding';

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  category: ProductCategory;
  shortDesc: string;
  shortDescAr: string;
  fullDesc: string;
  priceSAR: number;
  moq: number; // Minimum order quantity
  rating: number;
  reviewsCount: number;
  image: string;
  tags: string[];
  specs: {
    material: string;
    dimensions: string;
    capacity?: string;
    weight?: string;
    weatherResistance?: string;
    warranty?: string;
  };
  features: string[];
  isPopular?: boolean;
  is3DSupported?: boolean;
  modelType?: 'fiberglass-box' | 'thermal-bag' | 'rigid-box' | 'mailer-box';
}

export interface QuoteRequest {
  id: string;
  createdAt: string;
  clientName: string;
  companyName: string;
  phone: string;
  email: string;
  city: 'Riyadh' | 'Jeddah' | 'Dammam' | 'Khobar' | 'Mecca' | 'Medina' | 'Other';
  productId: string;
  productName: string;
  quantity: number;
  customBranding: boolean;
  notes?: string;
  estimatedTotalSAR: number;
  status: 'Pending' | 'Reviewing' | 'Quoted' | 'In Production' | 'Dispatched' | 'Delivered';
  config3D?: BoxConfig3D;
}

export interface BoxConfig3D {
  modelType: 'fiberglass-box' | 'thermal-bag' | 'rigid-box' | 'mailer-box';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  materialFinish: 'gloss' | 'matte' | 'fiberglass' | 'carbon';
  hasLEDLight: boolean;
  ledColor: string;
  hasLock: boolean;
  hasShelves: boolean;
  shelfCount: number;
  customText: string;
  openLid: boolean;
  explodedView: boolean;
}

export interface TrackingStep {
  title: string;
  date: string;
  completed: boolean;
  current: boolean;
  location: string;
}

export interface OrderTrackResult {
  trackingNumber: string;
  clientName: string;
  company: string;
  item: string;
  quantity: number;
  destination: string;
  status: 'Order Placed' | 'Engineering & Mold' | 'Branding & Assembly' | 'QC Inspection' | 'In Transit' | 'Delivered';
  carrier: 'SMSA Express' | 'Naqel' | 'BagBox Dedicated Fleet';
  estimatedDelivery: string;
  steps: TrackingStep[];
}
