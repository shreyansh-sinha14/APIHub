import axios from "axios";

const API = axios.create({
    baseURL: "https://apihubbackend.onrender.com/api",
});

export default API;