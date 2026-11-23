import { useState } from 'react'
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '../ui/card'
import { Landmark, Plus, QrCode, Smartphone, Upload, Wallet, X, Zap } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { z } from 'zod';
import { useForm, useWatch } from 'react-hook-form'
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '../ui/form'
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from '../ui/input-group'
import { FileUpload, FileUploadDropzone, FileUploadItem, FileUploadItemDelete, FileUploadItemMetadata, FileUploadItemPreview, FileUploadList } from '../ui/file-upload'
import { cn } from '@/lib/utils'
import PaymentQRCode from './PaymentQRCode'
import PaymentNEFT from './PaymentNEFT'
import { api } from '@/config/api'
import { useApiAction } from '@/hooks/use-api-action'
import { AxiosError } from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'

const quickAmounts = [100, 250, 500, 750, 1000, 2000];

const PaymentMode =
  [
    {
      label: "CC Avenue",
      value: "6e41261d-2f07-880f-e86e-867213454d82",
      icon: Zap,
      btnIcon: QrCode,
      btnLabel: "Show QR code to pay Rs ",
      modeUI: PaymentQRCode,
      showProofForm: false
    },
    {
      label: "Challan Upload",
      value: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c",
      icon: Smartphone,
      btnIcon: QrCode,
      btnLabel: "Show QR code to pay Rs ",
      modeUI: PaymentQRCode,
      showProofForm: true
    },
    {
      label: "NEFT / RTGS",
      value: "f4d52b0d-a4fa-4dbb-b855-c215ac55e509",
      icon: Wallet,
      btnIcon: Landmark,
      btnLabel: "View bank details for Rs ",
      modeUI: PaymentNEFT,
      showProofForm: true
    }
  ]
const formSchema = z.object({
  paymentTypeId: z.string(),
  amount: z.coerce.number<number>()
    .min(100, 'Minimum top-up amount is Rs 100')
    .max(100000, 'Maximum top-up amount is Rs 1,00,000'),
  transacationReferenceNo: z.string().optional(),
  proofDocument: z.array(z.custom<File>()).optional()
}).superRefine((data, ctx) =>
{
  const isCCAvenue = data.paymentTypeId === "6e41261d-2f07-880f-e86e-867213454d82";

  if (!isCCAvenue)
  {
    if (!data.transacationReferenceNo || data.transacationReferenceNo.trim() === "")
    {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Transaction reference number is required",
        path: ["transacationReferenceNo"]
      });
    }

    if (!data.proofDocument || data.proofDocument.length < 1)
    {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Transaction proof is required",
        path: ["proofDocument"]
      });
    }
  }

  // GPay/UPI limit: ₹1,00,000 per transaction (RBI guideline)
  const isGPay = data.paymentTypeId === "f7ba2a38-0191-ab37-c57d-c65e0d95c45c";
  if (isGPay && data.amount > 100000)
  {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "GPay/UPI payments are limited to Rs 1,00,000 per transaction",
      path: ["amount"]
    });
  }
});

type FormSchemaType = z.infer<typeof formSchema>

