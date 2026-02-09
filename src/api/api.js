import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

export const loginRequest = async (username, password) => {
  const res = await api.get(`/users?username=${username}&password=${password}`);
  if (res.data.length === 0) throw new Error("Invalid credentials");
  return res.data[0];
};

export const registerRequest = async (username, password, name) => {
  const exists = await api.get(`/users?username=${username}`);
  if (exists.data.length > 0) throw new Error("Username already exists");
  const res = await api.post("/users", { username, password, name });
  return res.data;
};

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const addProduct = async (title, price, category, thumbnail) => {
  const res = await api.post("/products", {
    title,
    price,
    category,
    thumbnail,
  });
  return res.data;
};
