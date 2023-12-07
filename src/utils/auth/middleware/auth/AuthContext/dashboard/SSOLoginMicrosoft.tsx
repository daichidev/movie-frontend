import { UserAgentApplication } from 'msal';
import { loginSsoMicrosoftPost } from '../../../../__generated__';
import { SSOClickAction, SSOClickResponse } from '../AuthTypes';

type MicrosoftLoginPrompt = 'login' | 'select_account' | 'consent' | 'none';

export const SSOLoginMicrosoftOnClick: SSOClickAction = () => {
  return new Promise<SSOClickResponse>((resolve, reject) => {
    const clientId = process.env.SSO_MICROSOFT_CLIENT_ID || "";
    const redirectUri = process.env.SSO_MICROSOFT_REDIRECT_URI || "";
    const graphScopes = ['user.read'];
    const prompt: MicrosoftLoginPrompt = 'select_account';
    const userAgentApplication = new UserAgentApplication({
      auth: {
        clientId: clientId,
        redirectUri: redirectUri,
        validateAuthority: false,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: true,
      },
    });

    console.log("call popupLogin");
    try {
      console.log("call popupLogin try");
      const params = {
        scopes: graphScopes,
        prompt: prompt,
        loginHint: 'noma@7nin.jp',
        responseType: 'code',
      };

      console.log('call popup');
      console.log(params);
      userAgentApplication.acquireTokenPopup(params).then((ret) => {
        console.log('call popup done');
        console.log(ret);
        const accessToken = ret.accessToken;
        loginSsoMicrosoftPost({code: accessToken}).then((response) => {
          if (response && response.data && response.data.user_uuid) {
            resolve(response);
            return;
          }
          reject(response);
          return;
        });  
        return null;
      });
    } catch (err) {
      reject(err);
    }
  });
};
