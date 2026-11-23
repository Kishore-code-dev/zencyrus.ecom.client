import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/config/api";
import { useApiAction } from "@/hooks/use-api-action";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { useCallback, useTransition, type ComponentProps } from "react";
import { toast } from "sonner";

interface ChangePasswordBtnProps extends ComponentProps<typeof Button>
{
  email: string;
  label: string;
}

type Props = {
  onCancel?: () => void;
};


export default function ChangePasswordBtn({
  size = "lg",
  variant = "destructive",
  email = "",
  label = "",
  className,
  onCancel,
  ...props
}: ChangePasswordBtnProps & Props)
{
  const [loading, startTransition] = useTransition();

  const { apiActionAsync } = useApiAction();

  const onClick = useCallback(() =>
  {
    startTransition(async () =>
    {
      try
      {
        const response = await api.post(`/auth/change-password`, { email });
        if (response.status == 200)
        {
          toast.success("A link has been sent to your registered email address.");
        }
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response);
        }
      }
      finally
      {
        if (onCancel)
        {
          onCancel()
        }
      }
    });
  }, [email]);

  return (
    <Button
      size={size}
      variant={variant}
      onClick={onClick}
      disabled={loading}
      className={cn("ml-auto rounded-md", className)}
      {...props}
    >
      <span>{label}</span>
      {loading && <Spinner />}
    </Button>
  );
}
