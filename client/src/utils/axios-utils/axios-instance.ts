import axios, { AxiosInstance } from "axios";
import { axiosConfig } from "./axios.config";

export class AUAFLAxiosInstance {
  private static static_axios: AxiosInstance;
  private constructor() {}
  public static getInstance() {
    if (!AUAFLAxiosInstance.static_axios) {
      AUAFLAxiosInstance.static_axios = axios.create(axiosConfig);
      return AUAFLAxiosInstance.static_axios;
    } else {
      console.info("Axios Instance Utilized");
      return AUAFLAxiosInstance.static_axios;
    }
  }
}
