import api from "../api/api";

export const createSale = async (payload: {
  shopId: string;
  saleDate: string;
  items: { productId: string; quantity: number }[];
}) => {
  const res = await api.post("/sales", payload);
  return res.data;
};
