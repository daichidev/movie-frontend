import { loginSsoApplePost } from '../../../../__generated__';
import { SSOClickAction, SSOClickResponse } from '../AuthTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const AppleID: any;

type AppleSSOResponse = {
  authorization?: {
    code?: string;
  }
};

declare global {
  interface DocumentEventMap {
      "AppleIDSignInOnSuccess": CustomEvent<AppleSSOResponse>;
  }
}

export const SSOLoginAppleOnClick:SSOClickAction = () => {
  console.log("SSOLogin Apple start");
  return new Promise<SSOClickResponse>((resolve, reject) => {
    const onSuccess = ((response: CustomEvent<AppleSSOResponse>) => {
      cancelEventListener();
      if (response.detail && response.detail.authorization && response.detail.authorization.code) {
        const auth_code = response.detail.authorization.code;
        console.log(auth_code);
        loginSsoApplePost({code: auth_code}).then((response) => {
          if (response && response.data && response.data.user_uuid) {
            resolve(response);
            return;
          }
          reject(response);
          return;
        });  
      }
      else {
        // 認証エラー
        return new Promise((res, _rej) => {
          res(400); // rejがいいか？
        })
      }
    }) as EventListenerOrEventListenerObject;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onError = (error: any) => {
      console.log(error);
      // error.detail.error
      //   'popup_closed_by_user'
      //   'user_cancelled_authorize'
      reject(error.detail.error);
      cancelEventListener();
    };
    const cancelEventListener = () => {
      document.removeEventListener("AppleIDSignInOnSuccess", onSuccess);
      document.removeEventListener("AppleIDSignInOnFailure", onError);
    };
    const clientId=process.env.SSO_APPLE_CLIENT_ID || "";
    const apiURI=process.env.SSO_APPLE_API || "";
    const appleAuth = document.createElement("script");
    const scope = "email name";
    appleAuth.src =  "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    appleAuth.type = "text/javascript";
    appleAuth.onload = () => {
      console.log("SSOLogin Apple script load");
      console.log([clientId, apiURI]);
      AppleID.auth.init({
          clientId: clientId,
          scope: scope,
          redirectURI: apiURI,
          usePopup: true,
      });
      AppleID.auth.signIn();
    };
    document.head.append(appleAuth);
    document.addEventListener("AppleIDSignInOnSuccess", onSuccess);
    document.addEventListener("AppleIDSignInOnFailure", onError);
  });
};
