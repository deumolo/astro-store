import { loginUser, logout, registerUser } from './auth';
import { getProductsByPage } from './products/get-products-by-page.action';

export const server = {
  loginUser,
  logout,
  registerUser,
  getProductsByPage
};
