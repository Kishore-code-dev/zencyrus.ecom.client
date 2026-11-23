import type { AuthUser } from "@/types/auth";

export const AUTH_STORAGE_KEY =
  import.meta.env.VITE_AUTH_COOKIE || "shree_maruthi_printers_auth";

export const AUTH_STATE_CHANGED_EVENT = "auth-state-changed";

function parseStoredValue(value: string): unknown
{
  try
  {
    const parsed = JSON.parse(value) as unknown;

    if (typeof parsed === "string")
    {
      try
      {
        return JSON.parse(parsed) as unknown;
      }
      catch
      {
        return parsed;
      }
    }

    return parsed;
  }
  catch
  {
    return null;
  }
}

export function readAuthUser(): AuthUser | null
{
  if (typeof window === "undefined")
  {
    return null;
  }

  const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!storedValue)
  {
    return null;
  }

  const parsedValue = parseStoredValue(storedValue);

  if (parsedValue && typeof parsedValue === "object")
  {
    return parsedValue as AuthUser;
  }

  if (typeof parsedValue === "string")
  {
    return {
      name: parsedValue,
      email: "",
      avatar: "",
      createdAt: "",
    };
  }

  return null;
}

export function notifyAuthStateChanged(): void
{
  if (typeof window !== "undefined")
  {
    window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
  }
}

export function removeStoredAuthUser(): void
{
  if (typeof window === "undefined")
  {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
  notifyAuthStateChanged();
}
