/**
 * Central demo data for Zencyrus E-Commerce free preview.
 * All data is local — no backend API calls required.
 */

import type { ProductCatlog } from "@/types/product";
import type { CmsHeroBanner } from "@/types/cms-hero-banner";
import type { OrdersHistory } from "@/types/order-history";
import type { ProductNavItem } from "@/types/nav-item";
import type { ImageOptionItem } from "@/types/common";

// ============================================================
// PRODUCTS (12 items across all printing categories)
// ============================================================

export const demoProducts: ProductCatlog[] = [
  {
    id: "prod-001",
    name: "Premium Business Cards",
    description: "High-quality 16pt matte business cards with full-color printing on both sides. Perfect for making a lasting first impression.",
    productImage: { label: "/assets/business-cards.jpg", value: "1" },
    turnAroundDays: "2-3 days",
    quantity: { label: "100", value: "100" },
    price: 499,
    basePrice: 799,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-002",
    name: "Deluxe Business Cards",
    description: "Thick 18pt silk-laminated business cards with spot UV finish. Premium feel for premium brands.",
    productImage: { label: "/assets/business-cards.jpg", value: "2" },
    turnAroundDays: "3-4 days",
    quantity: { label: "250", value: "250" },
    price: 899,
    basePrice: 1299,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-003",
    name: "A5 Flyers",
    description: "Glossy A5 flyers in 150gsm paper. Ideal for promotions, events, and product launches.",
    productImage: { label: "/assets/flyers.jpg", value: "3" },
    turnAroundDays: "1-2 days",
    quantity: { label: "500", value: "500" },
    price: 1299,
    basePrice: 1899,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-004",
    name: "Tri-Fold Brochures",
    description: "Professional tri-fold brochures in 100gsm paper with full-color printing. Great for company profiles.",
    productImage: { label: "/assets/brochures.jpg", value: "4" },
    turnAroundDays: "2-3 days",
    quantity: { label: "250", value: "250" },
    price: 1599,
    basePrice: 2299,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-005",
    name: "Vinyl Banners",
    description: "Durable vinyl banners for indoor and outdoor use. Weather-resistant and vibrant colors.",
    productImage: { label: "/assets/banners.jpg", value: "5" },
    turnAroundDays: "3-5 days",
    quantity: { label: "1", value: "1" },
    price: 2499,
    basePrice: 3499,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-006",
    name: "A2 Posters",
    description: "Large format A2 posters in 170gsm matte paper. Perfect for advertising and wall displays.",
    productImage: { label: "/assets/posters.jpg", value: "6" },
    turnAroundDays: "2-3 days",
    quantity: { label: "10", value: "10" },
    price: 399,
    basePrice: 599,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-007",
    name: "Wedding Invitations",
    description: "Elegant wedding invitation cards with custom design and premium paper stock. Make your special day unforgettable.",
    productImage: { label: "/assets/wedding-invitations.jpg", value: "7" },
    turnAroundDays: "5-7 days",
    quantity: { label: "100", value: "100" },
    price: 2999,
    basePrice: 3999,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-008",
    name: "Product Labels",
    description: "Custom product labels in various shapes and sizes. Waterproof adhesive for bottles and packaging.",
    productImage: { label: "/assets/labels.jpg", value: "8" },
    turnAroundDays: "2-3 days",
    quantity: { label: "500", value: "500" },
    price: 799,
    basePrice: 1199,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-009",
    name: "Company Letterheads",
    description: "Professional letterheads with your company logo and branding. Printed on 100gsm bond paper.",
    productImage: { label: "/assets/letterheads.png", value: "9" },
    turnAroundDays: "2-3 days",
    quantity: { label: "250", value: "250" },
    price: 699,
    basePrice: 999,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-010",
    name: "Envelopes",
    description: "Custom printed envelopes to match your letterheads. Available in DL, A4, and custom sizes.",
    productImage: { label: "/assets/envelopes.jpg", value: "10" },
    turnAroundDays: "2-3 days",
    quantity: { label: "500", value: "500" },
    price: 899,
    basePrice: 1299,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-011",
    name: "Booklets",
    description: "Saddle-stitched booklets for catalogs, manuals, and magazines. Multiple page counts available.",
    productImage: { label: "/assets/booklets.jpg", value: "11" },
    turnAroundDays: "4-6 days",
    quantity: { label: "50", value: "50" },
    price: 1899,
    basePrice: 2699,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
  {
    id: "prod-012",
    name: "Calendars",
    description: "Wall calendars with your brand imagery. 12-month calendar with custom photos for each month.",
    productImage: { label: "/assets/calendar-mounts.jpg", value: "12" },
    turnAroundDays: "5-7 days",
    quantity: { label: "25", value: "25" },
    price: 599,
    basePrice: 899,
    isAvalible: true,
    isDynamicConfiguration: false,
  },
];

export const demoCategories = [
  { id: "all", name: "All Products", icon: "Grid3X3" },
  { id: "Cards & Stationery", name: "Cards & Stationery", icon: "CreditCard" },
  { id: "Marketing Materials", name: "Marketing Materials", icon: "Megaphone" },
  { id: "Large Format", name: "Large Format", icon: "Maximize" },
  { id: "Publications", name: "Publications", icon: "BookOpen" },
  { id: "Packaging", name: "Packaging", icon: "Package" },
];

// ============================================================
// HERO BANNERS (CMS slider data)
// ============================================================

export const demoHeroBanners: CmsHeroBanner[] = [
  {
    id: "hero-001",
    title: "Premium Business Cards",
    description: "High-quality offset printing with fast turnaround. Starting at Rs 499.",
    imageUrl: "/assets/business-cards.jpg",
    badge: "New Arrival",
    textColorLight: "#FFFFFF",
    textColorDark: "#FFFFFF",
    backgroundColorLight: "#1a1a1a",
    backgroundColorDark: "#000000",
    cta: "Shop Now",
    badgeText: "Limited Offer",
    badgeNavigationUrl: "/catalog",
  },
  {
    id: "hero-002",
    title: "Vinyl Banners & Posters",
    description: "Durable indoor and outdoor banners. Weather-resistant and vibrant.",
    imageUrl: "/assets/banners.jpg",
    badge: "Best Seller",
    textColorLight: "#FFFFFF",
    textColorDark: "#FFFFFF",
    backgroundColorLight: "#1a1a1a",
    backgroundColorDark: "#000000",
    cta: "View All",
    badgeText: "",
    badgeNavigationUrl: "",
  },
  {
    id: "hero-003",
    title: "Wedding Invitations",
    description: "Elegant custom wedding cards with premium paper stock.",
    imageUrl: "/assets/wedding-invitations.jpg",
    badge: "Popular",
    textColorLight: "#FFFFFF",
    textColorDark: "#FFFFFF",
    backgroundColorLight: "#1a1a1a",
    backgroundColorDark: "#000000",
    cta: "Shop Now",
    badgeText: "",
    badgeNavigationUrl: "",
  },
  {
    id: "hero-004",
    title: "A5 Flyers & Brochures",
    description: "Glossy marketing materials for events and product launches.",
    imageUrl: "/assets/flyers.jpg",
    badge: "Trending",
    textColorLight: "#FFFFFF",
    textColorDark: "#FFFFFF",
    backgroundColorLight: "#1a1a1a",
    backgroundColorDark: "#000000",
    cta: "Browse Catalog",
    badgeText: "",
    badgeNavigationUrl: "",
  },
];

// ============================================================
// NAVIGATION ITEMS (Product categories menu)
// ============================================================

export const demoNavItems: ProductNavItem[] = [
  {
    id: "nav-001",
    name: "Business Cards",
    isShown: true,
    subNavItem: [
      {
        classification: { label: "Standard", value: "standard" },
        menus: [
          {
            alias: "Premium Business Card",
            isShown: true,
            isNewArrival: true,
            isDynamicConfiguration: false,
            productId: "prod-001",
            products: [
              { label: "Matte Finish", value: "prod-001-q1", quantityId: "q1", isShown: true },
              { label: "Glossy Finish", value: "prod-001-q2", quantityId: "q2", isShown: true },
            ],
          },
          {
            alias: "Deluxe Business Card",
            isShown: true,
            isNewArrival: false,
            isDynamicConfiguration: false,
            productId: "prod-002",
            products: [
              { label: "Thick Cardstock", value: "prod-002-q1", quantityId: "q3", isShown: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "nav-002",
    name: "Flyers & Brochures",
    isShown: true,
    subNavItem: [
      {
        classification: { label: "Flyers", value: "flyers" },
        menus: [
          {
            alias: "A5 Flyer",
            isShown: true,
            isNewArrival: true,
            isDynamicConfiguration: false,
            productId: "prod-003",
            products: [
              { label: "100 GSM", value: "prod-003-q1", quantityId: "q4", isShown: true },
              { label: "150 GSM", value: "prod-003-q2", quantityId: "q5", isShown: true },
            ],
          },
        ],
      },
      {
        classification: { label: "Brochures", value: "brochures" },
        menus: [
          {
            alias: "Tri-Fold Brochure",
            isShown: true,
            isNewArrival: false,
            isDynamicConfiguration: false,
            productId: "prod-004",
            products: [
              { label: "A4 Size", value: "prod-004-q1", quantityId: "q6", isShown: true },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "nav-003",
    name: "Banners & Posters",
    isShown: true,
    subNavItem: [
      {
        classification: { label: "Banners", value: "banners" },
        menus: [
          {
            alias: "Vinyl Banner",
            isShown: true,
            isNewArrival: false,
            isDynamicConfiguration: false,
            productId: "prod-005",
            products: [
              { label: "2x4 ft", value: "prod-005-q1", quantityId: "q7", isShown: true },
              { label: "4x8 ft", value: "prod-005-q2", quantityId: "q8", isShown: true },
            ],
          },
        ],
      },
    ],
  },
];

// ============================================================
// CATEGORY GRID ITEMS (Product type cards)
// ============================================================

export const demoCategoryGridItems: ImageOptionItem[] = [
  { label: "/assets/business-cards.jpg", description: "Business Cards", value: "business-cards" },
  { label: "/assets/flyers.jpg", description: "Flyers", value: "flyers" },
  { label: "/assets/brochures.jpg", description: "Brochures", value: "brochures" },
  { label: "/assets/banners.jpg", description: "Banners", value: "banners" },
  { label: "/assets/posters.jpg", description: "Posters", value: "posters" },
  { label: "/assets/wedding-invitations.jpg", description: "Invitations", value: "invitations" },
  { label: "/assets/labels.jpg", description: "Labels", value: "labels" },
  { label: "/assets/letterheads.png", description: "Letterheads", value: "letterheads" },
];

// ============================================================
// DEMO ORDERS (matches OrdersHistory type exactly)
// ============================================================

export const demoOrders: OrdersHistory[] = [
  {
    id: 1,
    orderReferenceNumber: "ORD-2024-001",
    orderDate: new Date("2024-11-20"),
    totalItems: 2,
    totalAmount: 1398,
    subTotalAmount: 1348,
    shippingAmount: 50,
    refundAmount: 0,
    status: "delivered",
    addressReferenceName: "Demo User",
    addressLine1: "123 Printing Street",
    addressLine2: "Coimbatore",
    mobileNo: "+91 9876543210",
    country: "India",
    state: "Tamil Nadu",
    district: "Coimbatore",
    city: "Coimbatore",
    pinCode: "641001",
    trackingNumber: "TRK123456789",
    shippingProvider: "Blue Dart",
    trackingUrl: "https://track.example.com/TRK123456789",
    isCustomJob: 0,
    customJobId: null,
    isPaymentSucceeded: "true",
  },
  {
    id: 2,
    orderReferenceNumber: "ORD-2024-002",
    orderDate: new Date("2024-11-15"),
    totalItems: 1,
    totalAmount: 2499,
    subTotalAmount: 2399,
    shippingAmount: 100,
    refundAmount: 0,
    status: "shipped",
    addressReferenceName: "Demo User",
    addressLine1: "456 Print Avenue",
    addressLine2: "Gandhipuram",
    mobileNo: "+91 9876543210",
    country: "India",
    state: "Tamil Nadu",
    district: "Coimbatore",
    city: "Coimbatore",
    pinCode: "641002",
    trackingNumber: "TRK987654321",
    shippingProvider: "Delhivery",
    trackingUrl: "https://track.example.com/TRK987654321",
    isCustomJob: 0,
    customJobId: null,
    isPaymentSucceeded: "true",
  },
  {
    id: 3,
    orderReferenceNumber: "ORD-2024-003",
    orderDate: new Date("2024-11-10"),
    totalItems: 3,
    totalAmount: 4197,
    subTotalAmount: 4122,
    shippingAmount: 75,
    refundAmount: 0,
    status: "processing",
    addressReferenceName: "Demo User",
    addressLine1: "789 Press Road",
    addressLine2: "RS Puram",
    mobileNo: "+91 9876543210",
    country: "India",
    state: "Tamil Nadu",
    district: "Coimbatore",
    city: "Coimbatore",
    pinCode: "641002",
    trackingNumber: "",
    shippingProvider: "",
    trackingUrl: "",
    isCustomJob: 0,
    customJobId: null,
    isPaymentSucceeded: "true",
  },
  {
    id: 4,
    orderReferenceNumber: "ORD-2024-004",
    orderDate: new Date("2024-11-05"),
    totalItems: 1,
    totalAmount: 499,
    subTotalAmount: 449,
    shippingAmount: 50,
    refundAmount: 0,
    status: "quality_check",
    addressReferenceName: "Demo User",
    addressLine1: "321 Offset Lane",
    addressLine2: "Saibaba Colony",
    mobileNo: "+91 9876543210",
    country: "India",
    state: "Tamil Nadu",
    district: "Coimbatore",
    city: "Coimbatore",
    pinCode: "641011",
    trackingNumber: "",
    shippingProvider: "",
    trackingUrl: "",
    isCustomJob: 0,
    customJobId: null,
    isPaymentSucceeded: "true",
  },
  {
    id: 5,
    orderReferenceNumber: "ORD-2024-005",
    orderDate: new Date("2024-11-01"),
    totalItems: 2,
    totalAmount: 1798,
    subTotalAmount: 1698,
    shippingAmount: 100,
    refundAmount: 0,
    status: "pending",
    addressReferenceName: "Demo User",
    addressLine1: "654 Digital Street",
    addressLine2: "Peelamedu",
    mobileNo: "+91 9876543210",
    country: "India",
    state: "Tamil Nadu",
    district: "Coimbatore",
    city: "Coimbatore",
    pinCode: "641004",
    trackingNumber: "",
    shippingProvider: "",
    trackingUrl: "",
    isCustomJob: 0,
    customJobId: null,
    isPaymentSucceeded: "true",
  },
];

// ============================================================
// WALLET DATA
// ============================================================

export const demoWalletTransactions = [
  {
    id: "wt-001",
    amount: 5000,
    type: "credit" as const,
    description: "Wallet top-up via UPI",
    createdAt: new Date("2024-11-20"),
  },
  {
    id: "wt-002",
    amount: 1398,
    type: "debit" as const,
    description: "Order ORD-2024-001 - Business Cards",
    createdAt: new Date("2024-11-20"),
  },
  {
    id: "wt-003",
    amount: 3000,
    type: "credit" as const,
    description: "Wallet top-up via Card",
    createdAt: new Date("2024-11-18"),
  },
  {
    id: "wt-004",
    amount: 2499,
    type: "debit" as const,
    description: "Order ORD-2024-002 - Vinyl Banner",
    createdAt: new Date("2024-11-15"),
  },
  {
    id: "wt-005",
    amount: 2000,
    type: "credit" as const,
    description: "Wallet top-up via Net Banking",
    createdAt: new Date("2024-11-12"),
  },
];

export const demoWalletBalance = 4103;

// ============================================================
// DEMO USER PROFILE
// ============================================================

export const demoUserProfile = {
  id: "user-001",
  name: "Demo User",
  email: "demo@shreemaruthi.com",
  company: "Demo Printing Co",
  walletBalance: 4103,
  avatar: "",
  createdAt: new Date("2024-01-15"),
  address: {
    name: "Demo User",
    company: "Demo Printing Co",
    address: "123 Printing Street",
    city: "Coimbatore",
    state: "Tamil Nadu",
    zip: "641001",
  },
};
