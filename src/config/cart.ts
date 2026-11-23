import type { OptionItem } from "@/types/common";
import z from "zod";
import { designFileSchema } from "./validate-design-file";

export const addToCartSchema = z
    .object({
        customerId: z.string().optional(),
        productId: z.string().nonempty("Product ID is required"),
        quantityId: z.string().nonempty("Quantity is required"),
        instruction: z.string(),
        otherSpecification: z.array(z.string()),
        attachments: z.array(designFileSchema),
        imageUrl: z.string().optional(),
        noOfUnits: z.coerce.number<number>(),
    })
    .superRefine((payload, ctx) => {
        const { attachments } = payload;

        if (attachments.length <= 1) return;

        const [first, ...rest] = attachments;
        const messages = new Set<string>();

        rest.forEach((attachment) => {
            if (attachment.cellCount !== first.cellCount) {
                messages.add("Cell count must be the same for all attachments");
            }

            if (attachment.documentHeightInMM !== first.documentHeightInMM) {
                messages.add(
                    "Document height (mm) must be the same for all attachments",
                );
            }

            if (attachment.documentWidthInMM !== first.documentWidthInMM) {
                messages.add(
                    "Document width (mm) must be the same for all attachments",
                );
            }
        });

        if (messages.size > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: Array.from(messages).join("|"),
                path: ["attachments"],
            });
        }
    });

const optionVisibilitySchema = z.object({
    isGsm: z.coerce.boolean<boolean>(),
    isMedia: z.coerce.boolean<boolean>(),
    isLamination: z.coerce.boolean<boolean>(),
    isPrintingSide: z.coerce.boolean<boolean>(),
    isFoilSide: z.coerce.boolean<boolean>(),
    isSpotUV: z.coerce.boolean<boolean>(),
    isFoilType: z.coerce.boolean<boolean>(),
    isPad: z.coerce.boolean<boolean>(),
    isPouch: z.coerce.boolean<boolean>(),
    isDiecut: z.coerce.boolean<boolean>(),
    isQuantity: z.coerce.boolean<boolean>(),
    isFinishSize: z.coerce.boolean<boolean>(),
    isCoverType: z.coerce.boolean<boolean>(),
    isFileFinishing: z.coerce.boolean<boolean>(),
});

export const addToProductDynamicConfigurationSchema = z
    .object({
        customerId: z.string().optional(),
        productId: z.string().nonempty("Product is required"),
        mediaId: z.string().optional(),
        gsmId: z.string().optional(), // ← make all visibility-gated fields optional at base level
        laminationId: z.string().optional(),
        printingSideId: z.string().optional(), // ← dynamic validation takes over
        finishSizeId: z.string().optional(),
        quantityId: z.string().optional(),
        spotUVId: z.string().optional(),
        foilTypeId: z.string().optional(),
        foilSideId: z.string().optional(),
        coverTypeId: z.string().optional(),
        pouchId: z.string().optional(),
        padId: z.string().optional(),
        dieCutId: z.string().optional(),
        fileFinishingId: z.string().optional(),
        productQuantityId: z.string().nonempty("Quantity is required"),
        instruction: z.string(),
        otherSpecification: z.array(z.string()),
        productUploadFileDimensionsId: z.string().optional(),
        attachments: z.array(designFileSchema),
        optionVisibility: optionVisibilitySchema,
    })
    .superRefine((data, ctx) => {
        const { optionVisibility: v } = data;

        // Map: [visibilityFlag, fieldKey, errorMessage]
        const visibilityRules: [boolean, keyof typeof data, string][] = [
            [v.isGsm, "gsmId", "GSM is required"],
            [v.isMedia, "mediaId", "Media is required"],
            [v.isLamination, "laminationId", "Lamination is required"],
            [v.isPrintingSide, "printingSideId", "Printing side is required"],
            [v.isFoilSide, "foilSideId", "Foil side is required"],
            [v.isSpotUV, "spotUVId", "Spot UV is required"],
            [v.isFoilType, "foilTypeId", "Foil type is required"],
            [v.isPad, "padId", "Pad is required"],
            [v.isPouch, "pouchId", "Pouch is required"],
            [v.isDiecut, "dieCutId", "Die cut is required"],
            [v.isQuantity, "quantityId", "Quantity is required"],
            [v.isFinishSize, "finishSizeId", "Finish size is required"],
            [v.isCoverType, "coverTypeId", "Cover type is required"],
        ];

        for (const [isVisible, field, message] of visibilityRules) {
            if (isVisible && !data[field]) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message,
                    path: [field],
                });
            }
        }
    })
    .superRefine((payload, ctx) => {
        const { attachments } = payload;

        if (attachments.length <= 1) return;

        const [first, ...rest] = attachments;
        const messages = new Set<string>();

        rest.forEach((attachment) => {
            if (attachment.cellCount !== first.cellCount) {
                messages.add("Cell count must be the same for all attachments");
            }

            if (attachment.documentHeightInMM !== first.documentHeightInMM) {
                messages.add(
                    "Document height (mm) must be the same for all attachments",
                );
            }

            if (attachment.documentWidthInMM !== first.documentWidthInMM) {
                messages.add(
                    "Document width (mm) must be the same for all attachments",
                );
            }
        });

        if (messages.size > 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: Array.from(messages).join("|"),
                path: ["attachments"],
            });
        }
    });

export const printingOptionItems: OptionItem[] = [
    {
        label: "Single Side(Front Only)",
        value: "f7ba2a38-0191 - ab37 - c57d - c65e0d95c45c",
    },
    {
        label: "Double Side(Front & Back)",
        value: "f4d52b0d - a4fa - 4dbb - b855 - c215ac55e509",
    },
    {
        label: "No Printing ",
        value: "426dd7ed - 4cf8 - 4d63 - da5e - a641e9cca771",
    },
];
