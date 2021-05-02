import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL,
  // baseURL: "https://lireddit.store/api",
});

export default instance;
