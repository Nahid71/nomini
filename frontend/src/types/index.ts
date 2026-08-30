export type Role = 'CUSTOMER' | 'INVESTOR' | 'SUPPLIER' | 'EMPLOYEE' | 'FARM_OPERATOR' | 'ADMIN';

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'COMPLETED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  department?: string;
  avatarUrl?: string;
  token?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority | string;
  dueDate?: string | null;
  completedAt?: string | null;
  assignedTo: string;
  assignedBy: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    department?: string;
    avatarUrl?: string;
  };
  manager?: {
    id: string;
    fullName: string;
    email: string;
    role: Role;
  };
}

export interface BatchTimelineItem {
  step: number;
  date: string;
  title: string;
  description: string;
  operator: string;
  location: string;
  status: string;
}

export interface SustainabilityMetrics {
  carbonRating?: string;
  netEmissionsKg?: string;
  waterConservation?: string;
  organicCertified?: boolean;
  certificationBody?: string;
  pesticideFree?: string;
  soilHealthIndex?: number;
  solarPoweredProcessing?: string;
  biodiversityScore?: string;
  [key: string]: any;
}

export interface Batch {
  id: string;
  batchNumber: string;
  farmPlot?: string;
  harvestDate: string;
  geoCoordinates?: string;
  labReportUrl?: string;
  sustainability: SustainabilityMetrics;
  timeline: BatchTimelineItem[];
  product?: Product;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  priceUSD: number;
  stockQty: number;
  imageUrl?: string;
  category?: string;
  sku?: string;
  originFarm?: string;
  batchId?: string;
  batch?: {
    id: string;
    batchNumber: string;
    harvestDate: string;
    farmPlot?: string;
    sustainability?: SustainabilityMetrics;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CrowdfarmProject {
  id: string;
  title: string;
  description?: string;
  location?: string;
  targetAmount: number;
  raisedAmount: number;
  sharePrice: number;
  totalShares: number;
  availableShares: number;
  expectedRoi?: string;
  harvestCycle?: string;
  imageUrl?: string;
  _count?: {
    investments: number;
  };
}

export interface InvestmentCertificate {
  serialNumber: string;
  certificateUrl: string;
  sharesBooked: number;
  sharePriceUSD: number;
  totalPaidUSD: number;
  investorName: string;
  investorEmail: string;
  projectName: string;
  expectedRoi?: string;
  issuedAt: string;
}

export interface OrderConfirmation {
  id: string;
  customerName: string;
  customerEmail: string;
  totalUSD: number;
  status: string;
  paymentMethod: string;
  shippingAddress: string;
  createdAt: string;
  items: {
    id: string;
    productTitle: string;
    priceUSD: number;
    quantity: number;
    batchNumber?: string;
    dppUrl?: string;
  }[];
  traceabilityPassports: {
    batchNumber: string;
    productTitle: string;
  }[];
}
