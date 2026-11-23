import { useNavigate } from "react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import {
  UserPlus,
  MailCheck,
  FileCheck,
  Image,
  BadgeCheck,
  ShoppingCart,
} from "lucide-react";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormContext } from "react-hook-form";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadList,
} from "@/components/ui/file-upload";
import { X } from "lucide-react";
import {
  FileUploadItemPreview,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
} from "@/components/ui/file-upload";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import AddressPicker from "@/components/address-picker/address-picker";
import PasswordInput from "@/components/ui/password-input";
import { useTheme } from "@/hooks/use-theme";
import { Separator } from "@/components/ui/separator";

const optionItemSchmea = z.object({
  label: z.string(),
  value: z.string(),
});

const formSchema = z
  .object({
    fullName: z.string().min(3, "Full name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    mobileNo: z
      .string()
      .min(1, "Mobile number is required")
      .max(13, "Enter the valid mobile no"),
    companyName: z.string().min(2, "Company name is required"),
    gstNumber: z
      .string()
      .optional()
      .refine((val) => !val || val.length === 15, {
        message: "GST number must be 15 characters",
      })
      .refine(
        (val) =>
          !val || /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(val),
        { message: "Invalid GST number format" },
      ),
    addressLine1: z.string().min(5, "Address1 is required"),
    addressLine2: z.string().optional(),
    pincodeId: optionItemSchmea.refine((item) => !!item.value, {
      message: "Pincode is required",
    }),
    countryId: optionItemSchmea.refine((item) => !!item.value, {
      message: "Country is required",
    }),
    districtId: optionItemSchmea.refine((item) => !!item.value, {
      message: "District is required",
    }),
    stateId: optionItemSchmea.refine((item) => !!item.value, {
      message: "State is required",
    }),
    cityId: optionItemSchmea.refine((item) => !!item.value, {
      message: "City is required",
    }),
    secondaryMobileNo: z.string().optional(),
    shopBannerFile: z.array(
      z
        .instanceof(File, { message: "Company Banner is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Banner max size is 5MB",
        }),
    ),
    visitingCardFile: z.array(
      z
        .instanceof(File, { message: "Visiting Card is required" })
        .refine((file) => file.size <= 5 * 1024 * 1024, {
          message: "Visiting Card max size is 5MB",
        }),
    ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      mobileNo: "+91",
      companyName: "",
      gstNumber: "",
      addressLine1: "",
      addressLine2: "",
      pincodeId: { label: "", value: "" },
      countryId: { label: "", value: "" },
      districtId: { label: "", value: "" },
      stateId: { label: "", value: "" },
      cityId: { label: "", value: "" },
      shopBannerFile: [],
      visitingCardFile: [],
    },
  });

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2  lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-4xl">
          <Button
            variant="ghost"
            className="mb-8"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>

          <div className="mb-2">
            <div className="flex items-center gap-3">
              <img
                loading="lazy"
                decoding="async"
                src={
                  theme == "light"
                    ? "/images/logo.light.png"
                    : "/images/logo.dark.png"
                }
                alt="Shree Maruthi Printers"
                className="size-32 w-auto m-auto"
              />
              {/* <h1 className="font-display text-xl font-bold">
                Shree Maruthi Printers
              </h1> */}
            </div>
            <h2 className="mt-8 font-display text-2xl font-bold">Register</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/auth/login">
                <button
                  type="button"
                  className="font-medium text-accent hover:underline"
                >
                  Login
                </button>
              </Link>
            </p>
          </div>

          <div className="p-0">
            <div className="grid p-0 max-w-4xl">
              <Form {...form}>
                <RegisterForm />
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
      </div>

      {/* Right Panel - Visual */}

      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-linear-to-br from-primary to-primary/80 dark:from-[#229186] dark:to-[#229186]/80">
          <div className="flex h-full flex-col items-center justify-start pt-40 p-12 text-center">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-soft">
              <h3 className="font-display text-xl font-bold mb-6">
                6 Easy Steps to register and start ordering with us
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      1. Complete the Registration Form
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Enter company name, email ID and GST number to create your
                      account.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <MailCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      2. Email Address Verification
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Verify your email address using the OTP sent to your
                      registered email.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <FileCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">3. GST Number Validation</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Admin will verify the submitted GST number for
                      authenticity.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <Image className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      4. Alternative Business Proof Submission
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload shop banner and visiting card photo for manual
                      verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <BadgeCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      5. Administrative Review and Approval
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      Admin will approve or reject your registration after
                      verification.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-semibold">
                      6. Access to Seamless Ordering
                    </h4>
                    <p className="text-sm  text-muted-foreground mt-1">
                      After approval, enjoy hassle-free shopping and place your
                      orders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterForm() {
  const form = useFormContext<z.infer<typeof formSchema>>();
  const { signUpAsync } = useAuth();

  return (
    <form
      onSubmit={form.handleSubmit(signUpAsync)}
      className="w-full"
      noValidate
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        <FormField
          name="companyName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 min-w-0">
              <FormLabel className="text-sm" htmlFor="companyName">
                Company name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="companyName"
                  type="text"
                  autoComplete="organization"
                  placeholder="Enter your company name"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="gstNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 min-w-0">
              <FormLabel className="text-sm" htmlFor="gstNumber">
                GST number
              </FormLabel>
              <FormControl>
                <Input
                  id="gstNumber"
                  type="text"
                  autoCapitalize="characters"
                  placeholder="Enter 15-digit GST number"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Separator className="my-1 sm:my-2 w-full col-span-full" />

        <FormField
          name="fullName"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 col-span-full min-w-0">
              <FormLabel className="text-sm" htmlFor="fullName">
                Full name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 col-span-full min-w-0">
              <FormLabel className="text-sm" htmlFor="email">
                Email address <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="mobileNo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 min-w-0">
              <FormLabel className="text-sm" htmlFor="mobileNo">
                Mobile no <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  id="mobileNo"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="Enter 10-digit mobile number"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="secondaryMobileNo"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 min-w-0">
              <FormLabel className="text-sm" htmlFor="secondaryMobileNo">
                Secondary mobile no
              </FormLabel>
              <FormControl>
                <Input
                  id="secondaryMobileNo"
                  type="tel"
                  inputMode="numeric"
                  placeholder="Enter 10-digit mobile number"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Separator className="my-1 sm:my-2 w-full col-span-full" />

        <AddressPicker className="col-span-full min-w-0" />

        <FormField
          name="shopBannerFile"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2 min-w-0">
              <Label>
                Upload company banner{" "}
                <span className="text-destructive">*</span>
              </Label>

              <FileUpload
                accept=".jpg,.jpeg,.png,.pdf"
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
                value={field.value}
                onValueChange={field.onChange}
                onFileReject={(file, message) =>
                  toast.error(message, {
                    description: file.name,
                  })
                }
              >
                <FileUploadDropzone className="min-h-32 sm:min-h-37.5 px-3">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="size-6 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      <span className="hidden sm:inline">
                        Drag & drop banner here
                      </span>
                      <span className="sm:hidden">Tap to upload banner</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG or PDF, max 5MB
                    </p>
                  </div>
                </FileUploadDropzone>

                <FileUploadList>
                  {Array.isArray(field.value) &&
                    field.value.map((file, index) => (
                      <FileUploadItem
                        key={index}
                        value={file}
                        className="min-w-0"
                      >
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata className="min-w-0 truncate" />
                        <FileUploadItemDelete asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            aria-label="Remove file"
                          >
                            <X />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                </FileUploadList>
              </FileUpload>

              <FormMessage className="text-xs" />
            </div>
          )}
        />
        <FormField
          name="visitingCardFile"
          control={form.control}
          render={({ field }) => (
            <div className="space-y-2 min-w-0">
              <Label>
                Upload visiting card <span className="text-destructive">*</span>
              </Label>

              <FileUpload
                maxFiles={1}
                maxSize={5 * 1024 * 1024}
                value={field.value}
                onValueChange={field.onChange}
                onFileReject={(file, message) =>
                  toast.error(message, {
                    description: file.name,
                  })
                }
              >
                <FileUploadDropzone className="min-h-32 sm:min-h-37.5 px-3">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <Upload className="size-6 text-muted-foreground" />
                    <p className="text-sm font-medium">
                      <span className="hidden sm:inline">
                        Drag & drop visiting card here
                      </span>
                      <span className="sm:hidden">
                        Tap to upload visiting card
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Max size 5MB
                    </p>
                  </div>
                </FileUploadDropzone>

                <FileUploadList>
                  {Array.isArray(field.value) &&
                    field.value.map((file, index) => (
                      <FileUploadItem
                        key={index}
                        value={file}
                        className="min-w-0"
                      >
                        <FileUploadItemPreview />
                        <FileUploadItemMetadata className="min-w-0 truncate" />
                        <FileUploadItemDelete asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            aria-label="Remove file"
                            onClick={() => field.onChange(undefined)}
                          >
                            <X />
                          </Button>
                        </FileUploadItemDelete>
                      </FileUploadItem>
                    ))}
                </FileUploadList>
              </FileUpload>

              <FormMessage className="text-xs" />
            </div>
          )}
        />

        <Separator className="my-1 sm:my-2 w-full col-span-full" />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 min-w-0">
              <FormLabel className="text-sm" htmlFor="password">
                Password <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  placeholder="......"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem className="grid gap-2 sm:gap-3 min-w-0">
              <FormLabel className="text-sm" htmlFor="confirmPassword">
                Confirm password <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <PasswordInput
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="......"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div className="col-span-full mt-2 sm:mt-4">
          <Button
            type="submit"
            className="w-full h-11 sm:h-10"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// function RegisterForm()
// {
//   const form = useFormContext<z.infer<typeof formSchema>>();
//   const { signUpAsync } = useAuth()

//   return (
//     <form
//       onSubmit={form.handleSubmit(signUpAsync)}
//     >
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//         <FormField
//           name="companyName"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem className="grid gap-3">
//               <div className="flex items-center">
//                 <FormLabel className="text-sm" htmlFor="companyName">
//                   Company name <span className="text-destructive">*</span>
//                 </FormLabel>
//               </div>
//               <FormControl>
//                 <Input id="companyName" type="text" placeholder="Enter your company name" {...field} />
//               </FormControl>
//               <FormMessage className="text-xs" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           name="gstNumber"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem className="grid gap-3">
//               <div className="flex items-center">
//                 <FormLabel className="text-sm" htmlFor="gstNumber">
//                   GST number
//                 </FormLabel>
//               </div>
//               <FormControl>
//                 <Input
//                   id="gstNumber"
//                   type="text"
//                   placeholder="Enter 15-digit GST number"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage className="text-xs" />
//             </FormItem>
//           )}
//         />
//         <Separator className="my-2 w-full col-span-2" />
//         <div className="col-span-2">
//           <FormField
//             name="fullName"
//             control={form.control}
//             render={({ field }) => (
//               <FormItem className="grid gap-3">
//                 <FormLabel className="text-sm" htmlFor="fullName">
//                   Full name <span className="text-destructive">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     id="Full Name"
//                     type="text"
//                     placeholder="Enter your full name"
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage className="text-xs" />
//               </FormItem>
//             )}
//           />
//         </div>
//         <FormField
//           name="email"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem className="grid gap-3 col-span-2">
//               <FormLabel className="text-sm" htmlFor="email">
//                 Email address
//                 <span className="text-destructive">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   id="Email address"
//                   type="email"
//                   placeholder="Enter your email address"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage className="text-xs" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           name="mobileNo"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem className="grid gap-3">
//               <FormLabel className="text-sm" htmlFor="mobileNo">
//                 Mobile no<span className="text-destructive">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input id="Mobile no" type="text" placeholder="Enter 10-digit mobile number" {...field} />
//               </FormControl>
//               <FormMessage className="text-xs" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           name="secondaryMobileNo"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem className="grid gap-3">
//               <FormLabel className="text-sm" htmlFor="mobileNo">
//                 Secondary Mobile no
//               </FormLabel>
//               <FormControl>
//                 <Input id="Mobile no" type="text" placeholder="Enter 10-digit mobile number" {...field} />
//               </FormControl>
//               <FormMessage className="text-xs" />
//             </FormItem>
//           )}
//         />
//         <Separator className="my-2 w-full col-span-2" />
//         <AddressPicker className="col-span-2" />
//         <FormField
//           name="shopBannerFile"
//           control={form.control}
//           render={({ field }) =>
//           {
//             return (
//               <div className="space-y-2">
//                 <Label>Upload Company Banner <span className="text-destructive">*</span></Label>

//                 <FileUpload
//                   accept=".jpg,.jpeg,.png,.pdf"
//                   maxFiles={1}
//                   maxSize={5 * 1024 * 1024}
//                   value={field.value}
//                   onValueChange={field.onChange}
//                   onFileReject={(file, message) =>
//                     toast.error(message, {
//                       description: file.name,
//                     })
//                   }
//                 >
//                   <FileUploadDropzone className="min-h-37.5">
//                     <div className="flex flex-col items-center gap-2 text-center">
//                       <Upload className="size-6 text-muted-foreground" />
//                       <p className="text-sm font-medium">
//                         Drag & drop banner here
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         Max size 5MB
//                       </p>
//                     </div>
//                   </FileUploadDropzone>

//                   <FileUploadList>
//                     {Array.isArray(field.value) &&
//                       field.value.map((file, index) => (
//                         <FileUploadItem key={index} value={file}>
//                           <FileUploadItemPreview />
//                           <FileUploadItemMetadata />
//                           <FileUploadItemDelete asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="size-7"
//                             >
//                               <X />
//                             </Button>
//                           </FileUploadItemDelete>
//                         </FileUploadItem>
//                       ))}
//                   </FileUploadList>
//                 </FileUpload>

//                 <FormMessage />
//               </div>
//             );
//           }}
//         />
//         <FormField
//           name="visitingCardFile"
//           control={form.control}
//           render={({ field }) =>
//           {
//             return (
//               <div className="space-y-2">
//                 <Label>Upload Visiting Card <span className="text-destructive">*</span></Label>

//                 <FileUpload
//                   maxFiles={1}
//                   maxSize={5 * 1024 * 1024}
//                   value={field.value}
//                   onValueChange={field.onChange}
//                   onFileReject={(file, message) =>
//                     toast.error(message, {
//                       description: file.name,
//                     })
//                   }
//                 >
//                   <FileUploadDropzone className="min-h-37.5">
//                     <div className="flex flex-col items-center gap-2 text-center">
//                       <Upload className="size-6 text-muted-foreground" />
//                       <p className="text-sm font-medium">
//                         Drag & drop visiting card here
//                       </p>
//                       <p className="text-xs text-muted-foreground">
//                         Max size 5MB
//                       </p>
//                     </div>
//                   </FileUploadDropzone>

//                   <FileUploadList>
//                     {Array.isArray(field.value) &&
//                       field.value.map((file, index) => (
//                         <FileUploadItem key={index} value={file}>
//                           <FileUploadItemPreview />
//                           <FileUploadItemMetadata />
//                           <FileUploadItemDelete asChild>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               className="size-7"
//                               onClick={() => field.onChange(undefined)}
//                             >
//                               <X />
//                             </Button>
//                           </FileUploadItemDelete>
//                         </FileUploadItem>
//                       ))}
//                   </FileUploadList>
//                 </FileUpload>

//                 <FormMessage />
//               </div>
//             );
//           }}
//         />
//         <Separator className="my-2 w-full col-span-2" />
//         <FormField
//           name="password"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem className="grid gap-3">
//               <div className="flex items-center">
//                 <FormLabel className="text-sm" htmlFor="password">
//                   Password <span className="text-destructive">*</span>
//                 </FormLabel>
//               </div>
//               <FormControl>
//                 <PasswordInput
//                   id="password"
//                   placeholder="......"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage className="text-xs" />
//             </FormItem>
//           )}
//         />
//         <FormField
//           name="confirmPassword"
//           control={form.control}
//           render={({ field }) => (
//             <FormItem className="grid gap-3">
//               <div className="flex items-center">
//                 <FormLabel className="text-sm" htmlFor="confirmPassword">
//                   Confirm password <span className="text-destructive">*</span>
//                 </FormLabel>
//               </div>
//               <FormControl>
//                 <PasswordInput
//                   id="confirmPassword"
//                   placeholder="......"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage className="text-xs" />
//             </FormItem>
//           )}
//         />

//         <div className="sm:col-span-2 mt-4">
//           <Button
//             type="submit"
//             className="w-full"
//             disabled={form.formState.isSubmitting}
//           >
//             {form.formState.isSubmitting ?
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Submitting...
//               </>
//               : "Create Account"}
//           </Button>
//         </div>
//       </div>
//     </form>
//   );
// }
