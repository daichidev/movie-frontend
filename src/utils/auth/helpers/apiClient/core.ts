import { AxiosResponse } from 'axios';
import { ApiClientCoreType } from './types';

const setCsrfVerifyToken = (csrfVerifyToken:string | null | undefined) => {
  apiClient.csrfVerifyToken = csrfVerifyToken;
};
const parseResponse = (response?:AxiosResponse) => {
  if (!response) {
    return;
  }
  const verifyToken =
    'x-csrf-token' in response.headers
      ? response.headers['x-csrf-token']
      : null;
  if (verifyToken) {
    apiClient.setCsrfVerifyToken(verifyToken);
  }
};
const createTokenHeader = () => {
  const headers:{[key: string]: string} = {};
  if (apiClient.csrfVerifyToken) {
    headers['X-CSRF-TOKEN'] = apiClient.csrfVerifyToken;
  }
  return headers;
};
const apiClient: ApiClientCoreType = {
  csrfVerifyToken: null,
  setCsrfVerifyToken,
  parseResponse,
  createTokenHeader,
};

export default apiClient;
