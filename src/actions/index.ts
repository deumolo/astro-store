import { loginUser, logout, registerUser } from './auth';
import { getProductsByPage } from './products/get-products-by-page.action';
import { getProductBySlug } from './products/get-products-by-slug';
import { createUpdateProduct } from './products/create-update-product.action';
import { loadProductsFromCart } from './cart/load-products-from-cart.action';


export const server = {
  loginUser,
  logout,
  registerUser,
  getProductsByPage,
  getProductBySlug,
  loadProductsFromCart,
  createUpdateProduct,
};
