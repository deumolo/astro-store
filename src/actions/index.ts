import { loginUser, logout, registerUser } from './auth';
import { getProductsByPage } from './products/get-products-by-page.action';
import { getProductBySlug } from './products/get-products-by-slug';

export const server = {
  loginUser,
  logout,
  registerUser,
  getProductsByPage,
  getProductBySlug
};