const AddFunds = () =>
{
  const [isShow, setShow] = useState<boolean>(false)
  const { apiActionAsync } = useApiAction()
  const navigate = useNavigate();
  const form = useForm<FormSchemaType>({
    defaultValues: {
      amount: 0,
      proofDocument: [],
      transacationReferenceNo: ""
    },
    resolver: zodResolver(formSchema)
  })

  const { control, handleSubmit, formState, setError, reset } = form

  const amount = useWatch({
    control,
    name: "amount"
  })

  const paymentTypeId = useWatch({
    control,
    name: "paymentTypeId"
  })


  const handleOnSubmit = async (payload: FormSchemaType) =>
  {
    try
    {

      const url = payload.paymentTypeId === "6e41261d-2f07-880f-e86e-867213454d82" ? `wallettopups/addfund/ccavenue` : `wallettopups/addfund`

      const response = await api.post(
        url,
        {
          ...payload,
          proofDocument: Array.isArray(payload.proofDocument) && payload.proofDocument.length > 0 ? payload.proofDocument[0] : null
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })

      if (payload.paymentTypeId == "6e41261d-2f07-880f-e86e-867213454d82")
      {
        const { encryptedData, accessCode, paymentUrl } = response.data
        // Clean up any previous form
        const old = document.getElementById('__cca_form');
        if (old) old.remove();

        const form = document.createElement('form');
        form.id = '__cca_form';
        form.method = 'POST';
        form.action = paymentUrl;
        form.style.display = 'none';

        const enc = document.createElement('input');
        enc.type = 'hidden';
        enc.name = 'encRequest';
        enc.value = encryptedData;

        const code = document.createElement('input');
        code.type = 'hidden';
        code.name = 'access_code';
        code.value = accessCode;

        form.appendChild(enc);
        form.appendChild(code);
        document.body.appendChild(form);
        form.submit();
        reset()
        return;
      }

      if (response.status == 200 && response.data)
      {
        reset()
        await apiActionAsync(response)
        navigate(0)
      }
    } catch (error)
    {
      if (error instanceof AxiosError && error.response)
      {
        await apiActionAsync(error.response)
      }
    }
  };

  return (
    <Form {...form}>
      <form className='h-fit' onSubmit={handleSubmit(handleOnSubmit)}>
        <Card className='min-h-fit'>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Funds
            </CardTitle>
            <CardDescription>Top up your wallet balance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 h-fit">
            <FormField
              control={control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupAddon>
                        <InputGroupText>Rs</InputGroupText>
                      </InputGroupAddon>
                      <InputGroupInput
                        type="number"
                        placeholder="0.00"
                        {...field}
                      />
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="amount">Amount</FormLabel>
                  <div className="grid grid-cols-3 gap-2">
                    {quickAmounts.map((value) => (
                      <Button
                        key={value}
                        variant={amount == value ? 'default' : 'outline'}
                        size="sm"
                        type='button'
                        onClick={() => field.onChange(value)}
                      >
                        Rs{value}
                      </Button>
                    ))}
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name='paymentTypeId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment</FormLabel>
                  <FormItem className='grid md:grid-cols-3 gap-2.5'>
                    {PaymentMode.map((mode) => (
                      <Button
                        key={mode.value}
                        variant={field.value == mode.value ? "default" : "outline"}
                        type='button'
                        disabled={amount < 100}
                        className={cn(
                          'h-24 w-full border border-border rounded-lg cursor-pointer flex flex-col items-center justify-center gap-2.5',
                          // field.value === mode.value && 'border-primary text-primary',
                          amount == 0 && "cursor-not-allowed"
                        )}
                        onClick={() => field.onChange(mode.value)}
                      >
                        <mode.icon />
                        <span className='text-xs'>{mode.label}</span>
                      </Button>
                    ))}
                  </FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
            {PaymentMode.map(Mode =>
            {
              if (Mode.value == paymentTypeId && Mode.showProofForm)
              {
                return (
                  <div className='grid grid-cols-1 gap-2.5'>
                    {!isShow && (
                      <Button className='w-full' type='button' onClick={() => setShow(true)}>
                        <Mode.btnIcon />
                        {Mode.btnLabel}
                        {amount}
                      </Button>
                    )}
                    {isShow && (
                      <>
                        <Mode.modeUI />
                        <FormField
                          control={control}
                          name='transacationReferenceNo'
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Transaction Reference No (UTR) <span className='text-destructive'>*</span></FormLabel>
                              <FormControl>
                                <Input type="text" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          name="proofDocument"
                          control={control}
                          render={({ field }) =>
                          {
                            return (
                              <div className="space-y-2">
                                <FormLabel>Upload Proof <span className='text-destructive'>*</span></FormLabel>

                                <FileUpload
                                  accept=".jpg,.jpeg,.png,.pdf"
                                  maxFiles={1}
                                  maxSize={5 * 1024 * 1024}
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  onFileReject={(_, message) =>
                                    setError("proofDocument", { message })
                                  }
                                >
                                  {Array.isArray(field.value) && field.value.length == 0 && (
                                    <FileUploadDropzone className="min-h-37.5">
                                      <div className="flex flex-col items-center gap-2 text-center">
                                        <Upload className="size-6 text-muted-foreground" />
                                        <p className="text-sm font-medium">
                                          Drag & drop here
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Max size 5MB
                                        </p>
                                      </div>
                                    </FileUploadDropzone>
                                  )}
                                  <FileUploadList>
                                    {Array.isArray(field.value) &&
                                      field.value.map((file, index) => (
                                        <FileUploadItem key={index} value={file}>
                                          <FileUploadItemPreview />
                                          <FileUploadItemMetadata />
                                          <FileUploadItemDelete asChild>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="size-7"
                                            >
                                              <X />
                                            </Button>
                                          </FileUploadItemDelete>
                                        </FileUploadItem>
                                      ))}
                                  </FileUploadList>
                                </FileUpload>
                                <FormMessage />
                              </div>
                            );
                          }}
                        />
                        <Button variant='outline' type='reset' onClick={() =>
                        {
                          reset()
                          setShow(false)
                        }}>
                          Cancel
                        </Button>
                      </>
                    )}
                  </div>
                )
              }
              return null
            })}
            <Button
              variant="default"
              className="w-full"
              type='submit'
              disabled={formState.isSubmitting || amount == 0}
            >
              Add Rs {amount}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Form >
  )
}

export default AddFunds