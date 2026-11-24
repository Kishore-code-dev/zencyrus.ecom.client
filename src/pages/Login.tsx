import { Navigate, useSearchParams } from "react-router";

function getSafeRedirectTarget(redirectTarget: string | null): string
{
  if (
    !redirectTarget ||
    !redirectTarget.startsWith("/") ||
    redirectTarget.startsWith("//") ||
    redirectTarget.includes("\\")
  )
  {
    return "/";
  }

  try
  {
    const parsedTarget = new URL(redirectTarget, window.location.origin);

    if (
      parsedTarget.origin !== window.location.origin ||
      parsedTarget.pathname === "/auth/login"
    )
    {
      return "/";
    }

    return `${parsedTarget.pathname}${parsedTarget.search}${parsedTarget.hash}`;
  }
  catch
  {
    return "/";
  }
}

export default function Login()
{
  const [searchParams] = useSearchParams();
  const redirectTarget = getSafeRedirectTarget(searchParams.get("redirect"));

  // Free demo — no login required, instant redirect to home (no flash)
  return <Navigate to={redirectTarget} replace />;
}
