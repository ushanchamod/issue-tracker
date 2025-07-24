import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
});

type AxiosRequestConfig = {
  url: string;
  method?: "get" | "post" | "put" | "delete";
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
};

const useAxios = () => {
  const fetchData = async ({
    url,
    method = "get",
    data = null,
    params = {},
    headers = {},
  }: AxiosRequestConfig) => {
    try {
      const response = await instance.request({
        url,
        method,
        data,
        params,
        headers,
      });
      return response.data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  };

  return { fetchData };
};

export default useAxios;
