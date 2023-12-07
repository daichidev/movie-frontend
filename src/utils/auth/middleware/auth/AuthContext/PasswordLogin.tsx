import { loginPost } from "@/src/__generated__";
import { authConfig } from "./AuthContext";

export const PasswordLoginOnSubmit = async (
  email: string,
  password: string,
) => {
  return loginPost({
    account_id: email,
    password,
    referrer_application: authConfig.referrerApplicationCode,
  });
};
