import api from "../api/api";

export const getUsers = async () => {
    const res = await api.get("/users");
    return res.data;
};

export const createUser = async (payload: {
    name: string;
    username: string;
    password: string;
    role: "EMPLOYEE" | "ADMIN";
}) => {
    const res = await api.post("/users", payload);
    return res.data;
};

export const toggleUserStatus = async (id: string) => {
    const res = await api.patch(`/users/${id}/toggle`);
    return res.data;
};
