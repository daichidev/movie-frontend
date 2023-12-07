import { useLocation, useNavigate } from "react-router-dom";
import { loadAuthProvider, PlatformMethodsLoader } from "../AuthContext";
export { AuthContext, useAuthContext, authConfig } from "../AuthContext";
// ダッシュボードのみ
import { SSOLoginAppleOnClick } from './SSOLoginApple';
import { SSOLoginGoogleOnClick } from './SSOLoginGoogle';
import { SSOLoginMicrosoftOnClick } from './SSOLoginMicrosoft';

const loader: PlatformMethodsLoader = (localModule) => {
    localModule.initPlatformMethods = () => {
        localModule.location = useLocation();
        localModule.navigate = useNavigate();
    };
    localModule.redirectLocal = (path: string) => {
        localModule.navigate(path);
    };
    localModule.getRequestParams = () => {
        return new URLSearchParams(localModule.location.search);
    };
    localModule.getRequestPathname = () => {
        return localModule.location.pathname;
    };
    localModule.hasRequestParams = () => {
        if (localModule.location.search) return true;
        return false;
    };
    localModule.SSOLoginAppleOnClick = SSOLoginAppleOnClick;
    localModule.SSOLoginGoogleOnClick = SSOLoginGoogleOnClick;
    localModule.SSOLoginMicrosoftOnClick = SSOLoginMicrosoftOnClick;
    return;
};
export const AuthProvider = loadAuthProvider(loader);
