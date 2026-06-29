import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(200)
});

export const heroSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  backgroundImageUrl: z.string().optional().nullable(),
  buttonText: z.string().min(1),
  buttonLink: z.string().min(1)
});

export const logoSchema = z.object({
  imageUrl: z.string().optional().nullable(),
  logoText: z.string().min(1),
  brandName: z.string().min(1)
});

export const contactSchema = z.object({
  phone1: z.string().min(1),
  phone2: z.string().min(1),
  phone3: z.string().min(1),
  whatsapp: z.string().min(1),
  email: z.string().email(),
  address: z.string().min(1),
  websiteUrl: z.string().min(1),
  facebookUrl: z.string().optional().nullable(),
  instagramUrl: z.string().optional().nullable(),
  tiktokUrl: z.string().optional().nullable(),
  googleMapsEmbedUrl: z.string().optional().nullable()
});

export const vehicleSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  priceLahore: z.string().min(1),
  priceOutside: z.string().min(1),
  weeklyPrice: z.string().min(1),
  monthlyPrice: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  description: z.string().optional().nullable(),
  features: z.string().optional().nullable(),
  active: z.boolean(),
  sortOrder: z.number().int().default(0)
});

export const bookingSchema = z.object({
  vehicleId: z.string().uuid().optional().nullable(),
  vehicleName: z.string().min(1),
  fullName: z.string().min(1),
  phone: z.string().min(1),
  pickupDate: z.string().min(1),
  returnDate: z.string().min(1),
  pickupLocation: z.string().min(1),
  message: z.string().optional().nullable(),
  totalEstimate: z.number().int().min(0)
});

export const statusSchema = z.object({
  status: z.enum(["New", "Contacted", "Confirmed", "Cancelled"])
});
