import { useNavigate } from "react-router";
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
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import PasswordInput from "@/components/ui/password-input";
import { useTheme } from "@/hooks/use-theme";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login()
{
  const navigate = useNavigate();
  const { theme } = useTheme()
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
                Join 10,000+ businesses that trust Shree Maruthi Printers for
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
                src={theme == "light" ? '/images/logo.light.png' : '/images/logo.dark.png'}
                alt="Shree Maruthi Printers"
                className="size-32 w-auto m-auto"
              />
              {/* <h1 className="font-display text-xl font-bold">
                Shree Maruthi Printers
              </h1> */}
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

type LoginFormProps = {
};

function LoginForm({ }: LoginFormProps)
{

  const form = useFormContext<z.infer<typeof formSchema>>()

  const { signInAsync } = useAuth()

  return (
    <form
      className="mt-8 space-y-6"
      onSubmit={form.handleSubmit(signInAsync)}
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

