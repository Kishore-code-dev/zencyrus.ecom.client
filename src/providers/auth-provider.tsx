import { api } from "@/config/api";
import { useApiAction } from "@/hooks/use-api-action";
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
  SignIn,
} from "@/types/auth";
import { AxiosError } from "axios";
import { createContext, useCallback, useMemo } from "react";

export const AuthProviderContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: AuthProviderProps)
{
  const authUser = localStorage.getItem(import.meta.env.VITE_AUTH_COOKIE)
  const user = useMemo(() => authUser ? JSON.parse(authUser) as AuthUser : null, [authUser])

  const { apiActionAsync } = useApiAction();

  const signInAsync = useCallback(
    async (payload: SignIn) =>
    {
      try
      {
        const response = await api.post(`auth/signin`, payload);
        await apiActionAsync(response);
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response);
        }
      }
    },
    [user],
  );

  const signUpAsync = useCallback(
    async (values: any) =>
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
              values.shopBannerFile[0]
              : null,
          visitingCardFile:
            (
              Array.isArray(values.visitingCardFile) &&
              values.visitingCardFile.length >= 1
            ) ?
              values.visitingCardFile[0]
              : null,
        };

        const response = await api.post(`auth/signup`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await apiActionAsync(response);
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response);
        }
      }
    },
    [user],
  );

  const signOutAsync = useCallback(async () =>
  {
    try
    {
      const response = await api.post(`auth/signout`);
      localStorage.removeItem(import.meta.env.VITE_AUTH_COOKIE);
      await apiActionAsync(response);
    } catch (error)
    {
      if (error instanceof AxiosError && error.response)
      {
        await apiActionAsync(error.response);
      }
    }
  }, [user]);

  const contextValue: AuthContextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      signInAsync,
      signOutAsync,
      signUpAsync,
    }),
    [user],
  );

  return (
    <AuthProviderContext.Provider value={contextValue}>
      {children}
    </AuthProviderContext.Provider>
  );
}