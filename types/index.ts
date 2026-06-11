export type Product = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  featured?: boolean;
  images: string[];
};

export type GalleryImage = {
  id?: string;
  src: string;
  alt: string;
  order?: number;
};

export type CourseModule = {
  title: string;
  lessons: string[];
};

export type Course = {
  id?: string;
  slug: string;
  title: string;
  description: string;
  duration: string;
  skillLevel: string;
  priceNote: string;
  modules: CourseModule[];
};

export type SiteInfo = {
  name: string;
  tagline: string;
  email: string;
  story: string;
};

export type InquiryType = "general" | "purchase" | "class";
