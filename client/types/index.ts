export type Role = "USER" | "OWNER" | "ADMIN";
export type PropertyType = "PG" | "ROOM" | "FLAT" | "HOSTEL";
export type GenderPreference = "BOYS" | "GIRLS" | "ANY";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  token: string;
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
  location: string;
  type: PropertyType;
  gender: GenderPreference;
  amenities: string[];
  imageUrls: string[];
  owner: OwnerSummary;
  saved: boolean;
  createdAt: string;
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

export interface AdminDashboard {
  totalUsers: number;
  totalOwners: number;
  totalProperties: number;
  totalEnquiries: number;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface PropertyPayload {
  title: string;
  description: string;
  price: number;
  location: string;
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
  amenities?: string[];
}
