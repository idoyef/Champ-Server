import axios from "axios";

export class ApiWrapper {
  async get(url: string, headers: any): Promise<any> {
    return axios.get(url, { headers }).catch(error => {
      throw error;
    });
  }

  async post(url: string, data: object, headers: any): Promise<any> {
    return axios.post(url, data, { headers }).catch(error => {
      throw error;
    });
  }
}
