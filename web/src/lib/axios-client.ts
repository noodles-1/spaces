import axios from "axios";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

const axiosClient = axios.create({
    baseURL: SERVER_URL,
    withCredentials: true,
});

export default axiosClient;