import axios, { type AxiosInstance } from "axios";

import { BASE_URL } from "@/services/config";

export const AxiosApi: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}`,
});
