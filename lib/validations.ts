import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("A valid email is required"),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(1, "Message is required").max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email("A valid email is required"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99),
});

export const orderSchema = z.object({
  name: z.string().max(120).optional().or(z.literal("")),
  email: z.string().email("A valid email is required"),
  phone: z.string().max(40).optional().or(z.literal("")),
  address: z.string().max(240).optional().or(z.literal("")),
  city: z.string().max(120).optional().or(z.literal("")),
  postalCode: z.string().max(40).optional().or(z.literal("")),
  note: z.string().max(2000).optional().or(z.literal("")),
  items: z.array(cartItemSchema).min(1, "Your cart is empty"),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type OrderInput = z.infer<typeof orderSchema>;
