import type { DesignFileSchemaType } from "@/config/validate-design-file";
import type { DimensionOptionItem, OptionItem, OtherSpecificationPriceOptionItem } from "./common";

export interface Product
{
  id: string;
  name: string;
  optionType: string;
  noOfQuantity: number
  description: string;
  productImage: OptionItem
  producType: OptionItem
  classification: OptionItem
  gsm: OptionItem
  media: OptionItem
  lamination: OptionItem
  prinitingSide: OptionItem
  finishSize: DimensionOptionItem
  quantity: OptionItem
  turnAroundDays: string;
  price: number;
  otherSpecifications: OtherSpecificationPriceOptionItem[];
  quantityOptions: OptionItem[];
  basePrice: number
  attachments: DesignFileSchemaType[]
  uploadDimensions: DimensionOptionItem
  helperText: string
  helperLink: string
}


export interface ProductDetails
{
  id: string;
  name: string;
  description: string;
  productimageid: OptionItem
  producttypeid: OptionItem
  classificationid: OptionItem
  categoryid: OptionItem
  gsmid: OptionItem
  mediaid: OptionItem
  laminationid: OptionItem
  printingsideid: OptionItem
  finishsizeid: DimensionOptionItem
  quantityid: OptionItem
  // cellcountid: OptionItem
  turnaroundDays: number;
  isattachmentneed: boolean;
  isbackimagerequired: boolean;
  createdby: string;
  createdon: Date;
  updatedby: string;
  updatedon: Date;
  isActive: boolean;
  price: number;
}



export interface ProductVariant
{
  id: string
  name: string
  options: VariantOption[];
}

export interface VariantOption
{
  id: string
  label: string
  priceModifier: number
}

export interface CartItem
{
  id: string
  product: Product;
  quantity: number
  selectedVariants: Record<string, string>;
  designFile?: DesignFile;
  unitPrice: number
  totalPrice: number
}

export interface DesignFile
{
  // id: string
  name: string
  size: number
  type: string
  url: string
  uploadedAt: Date;
  file: File;
}

export interface User
{
  id: string
  email: string
  name: string
  company?: string
  walletBalance: number
}

export interface WalletTransaction
{
  id: string
  userId: string
  amount: number
  type: 'credit' | 'debit';
  description: string
  createdAt: Date;
}

export type OrderStatus = 'pending' | 'processing' | 'printing' | 'quality_check' | 'shipped' | 'delivered';

export interface Order
{
  id: string
  orderNumber: string
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number
  paymentMethod: 'card' | 'wallet';
  shippingAddress: {
    name: string
    company?: string
    address: string
    city: string
    state: string
    zip: string
  };
  createdAt: Date;
  estimatedDelivery: Date;
  trackingNumber?: string
}

export interface OrderItem
{
  productName: string
  quantity: number
  variants: Record<string, string>;
  unitPrice: number
  totalPrice: number
  designFileName?: string
}

export interface CustomizedProduct
{
  id: string;
  productImage: OptionItem
  productType: OptionItem
  classification: OptionItem
  printingSide: OptionItem[]
  finishingSize: DimensionOptionItem[]
  isAttachmentNeed: boolean;
  isbackImageRequired: boolean;
  quantity: OptionItem[];
}