import type { Product, ProductCatlog } from "@/types/product";
import { event } from "./gtag";
import type { CartItem } from "@/types/cart";
import type { CheckoutProduct } from "@/types/checkout";

export const viewItem = (product: ProductCatlog) =>
{
    event("view_item", {
        currency: "INR",
        value: product.price,
        items: [
            {
                item_id: product.id,
                item_name: product.name,
                item_category: product.description,
                price: product.price,
            },
        ],
    });
};

export const addToCart = (product: Product) =>
{
    event("add_to_cart", {
        currency: "INR",
        value: product.price,

        items: [
            {
                item_id: product.id,
                item_name: product.description,
                quantity: product.minQuantity,
                price: product.price,
            },
        ],
    });
};


export const removeFromCart = (product: CartItem) =>
{
    event("remove_from_cart", {
        currency: "INR",

        value: product.price,

        items: [
            {
                item_id: product.id,
                item_name: product.productDescription,
                quantity: product.quantity,
                price: product.price,
            },
        ],
    });
};


export const viewCart = (items: CheckoutProduct[], total: number) =>
{
    event("view_cart", {
        currency: "INR",
        value: total,

        items: items.map((i) => ({
            item_id: i.id,
            item_name: i.product,
            quantity: i.quantity,
            price: i.productPrice,
        })),
    });
};


export const purchase = (items: CheckoutProduct[], total: number, shipping: number = 0) =>
{
    event("purchase", {
        affiliation: "Shree Maruthi Printers",

        value: total,

        currency: "INR",


        shipping: shipping,
        items: items.map((item) => ({
            item_id: item.id,
            item_name: item.product,
            price: item.productPrice + item.otherSpecificationPrice,
            quantity: item.quantity,
        })),
    });
};