import Axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import apiClient from './core';
import { handleDates, tzOffset, setTzOffset, formatToDate } from '../date';
const baseURL = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '/api/Prod';
export const AXIOS_INSTANCE = Axios.create({ baseURL: baseURL }); // use your own URL here or environment variable

const noAuthUrls = [
    'login',
    'login/sso/google',
    'login/sso/microsoft',
    'login/sso/apple',
    'account/issue',
    'account/update',
    'resetting-url',
    'onetime-code/%%',
    'password/reset',
];
// add a second `options` argument here if you want to pass extra options to each generated query
export const apiClientInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
    let requireAuth = true;
    if (config.url) {
        if (config.url in noAuthUrls) {
            requireAuth = false;
        }
    }
    console.log('baseURL');
    console.log(baseURL);
    let headers = config ? config.headers ? config.headers : {} : {};
    if (requireAuth) {
        const extraHeaders = apiClient.createTokenHeader();
        headers = {
            ...headers,
            ...extraHeaders,
            'Content-Type': 'application/json;charset=utf-8',
            Accept: 'application/json',
        }
    }
    else if (config.method == 'get') {
        headers = {
            ...headers,
            Accept: 'application/json',
        }
    }
    else {
        headers = {
            ...headers,
            'Content-Type': 'application/json;charset=utf-8',
            Accept: 'application/json',
        }
    }
    config.headers = headers;
    config.withCredentials= true;
    // 日付の形式を指定
    if (config.params) {
        if (config.params.from_date) {
            config.params.from_date = formatToDate(config.params.from_date)
        }
        if (config.params.to_date) {
            config.params.to_date = formatToDate(config.params.to_date)
        }
    }
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
        cancelToken: source.token,
    }).then((response) => {
        if (response.request.responseURL.match(/\/users\/me\?/)) {
            if (response.data.time_difference_from_utc) {
                setTzOffset(response.data.time_difference_from_utc);
                console.log(['set tzOffset', tzOffset]);
            }
        }
        handleDates(response.data);
        apiClient.parseResponse(response);
        return response;
    });

    // promise.cancel = () => {
    //     source.cancel('Query was cancelled');
    // };

    return promise;
};

// In some case with react-query and swr you want to be able to override the return error type so you can also do it here like this
export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;
