import { z } from "zod";

const strongPassword = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be 72 characters or less.")
  .regex(/[A-Z]/, "Password must include one uppercase letter.")
  .regex(/[a-z]/, "Password must include one lowercase letter.")
  .regex(/[0-9]/, "Password must include one number.")
  .regex(/[^A-Za-z0-9]/, "Password must include one special character.");

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, "Mobile number must be exactly 10 digits and start with 6, 7, 8, or 9.");

export const emailDotComSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.")
  .regex(/\.com$/i, "Email must end with .com.");

export const loginSchema = z.object({
  email: emailDotComSchema,
  password: z.string().min(1, "Password is required.")
});

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name must be at least 2 characters."),
    lastName: z.string().trim().optional(),
    phone: phoneSchema,
    email: emailDotComSchema,
    password: strongPassword,
    confirmPassword: z.string().min(1, "Confirm your password."),
    accountType: z.enum(["OWNER", "SEEKER", "PARTNER"])
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
  });

export const propertySchema = z.object({
  title: z.string().trim().min(5, "Property title must be at least 5 characters."),
  description: z.string().trim().min(20, "Description must be at least 20 characters."),
  price: z.number().positive("Monthly rent must be greater than 0."),
  securityDeposit: z.number().min(0, "Security deposit cannot be negative.").nullable().optional(),
  location: z.string().trim().min(3, "Location is required."),
  city: z.string().trim().min(2, "City is required.").optional().or(z.literal("")),
  district: z.string().trim().min(2, "District is required.").optional().or(z.literal("")),
  state: z.string().trim().min(2, "State is required.").optional().or(z.literal("")),
  contactNumber: phoneSchema.optional().or(z.literal("")),
  amenities: z.array(z.string()).min(1, "Select at least one amenity."),
  imageUrls: z.array(z.string().url("Each image URL must be valid.")).min(1, "Add at least one image URL.")
});

export const enquirySchema = z.object({
  message: z.string().trim().min(10, "Please enter at least 10 characters.").max(500, "Message must be 500 characters or less.")
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Full name must be at least 2 characters."),
  phone: phoneSchema,
  email: emailDotComSchema,
  message: z.string().trim().min(10, "Message must be at least 10 characters.")
});

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message || "Please verify the form details.";
}
