import axios from "axios";

axios.defaults.withCredentials = true;
//creating a custom Instance for reducing code 
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api/": "/api",
});