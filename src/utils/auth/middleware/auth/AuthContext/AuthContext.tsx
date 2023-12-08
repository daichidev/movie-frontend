import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SKIP_AUTH } from '../../../../env';
import {
  Child,
  Children,
  SchoolClass,
  logoutGet,
  usersChildrenGet,
  usersMeGet,
  usersMeTokenPut,
} from '../../../__generated__';
import apiClient from '../../../helpers/apiClient';
import {
  AuthConfig,
  AuthState,
  CurrentUser,
  SSOClickAction,
  SSOClickActionCaller,
  SSOClickEventHandler,
} from './AuthTypes';

type Props = { children: ReactNode };
export const authConfig: AuthConfig = {
  referrerApplicationCode: 1,
  loginPageUrl: '/login',
  noAuthPageUrl: ['login'],
};

const initialAuthState: AuthState = {
  uuid: null,
  lastTimestamp: null,
};

type UuidToUser = { [key: string]: Child };
export type PlatformMethods = {
  initPlatformMethods: () => void;
  redirectLocal: (path: string) => void;
  getRequestParams: () => URLSearchParams;
  getRequestPathname: () => string;
  hasRequestParams: () => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  location?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigate?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pathname?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  router?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: any;
  SSOLoginAppleOnClick?: SSOClickAction | undefined;
  SSOLoginGoogleOnClick?: SSOClickAction | undefined;
  SSOLoginMicrosoftOnClick?: SSOClickAction | undefined;
};
export type PlatformMethodsLoader = (platformMethods: PlatformMethods) => void;
type AuthProvider = ({ children }: Props) => JSX.Element;
type AuthProviderLoader = (loader: PlatformMethodsLoader) => AuthProvider;

