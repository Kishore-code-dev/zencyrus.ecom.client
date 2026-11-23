import z from "zod";

export const createWishlistSchema = z.object({
  productId: z.string().nonempty("Product is required"),
  quantityId: z.string().nonempty("Quantity is required")
});