export const PAGE_IDS = [
  "global",
  "home",
  "shop",
  "gallery",
  "courses",
  "contact",
] as const;

export type PageId = (typeof PAGE_IDS)[number];

export const PAGE_CONTENT_DEFAULTS: Record<PageId, Record<string, string>> = {
  global: {
    "site.name": "Barn Owl Pottery",
    "site.tagline": "Handmade ceramics by Kim Swanson",
    "site.email": "barnowlpottery@gmail.com",
    "site.story":
      "Barn Owl Pottery is Kim Swanson's small studio in Olympia, WA. Every piece is hand-thrown or hand-built, glazed with care, and fired to bring out deep teals, earthy greens, and warm earthy tones. From everyday bowls to seasonal ornaments, each piece carries the marks of the hands that made it.",
    "header.nameLine1": "Barn Owl",
    "header.nameLine2": "Pottery",
    "nav.gallery": "Gallery",
    "nav.shop": "Shop",
    "nav.classes": "Classes",
    "nav.contact": "Contact",
    "footer.byline": "by Kim Swanson",
    "footer.exploreLabel": "Explore",
    "footer.connectLabel": "Connect",
    "footer.facebook": "Facebook",
    "footer.emailLink": "Email",
    "footer.copyright": "Barn Owl Pottery · Kim Swanson · Olympia, WA",
  },
  home: {
    "hero.location": "Olympia, WA",
    "hero.titleLine1": "Barn Owl",
    "hero.titleLine2": "Pottery",
    "hero.description":
      "Hand-thrown bowls, hand-built dishes, and seasonal pieces by Kim Swanson. Each piece is glazed and fired in the studio.",
    "hero.ctaShop": "Shop Pieces",
    "hero.ctaGallery": "View Gallery",
    "hero.image": "/images/bowl-collection.png",
    "hero.imageAlt": "Hand-thrown pottery bowls by Barn Owl Pottery",
    "featured.label": "Available Work",
    "featured.heading": "Pieces from the studio",
    "featured.link": "View all →",
    "banner.label": "Each piece is one of a kind",
    "banner.heading": "Made by hand. Finished by fire.",
    "banner.cta": "Inquire About a Piece",
    "banner.image": "/images/teal-spiral-bowl.png",
    "banner.imageAlt": "Teal spiral bowl by Barn Owl Pottery",
    "gallery.label": "Gallery",
    "gallery.heading": "From the studio",
    "gallery.link": "Full gallery →",
    "about.label": "About",
    "about.heading": "Kim Swanson",
    "about.logo": "/images/barn-owl-logo.png",
    "about.logoAlt": "Barn Owl Pottery logo",
    "contact.heading": "Get in touch",
    "contact.description":
      "Questions about a piece, interest in a class, or a custom order? Send a message and Kim will reply directly.",
    "contact.cta": "Contact Kim",
    "contact.emailCta": "Email directly",
  },
  shop: {
    "intro.label": "Shop",
    "intro.heading": "Available pieces",
    "intro.description":
      'Each piece is handmade and one of a kind. Use "Inquire to Purchase" to reach Kim directly — she\'ll confirm availability and arrange payment.',
  },
  gallery: {
    "intro.label": "Gallery",
    "intro.heading": "Work from the studio",
    "intro.description":
      "Bowls, dishes, seasonal pieces, and craft fair highlights. All work by Kim Swanson.",
    "cta.heading": "Like what you see?",
    "cta.description": "Inquire about availability, commissions, or upcoming classes.",
    "cta.button": "Contact Kim",
  },
  courses: {
    "intro.label": "Classes",
    "intro.heading": "Learn pottery with Kim",
    "intro.description":
      "Small-group classes and workshops in the studio. Send a message for current schedule, pricing, and availability.",
  },
  contact: {
    "intro.label": "Contact",
    "intro.heading": "Get in touch",
    "intro.descriptionPrefix":
      "Interested in a piece, a class, or a custom order? Send a message and Kim will reply to",
    "intro.descriptionSuffix": ".",
    "footerNote": "Prefer to email directly?",
  },
};

export const PUBLIC_PATHS: Record<PageId, string> = {
  global: "/",
  home: "/",
  shop: "/shop",
  gallery: "/gallery",
  courses: "/courses",
  contact: "/contact",
};
