import { api } from "@/config/api";
import {
  readAuthUser,
  removeStoredAuthUser,
  AUTH_STATE_CHANGED_EVENT,
} from "@/config/auth-storage";
import { useApiAction } from "@/hooks/use-api-action";
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
  SignIn,
  SignUp,
} from "@/types/auth";
import { AxiosError } from "axios";
import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const AuthProviderContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: AuthProviderProps)
{
  const [user, setUser] = useState<AuthUser | null>(() => readAuthUser());

  const refreshAuth = useCallback(() =>
  {
    const authUser = readAuthUser();
    setUser(authUser);
    return authUser;
  }, []);

  useEffect(() =>
  {
    const handleAuthStateChange = () => refreshAuth();

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChange);
    window.addEventListener("storage", handleAuthStateChange);

    return () =>
    {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, handleAuthStateChange);
      window.removeEventListener("storage", handleAuthStateChange);
    };
  }, [refreshAuth]);

  const { apiActionAsync } = useApiAction();

  const signInAsync = useCallback(
    async (payload: SignIn): Promise<boolean> =>
    {
      try
      {
        const response = await api.post(`auth/signin`, payload);
        await apiActionAsync(response);
        return refreshAuth() !== null;
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response);
        }

        return false;
      }
    },
    [apiActionAsync, refreshAuth],
  );

  const signUpAsync = useCallback(
    async (values: SignUp) =>
    {
      try
      {
        const payload = {
          ...values,
          shopBannerFile:
            (
              Array.isArray(values.shopBannerFile) &&
              values.shopBannerFile.length >= 1
            ) ?
              values.shopBannerFile[0] :
              null,
          visitingCardFile:
            (
              Array.isArray(values.visitingCardFile) &&
              values.visitingCardFile.length >= 1
            ) ?
              values.visitingCardFile[0] :
              null,
        };

        const response = await api.post(`auth/signup`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await apiActionAsync(response);
        refreshAuth();
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response);
        }
      }
    },
    [apiActionAsync, refreshAuth],
  );

  const signOutAsync = useCallback(async () =>
  {
    try
    {
      const response = await api.post(`auth/signout`);
      removeStoredAuthUser();
      refreshAuth();
      await apiActionAsync(response);
    } catch (error)
    {
      if (error instanceof AxiosError && error.response)
      {
        await apiActionAsync(error.response);
      }
    } finally
    {
      removeStoredAuthUser();
      refreshAuth();
    }
  }, [apiActionAsync, refreshAuth]);

  const contextValue: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      signInAsync,
      signOutAsync,
      signUpAsync,
    }),
    [user, signInAsync, signOutAsync, signUpAsync],
  );

  return (
    <AuthProviderContext.Provider value={contextValue}>
      {children}
    </AuthProviderContext.Provider>
  );
}
