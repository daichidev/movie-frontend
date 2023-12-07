import { AxiosResponse } from 'axios';

export type ApiResponse = { data: unknown; status: number };
export type ApiClientCoreType = {
  csrfVerifyToken: string | null | undefined;
  setCsrfVerifyToken: (
    csrfVerifyToken: string | null | undefined,
  ) => void;
  parseResponse: (response?: AxiosResponse) => void;
  createTokenHeader: () => { [name: string]: string };
};

export type ApiClientType = ApiClientCoreType & {
  login: (postData: unknown) => Promise<ApiResponse>;
  updateSession: () => Promise<ApiResponse>;
};
export const ApiClientCoreInitialValue = {
  sessionToken: null,
  setCsrfVerifyToken: (_csrfVerifyToken:string | null | undefined) => {},
  parseResponse: (_response?:AxiosResponse) => {},
  createTokenHeader: () => {
    return {};
  },
};
