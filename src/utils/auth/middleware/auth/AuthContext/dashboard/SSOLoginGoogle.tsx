import { loginSsoGooglePost } from '../../../../__generated__';
import { SSOClickAction, SSOClickResponse } from '../AuthTypes';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const google: any;

type GoogleSSOResponse = {
  code?: string;
};

export const SSOLoginGoogleOnClick: SSOClickAction = () => {
  console.log('google click');
  return new Promise<SSOClickResponse>((resolve, reject) => {
    const client_id = process.env.SSO_GOOGLE_CLIENT_ID || '';
    // const redirect_url = process.env.SSO_GOOGLE_API || '';

    const googleAuth = document.createElement("script");
    const scopes = 
      'https://www.googleapis.com/auth/userinfo.email'
      ;
    googleAuth.src =  "https://accounts.google.com/gsi/client";
    googleAuth.type = "text/javascript";
    console.log('loading');
    googleAuth.onload = () => {
      console.log("SSOLogin Google script load");
      const clientConfig = {
        client_id: client_id,
        scope: scopes,
        response_mode: 'code',
        redirect_uri: 'postmessage',
        ux_mode: 'popup',
        access_type: 'online',
      }
      function postAuthCode (codeResponse: GoogleSSOResponse) {
        if (codeResponse && codeResponse.code) {
          const code = codeResponse.code;
          console.log(code);
          loginSsoGooglePost({code: code}).then((response) => {
            console.log(response);
            if (response && response.data && response.data.user_uuid) {
              console.log('ok');
              resolve(response);
              return;
            }
            console.log('ng');
            reject(response);
            return;
          }).catch ((e) => {
            console.log(e);
            reject(e);
          });
        }
        else {
          console.log(codeResponse);
          reject(codeResponse);  
        }
      }

      const client = google.accounts.oauth2.initCodeClient({
        callback: postAuthCode,
        ...clientConfig
      });
      client.requestCode();
    };
    document.head.append(googleAuth);
  })
};