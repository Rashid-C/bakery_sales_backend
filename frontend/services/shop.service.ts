import api from "../api/api";

export const getShops = async () => {
    const res = await api.get("/shops");
    return res.data;
};
