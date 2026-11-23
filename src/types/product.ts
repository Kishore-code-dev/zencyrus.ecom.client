import type { DesignFileSchemaType } from "@/config/validate-design-file"
import type { AttachmentOptionItem, DimensionOptionItem, ImageOptionItem, OptionItem, OtherSpecificationPriceOptionItem, QuantityOptionItem } from "./common"

export interface ProductCatlog
{
    id: string
    name: string
    description: string
    productImage: OptionItem
    turnAroundDays: string
    quantity: OptionItem
    price: number
    basePrice: number
    isAvalible: boolean
    isDynamicConfiguration: boolean
}

export interface ProductOptionVisibility
{
    "isGsm": boolean
    "isMedia": boolean
    "isLamination": boolean
    "isPrintingSide": boolean
    "isFoilSide": boolean
    "isSpotUV": boolean
    "isFoilType": boolean
    "isPad": boolean
    "isPouch": boolean
    "isDiecut": boolean
    "isQuantity": boolean
    "isFinishSize": boolean
    "isCoverType": boolean
    "isFileFinishing": boolean
}

export interface ProductDynamicConfiguration
{
    id: string;
    optionType: string
    noOfAttachment: number;
    sizeFormat: 'MM' | 'IN' | 'BOTH'
    name: string;
    price: number;
    helperText: string
    helperLink: string
    productImage: OptionItem
    producType: OptionItem
    classification: OptionItem
    gsm: OptionItem[]
    media: OptionItem[];
    lamination: OptionItem[];
    printingSide: OptionItem[];
    finishSize: DimensionOptionItem[];
    quantity: OptionItem[];
    foilSide: OptionItem[];
    foilType: OptionItem[];
    coverType: OptionItem[];
    pad: OptionItem[];
    dieCut: ImageOptionItem[];
    spotUV: OptionItem[];
    attachments: DesignFileSchemaType[];
    otherSpecifications: OtherSpecificationPriceOptionItem[];
    pouch: OptionItem[]
    description: string
    additionProcessing: OptionItem[]
    fileFinishing: OptionItem[]
    optionVisibility: ProductOptionVisibility
    uploadDimensions: DimensionOptionItem[]
}

export interface ProductConfiguration
{
    product: Product[]
    gsm: OptionItem[]
    media: OptionItem[]
    lamination: OptionItem[]
    printingSide: AttachmentOptionItem[]
    finishSize: DimensionOptionItem[]
    quantity: QuantityOptionItem[]
    foilSide: AttachmentOptionItem[];
    foilType: OptionItem[];
    spotUV: AttachmentOptionItem[];
    coverType: OptionItem[];
    pad: OptionItem[];
    dieCut: ImageOptionItem[];
    pouch: OptionItem[]
    attachments: DesignFileSchemaType[]
    fileFinishing: OptionItem[]
    additionProcessing: OptionItem[]
    uploadDimensions: DimensionOptionItem[]
}

export interface Product
{
    id: string
    description: string
    price: number
    basePrice: number,
    helperText: string
    helperLink: string
    turnAroundDays: string
    minQuantity?: string
    quantity: OptionItem
    shortDescription: string
}