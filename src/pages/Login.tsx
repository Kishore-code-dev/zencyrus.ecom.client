import { useLocation, useNavigate, useSearchParams } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Link } from "react-router";
import
{
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import PasswordInput from "@/components/ui/password-input";
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

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
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();
  const redirectTarget = getSafeRedirectTarget(searchParams.get("redirect"));

  useEffect(() =>
  {
    if (!isAuthenticated || location.pathname !== "/auth/login")
    {
      return;
    }

    navigate(redirectTarget, { replace: true });
  }, [isAuthenticated, location.pathname, navigate, redirectTarget]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (

    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}

      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-primary to-primary/80">
          <div className="flex h-full flex-col items-center justify-center p-12 text-center">
            <div className="max-w-md">
              <h2 className="font-display text-4xl font-bold text-primary-foreground">
                Your Printing Partner
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join 10,000+ businesses that trust Gokul Printers for
                high-quality, reliable printing services.
              </p>
              <div className="mt-12 grid grid-cols-3 gap-6">
                {["Fast Delivery", "Best Quality", "Fair Pricing"].map(
                  (item) => (
                    <div key={item} className="rounded-lg bg-white/10 p-4">
                      <p className="text-sm font-medium text-primary-foreground">
                        {item}
                      </p>
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Visual */}

      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div>
            <div className="flex items-center gap-3">
              <img
                loading="lazy"
                decoding="async"
                src="/images/logo.svg"
                alt="Gokul Printers"
                className="size-32 w-auto m-auto"
              />
            </div>
            <h2 className="mt-8 font-display text-2xl font-bold">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                to="/auth/register"
                className="font-medium text-accent hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
          <Form {...form}>
            <LoginForm />
          </Form>
          <p className="text-sm text-muted-foreground text-center">
            By continuing, you agree to our{" "}

            <Link
              to="/termsandconditions"
              className="text-blue-600 font-medium hover:underline"
            >
              Terms of Service
            </Link>{" "}

            and{" "}

            <Link
              to="/privacypolicy"
              className="text-blue-600 font-medium hover:underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm()
{

  const form = useFormContext<z.infer<typeof formSchema>>()
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signInAsync } = useAuth()
  const redirectTarget = getSafeRedirectTarget(searchParams.get("redirect"));

  const handleSubmit = form.handleSubmit(async (values) =>
  {
    const isSignedIn = await signInAsync(values);

    if (isSignedIn)
    {
      navigate(redirectTarget, { replace: true });
    }
  });

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 gap-2.5">
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-3">
              <FormLabel className="text-sm" htmlFor="email">
                Email address
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="Email address"
                  type="email"
                  placeholder="johndoe@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-">
              <div className="flex items-center justify-between">
                <FormLabel className="text-sm" htmlFor="password">
                  Password{" "}
                  <span className="text-destructive">*</span>
                </FormLabel>
                <Link to='/forgot-password' className="ml-auto text-xs hover:underline text-blue-500">Forgot password</Link>
              </div>
              <FormControl>
                <PasswordInput
                  id="password"
                  placeholder="......"
                  {...field}
                />
              </FormControl>

              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
      </div>
      <div className="md:col-span-2 mt-4">
        <Button
          type="submit"
          className="w-full"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </div>
    </form>


  )
}

