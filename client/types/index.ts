export type Role = "USER" | "OWNER" | "ADMIN";
export type SubscriptionPlan = "STARTER" | "PRO" | "BUSINESS";
export type PropertyType = "PG" | "ROOM" | "FLAT" | "HOSTEL";
export type GenderPreference = "BOYS" | "GIRLS" | "ANY";
export type ListedByType = "OWNER" | "BROKER" | "MANAGER";
export type FurnishedStatus = "UNFURNISHED" | "SEMI_FURNISHED" | "FULLY_FURNISHED";
export type AvailabilityStatus = "AVAILABLE" | "OCCUPIED" | "UPCOMING";

export interface AuthUser {
  id: number;
  name: string;
  phone?: string | null;
  email: string;
  role: Role;
  token: string;
  subscriptionPlan?: SubscriptionPlan | "";
  subscriptionActive: boolean;
  subscriptionExpiresAt?: string | null;
}

export interface OwnerSummary {
  id: number;
  name: string;
  email: string;
}

export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  securityDeposit?: number | null;
  location: string;
  areaLocality?: string | null;
  city?: string | null;
  district?: string | null;
  state?: string | null;
  category?: string | null;
  sharingType?: string | null;
  furnishedStatus?: FurnishedStatus | null;
  listedByType?: ListedByType | null;
  contactNumber?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  availabilityStatus?: AvailabilityStatus | null;
  availableFromDate?: string | null;
  occupancyDetails?: string | null;
  listingSource?: string | null;
  listingUrl?: string | null;
  type: PropertyType;
  gender: GenderPreference;
  amenities: string[];
  imageUrls: string[];
  owner: OwnerSummary;
  saved: boolean;
  createdAt: string;
  moderationStatus?: string;
  publishedAt?: string;
}

export interface AuthResponse extends AuthUser {}

export interface Enquiry {
  id: number;
  propertyId: number;
  propertyTitle: string;
  userName: string;
  userEmail: string;
  message: string;
  createdAt: string;
}

export interface Lead {
  id: number;
  propertyId: number;
  propertyTitle: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
}

export interface AdminDashboard {
  totalUsers: number;
  totalSubscribers: number;
  totalProperties: number;
  totalEnquiries: number;
}

export interface UserProfile {
  id: number;
  name: string;
  phone?: string | null;
  email: string;
  role: Role;
  isSuperAdmin: boolean;
  subscriptionPlan?: SubscriptionPlan | "";
  subscriptionActive: boolean;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
}

export interface PropertyPayload {
  title: string;
  description: string;
  price: number;
  securityDeposit?: number | null;
  location: string;
  areaLocality?: string;
  city?: string;
  district?: string;
  state?: string;
  category?: string;
  sharingType?: string;
  furnishedStatus?: FurnishedStatus;
  listedByType?: ListedByType;
  contactNumber?: string;
  latitude?: number | null;
  longitude?: number | null;
  availabilityStatus?: AvailabilityStatus;
  availableFromDate?: string;
  occupancyDetails?: string;
  listingSource?: string;
  listingUrl?: string;
  type: PropertyType;
  gender: GenderPreference;
  amenities: string[];
  imageUrls: string[];
}

export interface PropertyFilters {
  location?: string;
  minPrice?: string;
  maxPrice?: string;
  type?: PropertyType | "";
  gender?: GenderPreference | "";
  furnishedStatus?: FurnishedStatus | "";
  sharingType?: string;
  listedByType?: ListedByType | "";
  amenities?: string[];
  sortBy?: "newest" | "price_asc" | "price_desc" | "";
  page?: number;
  size?: number;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  last: boolean;
}

export interface ListingSource {
  id: number;
  sourceName: string;
  sourceDomain: string;
  allowedForIngestion: boolean;
  termsStatus: string;
  notes?: string | null;
}

export interface IngestionRun {
  id: number;
  sourceName: string;
  sourceDomain: string;
  status: string;
  fetchedCount: number;
  parsedCount: number;
  publishedCount: number;
  errorCount: number;
  startedAt: string;
  finishedAt?: string | null;
  notes?: string | null;
}
