import axios from "axios";

const instance = axios.create({
  baseURL: "https://flipkart-server-side-1.onrender.com", 
  withCredentials: true, 
});

export default instance;
