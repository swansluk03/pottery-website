import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  type: z.enum(["general", "purchase", "class"]),
  subject: z.string().optional(),
  message: z.string().min(10, "Please write at least a few sentences"),
});

export const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1).optional(),
  description: z.string().min(1, "Description is required"),
  price: z.number().int().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  available: z.boolean(),
  featured: z.boolean().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export const galleryImageSchema = z.object({
  src: z.string().min(1, "Image URL is required"),
  alt: z.string().min(1, "Alt text is required"),
  order: z.number().int().optional(),
});

export const courseModuleSchema = z.object({
  title: z.string().min(1, "Module title is required"),
  lessons: z.array(z.string()),
});

export const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1).optional(),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  skillLevel: z.string().min(1, "Skill level is required"),
  priceNote: z.string().min(1, "Price note is required"),
  modules: z.array(courseModuleSchema).min(1, "At least one module is required"),
});

export const siteSettingsSchema = z.object({
  name: z.string().min(1, "Site name is required"),
  tagline: z.string().min(1, "Tagline is required"),
  email: z.string().email("Valid email required"),
  story: z.string().min(1, "Story is required"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type ProductFormData = z.infer<typeof productSchema>;
export type GalleryImageFormData = z.infer<typeof galleryImageSchema>;
export type CourseFormData = z.infer<typeof courseSchema>;
export type SiteSettingsFormData = z.infer<typeof siteSettingsSchema>;

export const pageContentUpdateSchema = z.object({
  page: z.string().min(1, "Page is required"),
  blocks: z.record(z.string(), z.string()),
});

export const pageContentBatchSchema = z.object({
  updates: z.array(pageContentUpdateSchema).min(1, "At least one update is required"),
});

export type PageContentBatchData = z.infer<typeof pageContentBatchSchema>;
