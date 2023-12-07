import { useRouter, useParams, usePathname } from 'next/navigation';
import { loadAuthProvider, PlatformMethodsLoader } from "../AuthContext";
export { AuthContext, useAuthContext } from "../AuthContext";

const loader: PlatformMethodsLoader = (localModule: {[key: string]: any}) => {
    localModule.initPlatformMethods = () => {
        console.log('init');
        localModule.router = useRouter();
        localModule.params = useParams();
        localModule.pathname = usePathname();
        console.log(localModule.router);
    };
    localModule.redirectLocal = (path: string) => {
        localModule.router.push(path);
    };
    localModule.getRequestParams = () => {
        return new URLSearchParams(localModule.params);
    };
    localModule.getRequestPathname = () => {
        return localModule.pathname;
    };
    localModule.hasRequestParams = () => {
        if (localModule.params) return true;
        return false;
    };
    return;
};
export const AuthProvider = loadAuthProvider(loader);
