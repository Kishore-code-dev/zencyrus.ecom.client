import AppLogo from "@/components/app-logo/app-logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/config/api";
import { useApiAction } from "@/hooks/use-api-action";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { ArrowLeft, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import z from "zod";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type FormSchemaType = z.infer<typeof formSchema>;

export default function ForgotPasswordCard() {
  const { apiActionAsync } = useApiAction();
  const form = useForm<FormSchemaType>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
    resolver: zodResolver(formSchema),
  });

  const { handleSubmit, control, formState } = form;

  const onSubmit = async (data: FormSchemaType) => {
    try {
      const response = await api.post("/auth/forgot-password", data);
      if (
        response.status === 200 &&
        response.data &&
        "isSuccess" in response.data &&
        response.data.isSuccess
      ) {
        toast.success("Password reset link sent to your email");
        form.reset();
      }
      await apiActionAsync(response);
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        await apiActionAsync(error.response);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-96 rounded-lg shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="flex justify-center">
            <AppLogo />
          </div>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Forgot Password?
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email address and we'll send you a link to reset your
            password
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <Form {...form}>
            <form
              className="grid grid-cols-1 gap-2.5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Email address
                    </FormLabel>
                    <InputGroup>
                      <FormControl>
                        <InputGroupInput
                          type="email"
                          placeholder="Enter your registered email"
                          autoComplete="email"
                          maxLength={250}
                          {...field}
                        />
                      </FormControl>
                      <InputGroupAddon>
                        <Mail className="text-muted-foreground" />
                      </InputGroupAddon>
                    </InputGroup>
                    <FormDescription className="text-xs">
                      We'll send a password reset link to this email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={formState.isSubmitting}
              >
                <span>Send Reset Link</span>
                {formState.isSubmitting && <Spinner />}
              </Button>

              <Button
                type="button"
                size="sm"
                variant="link"
                className="mx-auto"
              >
                <Link
                  to="/auth/login"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Back to Login
                </Link>
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
