import { createContext, useCallback, useMemo } from "react";
import type {
  AuthContextValue,
  AuthProviderProps,
  AuthUser,
  SignIn,
  SignUp,
} from "@/types/auth";

const GUEST_USER: AuthUser = {
  name: "Guest",
  email: "guest@gokulprinters.local",
  avatar: "",
  createdAt: new Date().toISOString(),
};

export const AuthProviderContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: AuthProviderProps) {
  const signInAsync = useCallback(async (_payload: SignIn): Promise<boolean> => true, []);
  const signUpAsync = useCallback(async (_values: SignUp): Promise<void> => undefined, []);
  const signOutAsync = useCallback(async (): Promise<void> => undefined, []);

  const contextValue: AuthContextValue = useMemo(
    () => ({
      user: GUEST_USER,
      isAuthenticated: true,
      signInAsync,
      signOutAsync,
      signUpAsync,
    }),
    [signInAsync, signOutAsync, signUpAsync],
  );

  return (
    <AuthProviderContext.Provider value={contextValue}>
      {children}
    </AuthProviderContext.Provider>
  );
}
