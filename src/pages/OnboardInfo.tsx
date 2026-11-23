import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, MailCheck } from "lucide-react";
import { useSearchParams } from "react-router";

const OnboardInfo = () =>
{

    const [searchParams] = useSearchParams();

    const name = searchParams.get("name");
    const email = searchParams.get("email");
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/40 p-6">
            <Card className="w-full max-w-lg shadow-lg border">

                <CardHeader className="text-center space-y-3">
                    <div className="flex justify-center">
                        <div className="p-3 rounded-full bg-primary/10">
                            <MailCheck className="h-8 w-8 text-primary" />
                        </div>
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Verify Your Email
                    </CardTitle>

                    <CardDescription className="text-sm">
                        Please check your inbox to activate your account
                    </CardDescription>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                    <p className="text-base">
                        Dear <span className="font-semibold">{name}</span>,
                    </p>

                    <p className="text-muted-foreground">
                        A verification link has been sent to
                    </p>

                    <p className="font-medium text-primary break-all">
                        {email}
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Please click the link in the email to verify your account and
                        continue using our platform.
                    </p>
                </CardContent>
                <div className="flex justify-center pb-6">
                    <a href="/" className="flex items-center gap-2 text-primary underline hover:text-primary/90">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </a>
                </div>
            </Card>
        </div>
    );
};

export default OnboardInfo;