export const AuthContext = createContext<AuthState>(initialAuthState);
export const loadAuthProvider: AuthProviderLoader = (
  loader: PlatformMethodsLoader,
) => {
  const AuthProvider: ({ children }: Props) => JSX.Element = ({
    children,
  }: Props) => {
    const [uuid, setUuid] = useState('');
    const [currentUser, setCurrentUser] = useState<CurrentUser>();
    const [childrenList, setChildrenList] = useState<Children[]>([]);
    const [schoolClassList, setSchoolClassList] = useState<SchoolClass[]>([]);
    const [childrens, setChildrens] = useState<Child[]>([]);
    const [uuidToUser, setUuidToUser] = useState<UuidToUser>({});
    const [lastTimestamp, setLastTimestamp] = useState(0);
    const [redirectPath, setRedirectPath] = useState<string | null | undefined>(
      '',
    );
    const [intervalId, setIntervalId] = useState<number>(0);
    const [noAuthMode, setNoAuthMode] = useState<boolean>(false);
    const [nextRedirectUrl, setNextRedirectUrl] = useState<string>('');
    const [loginMethod, setLoginMethodState] = useState<string>('');

    /**********************
     * 環境依存メソッド（ナビゲーション関係）
     ***********************/
    const platformMethods: PlatformMethods = {
      initPlatformMethods: () => {},
      redirectLocal: (_path) => {},
      getRequestParams: () => new URLSearchParams({}),
      getRequestPathname: () => '',
      hasRequestParams: () => false,
    };
    loader(platformMethods);
    const redirect = (path: string) => {
      if (path.match(/^http/)) {
        window.location.href = path;
      } else {
        platformMethods.redirectLocal(path);
      }
    };
    platformMethods.initPlatformMethods();

    /**********************
     * 状態による分岐処理
     ***********************/
    useEffect(() => {
      console.log('check');
      if (platformMethods.hasRequestParams()) {
        const query = platformMethods.getRequestParams();
        if (query.get('redirectUrl')) {
          const redirectUrl = query.get('redirectUrl');
          if (redirectUrl) {
            setNextRedirectUrl(redirectUrl);
            query.delete('redirectUrl');
            let newPath = platformMethods.getRequestPathname();
            if (query.size > 0) {
              newPath += '?' + query.toString();
            }
            redirect(newPath);
          }
        }
      }
    }, []);

    useEffect(() => {
      // 未認証ならログイン画面へ
      console.log(SKIP_AUTH);
      if (SKIP_AUTH) return;
      if (!uuid) {
        init();
      } else {
        triggerUpdateToken();
      }
    }, [uuid]);

    /**********************
     * セッションストレージ処理
     ***********************/
    const storageSessionKey = 'mk-session-key';
    const getCachedSessionKey = () => {
      return sessionStorage.getItem(storageSessionKey);
    };
    const setCachedSessionKey = (_key: string) => {
      console.log(['setKey', _key]);
      sessionStorage.setItem(storageSessionKey, _key);
    };
    const storageLoginMethod = 'mk-login-method';
    const getCachedLoginMethod = () => {
      return sessionStorage.getItem(storageLoginMethod);
    };
    const setCachedLoginMethod = (_loginMethod: string) => {
      console.log(['setLoginMethod', _loginMethod]);
      sessionStorage.setItem(storageLoginMethod, _loginMethod);
    };
    const setLoginMethod = (_loginMethod: string) => {
      setLoginMethodState(_loginMethod);
      setCachedLoginMethod(_loginMethod);
    };

    // 初期化
    const init = () => {
      console.log('init');

      const _loginMethod = getCachedLoginMethod();
      console.log(_loginMethod);
      if (_loginMethod != null) {
        setLoginMethod(_loginMethod);
      }

      const _key = getCachedSessionKey();
      console.log(_key);
      if (_key != null) {
        apiClient.setCsrfVerifyToken(_key);
        return loadAuthData();
      }
      notLoggedIn();
    };

    /**********************
     * 内部処理用主要メソッド類
     ***********************/
    const notLoggedIn = () => {
      // パスのチェック
      console.log(location.pathname);
      setLoginMethod('');
      if (authConfig.noAuthPageUrl.includes(location.pathname)) {
        console.log('pass');
        return; // そのままページ処理
      }
      let url = authConfig.loginPageUrl!;
      if (url.match(/\.redirectUrl=/)) {
        return redirect(url);
      }
      if (url.match(/\?/)) {
        url += '&';
      } else {
        url += '?';
      }
      if (authConfig.referrerApplicationCode == 0) {
        url += 'redirectUrl=' + encodeURI(location.pathname);
      } else {
        url += 'redirectUrl=' + encodeURI(window.location.pathname);
      }
      redirect(url);
    };

    const authenticated = (_uuid?: string | null) => {
      if (_uuid) {
        setLastTimestamp(new Date().getTime());
        // ログイン後処理
        postLogin();
      } else if (noAuthMode) {
        return;
      } else {
        console.log('login error');
        // 認証状態の更新
        notLoggedIn();
      }
    };

    type SchoolClassesAndUsers = {
      schoolClassList: SchoolClass[];
      childrens: Child[];
      uuidToUser: UuidToUser;
    };

    const loadAuthData = async () => {
      // ユーザ情報の取得
      const loginUser = await updateProfile();
      if (!loginUser) {
        return notLoggedIn();
      }
      setLastTimestamp(new Date().getTime());
      await usersChildrenGet({
        referrer_application: authConfig.referrerApplicationCode,
      }).then((res) => {
        console.log(res);
        if (res.data.children) {
          console.log('setChildren');
          setChildrenList(res.data.children);
          const data = res.data.children.reduce<SchoolClassesAndUsers>(
            (acc: SchoolClassesAndUsers, child: Children) => {
              acc.schoolClassList.push(child.school_class);
              acc.childrens.concat(child.user);
              child.user.forEach((user) => {
                uuidToUser[user.user_uuid] = user;
              });
              return acc;
            },
            {
              schoolClassList: [],
              childrens: [],
              uuidToUser: {},
            },
          );
          setSchoolClassList(data.schoolClassList);
          setChildrens(data.childrens);
          setUuidToUser(data.uuidToUser);
        }
      });
      triggerUpdateToken();
      return loginUser;
    };

    const postLogin = async () => {
      const loginUser = await loadAuthData();
      if (!loginUser) {
        return notLoggedIn();
      }
      console.log('redirect');
      // redirect 処理
      if (redirectPath) {
        console.log(redirectPath);
        return redirect(redirectPath);
      } else {
        if (!redirectPath) {
          if (nextRedirectUrl) {
            const ret = redirect(nextRedirectUrl);
            setNextRedirectUrl('');
            return ret;
          }
        }

        if (authConfig.mainPageUrlMethod) {
          const mainPagePath = authConfig.mainPageUrlMethod(loginUser);
          console.log(mainPagePath);
          if (mainPagePath) {
            return redirect(mainPagePath);
          }
        }
        if (authConfig.mainPageUrl) {
          const mainPagePath = authConfig.mainPageUrl;
          console.log(mainPagePath);
          if (mainPagePath) {
            return redirect(mainPagePath);
          }
        }
      }
    };

    /**********************
     * トークンの定期更新処理
     ***********************/
    const triggerUpdateToken = () => {
      console.log(['clear', intervalId]);
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (uuid) {
        const _intervalId = setInterval(updateToken, 30000);
        console.log(['setInterval', _intervalId]);
        setIntervalId(Number(_intervalId));
      }
    };
    const updateToken = () => {
      console.log(['updateToken', uuid, currentUser]);
      if (uuid) {
        const now = new Date().getTime();
        if (lastTimestamp > 0 && lastTimestamp < now - 300000) {
          // 5分ごとチェック
          // 認証状態の更新
          usersMeTokenPut({
            referrer_application: authConfig.referrerApplicationCode,
          }).then((res) => {
            const _key = apiClient.csrfVerifyToken;
            setCachedSessionKey(_key!);
            setLastTimestamp(now);
            console.log(res);
          });
        }
      }
    };

    /**********************
     * イベントハンドリングメソッド
     ***********************/
    // ユーザ情報の更新
    const updateProfile = async () => {
      const _key = apiClient.csrfVerifyToken;
      setCachedSessionKey(_key!);
      const response = await usersMeGet({
        referrer_application: authConfig.referrerApplicationCode,
      }).catch((e) => {
        console.log(e);
        return null;
      });
      if (!response) {
        return null;
      }
      const loginUser = response.data;
      if (loginUser == null) {
        return null;
      }
      console.log(loginUser);
      setUuid(loginUser.user_uuid);
      setCurrentUser(loginUser);
      console.log(uuid);
      console.log(currentUser);
      return loginUser;
    };

    // ログアウト処理
    const processLogout = () => {
      return logoutGet().then((res) => {
        // 画面遷移はしない
        setUuid('');
        setCurrentUser(undefined);
        setLastTimestamp(0);
        setSchoolClassList([]);
        setChildrens([]);
        setUuidToUser({});
        setLoginMethod('');
        return res;
      });
    };

    // SSO 後処理（APIハンドリングはほぼ共通？）
    const SSOLoginClick: SSOClickActionCaller = (
      method: string,
      action: SSOClickAction | undefined,
    ) => {
      console.log(method);
      if (action !== undefined) {
        return action()
          .then(({ data }) => {
            setLoginMethod(method);
            authenticated(data.user_uuid);
            return 200;
          })
          .catch((res) => {
            console.log(res);
            if (!res.response) {
              return 500;
            }
            return res.response.status as number;
            // 400					リクエストパラメータに、不足、形式違いなどの問題がある
            // 401					トークン、ログインID、パスワードのいずれかに間違いがある、アカウントロック状態
            // 403					アクセス権がない
            // 404					存在しないURLにアクセス、データが存在しない
            // 500					不明なエラー
          });
      }
      return new Promise((res, _rej) => {
        res(500);
      });
    };
    // SSO 関係の拡張
    const SSOLoginGoogleClick: SSOClickEventHandler = () => {
      return SSOLoginClick('google', platformMethods.SSOLoginGoogleOnClick);
    };

    const SSOLoginMicrosoftClick: SSOClickEventHandler = () => {
      return SSOLoginClick(
        'microsoft',
        platformMethods.SSOLoginMicrosoftOnClick,
      );
    };

    const SSOLoginAppleClick: SSOClickEventHandler = () => {
      return SSOLoginClick('apple', platformMethods.SSOLoginAppleOnClick);
    };

    /**********************
     * アクセサーメソッド
     ***********************/
    const getCurrentUser = () => {
      return currentUser;
    };

    const getUserFromUuid = (uuid: string) => {
      if (uuid in uuidToUser) {
        return uuidToUser[uuid];
      }
      return null;
    };

    const isLoggedIn = () => {
      if (currentUser) {
        return true;
      }
      return true;
    };

    const isTeacher = () => {
      if (currentUser) {
        if (currentUser.user_type == 1) {
          return true;
        }
      }
      return false;
    };

    const isStudent = () => {
      if (currentUser) {
        if (currentUser.user_type == 2) {
          return true;
        }
      }
      return false;
    };

    const getSchoolClassList = (
      grade: number | null = null,
      class_name: string | null = null,
    ) => {
      if (grade === null && class_name === null) {
        return schoolClassList;
      }
      return schoolClassList.reduce<SchoolClass[]>((acc, school_class) => {
        if (!school_class.grade || !school_class.class_name) return acc;
        if (school_class.grade != grade) return acc;
        if (class_name != null && school_class.class_name != class_name)
          return acc;
        acc.push(school_class);
        return acc;
      }, []);
    };

    const getChildrenList = () => {
      return childrenList;
    };

    const getChildrens = (
      grade: number | null = null,
      class_name: string | null = null,
    ) => {
      if (grade === null) {
        return childrens;
      }
      return childrens.reduce<Child[]>((acc, user) => {
        if (!user.grade || !user.class_name) return acc;
        if (user.grade != grade) return acc;
        if (class_name != null && user.class_name != class_name) return acc;
        acc.push(user);
        return acc;
      }, []);
    };

    const isLoginBySSO = () => {
      if (loginMethod == 'google') return true;
      if (loginMethod == 'microsoft') return true;
      if (loginMethod == 'apple') return true;
      return false;
    };

    const isLoginByPassword = () => {
      if (loginMethod == 'password') return true;
      return false;
    };

    const isLoginByCode = () => {
      if (loginMethod == 'qr') return true;
      if (loginMethod == 'code') return true;
      return false;
    };

    const data: AuthState = {
      uuid,
      lastTimestamp,
      isLoggedIn,
      isTeacher,
      isStudent,
      getCurrentUser,
      getUserFromUuid,
      getChildrenList,
      getSchoolClassList,
      getChildrens,
      SSOLoginGoogleClick,
      SSOLoginMicrosoftClick,
      SSOLoginAppleClick,
      processLogout,
      updateProfile,
      setNoAuthMode,
      isLoginBySSO,
      isLoginByPassword,
      isLoginByCode,
    };
    return <AuthContext.Provider value={data}>{children}</AuthContext.Provider>;
  };
  return AuthProvider;
};

export const useAuthContext = () => useContext(AuthContext);
export const AuthConsumer = AuthContext.Consumer;
