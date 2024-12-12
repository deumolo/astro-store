import type { CartItem } from "@/interfaces/cart-item";
import Cookies from "js-cookie";

export class CartCookiesClient {
    static getCart(): CartItem[] {
        const cart = JSON.parse(Cookies.get("cart") || "[]");
        return cart;
    }
    static addItem(cartItem: CartItem) {
        const cart = CartCookiesClient.getCart();
        const itemInCart = cart.find(item => item.productId === cartItem.productId && item.size === cartItem.size);

        if (itemInCart) {
            itemInCart.quantity += cartItem.quantity;
        } else {
            cart.push(cartItem);
        }

        Cookies.set("cart", JSON.stringify(cart));
        return cart;
    }
    static removeItem(cartItem: CartItem) {
        const cart = CartCookiesClient.getCart();
        const itemIndex = cart.findIndex(item => item.productId === cartItem.productId && item.size === cartItem.size);

        if (itemIndex !== -1) {
            cart.splice(itemIndex, 1);
        }

        Cookies.set("cart", JSON.stringify(cart));
        window.location.reload();
        return cart;
    }
}