import { useMemo, useState, useTransition } from "react";
import { InfoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Combobox } from "@/components/ui/combobox";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import
{
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { api } from "@/config/api";
import { useApiAction } from "@/hooks/use-api-action";
import { AxiosError } from "axios";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import
{
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox";
import type { OptionItem, PriceOptionItem } from "@/types/common";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Filter } from "@/types/filter";
import { Spinner } from "@/components/ui/spinner";
import { dimensionOptionItem, optionItemSchema } from "@/config/schema";
import { useRef } from "react";
import { ComboboxGroup } from "@/components/ui/combobox-group";
import type { QuoteData } from "@/types/custom-job";
import { useParams } from "react-router";
import { Separator } from "@/components/ui/separator";
const printingSideOptionItem: OptionItem[] = [
    { label: "Single", value: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c" },
    { label: "Front & Back", value: "f4d52b0d-a4fa-4dbb-b855-c215ac55e509" },
]
const formSchema = z.object({
    id: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    customerId: optionItemSchema,
    customJobId: z.string().optional(),
    finishSizeId: dimensionOptionItem.refine(item => !!item.value, {
        message: "Opening size is required"
    }),
    instrucation: z.string().optional(),
    quantity: z.coerce.number<number>().min(1, "Total printing quantity is required"),
    materialSupplyId: optionItemSchema.refine(item => !!item.value, {
        message: "Material supply is required"
    }),
    requiredDate: z.coerce.date<Date>(),
    plateSupplyId: optionItemSchema.refine(item => !!item.value, {
        message: "Plate supply is required"
    }),
    gsmId: optionItemSchema.refine(item => !!item.value, {
        message: "Paper GSM is required"
    }),
    mediaId: optionItemSchema.refine(item => !!item.value, {
        message: "Paper type is required"
    }),
    printingSideId: optionItemSchema.refine(item => !!item.value, {
        message: "Number of side is required"
    }),
    frontColorId: optionItemSchema,
    backColorId: optionItemSchema,
    laminationId: optionItemSchema,
    laminationSide: optionItemSchema,
    laminationQuantity: z.coerce.number<number>(),
    laminationHeight: z.coerce.number<number>(),
    laminationWidth: z.coerce.number<number>(),
    laminationMeasurementUnit: z.string().optional(),
    otherSpecifications: z.array(z.string()),
    machineId: optionItemSchema,
    isLaminationEnabled: z.boolean().optional()
})
    .refine((data) =>
    {
        if (data.isLaminationEnabled)
        {
            return data.laminationQuantity <= data.quantity;
        }
        return true;
    }, {
        path: ["laminationQuantity"],
        message: "Lamination quantity must not exceed printing quantity"
    })
    // Single-sided: front color is required
    .refine((data) =>
    {
        if (data.printingSideId.value === "f7ba2a38-0191-ab37-c57d-c65e0d95c45c")
        {
            return !!data.frontColorId.value;
        }
        return true;
    }, {
        path: ["frontColorId"],
        message: "Front color is required for single-sided printing"
    })
    // Double-sided: BOTH front AND back colors are required
    .refine((data) =>
    {
        if (data.printingSideId.value === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")
        {
            return !!data.frontColorId.value;
        }
        return true;
    }, {
        path: ["frontColorId"],
        message: "Front color is required for double-sided printing"
    })
    .refine((data) =>
    {
        if (data.printingSideId.value === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")
        {
            return !!data.backColorId.value;
        }
        return true;
    }, {
        path: ["backColorId"],
        message: "Back color is required for double-sided printing"
    });


type FormSchemaType = z.infer<typeof formSchema>

export default function EnquiryForm()
{
    const { apiActionAsync } = useApiAction()
    const [loading, startTransition] = useTransition()
    const [data, setData] = useState<null | QuoteData>(null)
    const [configuration, setConfiguration] = useState<null | FormSchemaType>()
    const { customJobId = "" } = useParams<Readonly<Partial<{ customJobId: string }>>>()
    const [items, setItems] = useState<PriceOptionItem[]>([])

    const form = useForm<FormSchemaType>({
        defaultValues: {
            id: "",
            description: "",
            title: "",
            customerId: { label: "", value: "" },
            customJobId,
            finishSizeId: { label: "", value: "" },
            quantity: 0,
            materialSupplyId: { label: "GOKUL PRINTERS", value: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c" },
            requiredDate: new Date(),
            plateSupplyId: { label: "GOKUL PRINTERS", value: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c" },
            gsmId: { label: "", value: "" },
            mediaId: { label: "", value: "" },
            printingSideId: { label: "", value: "" },
            frontColorId: { label: "", value: "" },
            backColorId: { label: "", value: "" },
            laminationId: { label: "", value: "" },
            laminationSide: { label: "", value: "" },
            laminationQuantity: 0,
            laminationHeight: 0,
            laminationWidth: 0,
            laminationMeasurementUnit: "",
            otherSpecifications: [],
            isLaminationEnabled: false,
            instrucation: "",
            machineId: {
                label: "",
                value: ""
            }
        },
        mode: "onChange",
        disabled: loading,
        resolver: zodResolver(formSchema)
    })
    const { control, formState, resetField, handleSubmit, setValue } = form
    // const [loading, startTransition] = useTransition()
    // const { apiActionAsync } = useApiAction();
    const gsmId = useWatch({ control, name: "gsmId" })
    const mediaId = useWatch({ control, name: "mediaId" })
    const quantity = useWatch({ control, name: "quantity" });
    const isLaminationQtyInitialized = useRef(false);
    const isLaminationEnabled = useWatch({ control, name: "isLaminationEnabled" });
    const finishSizeId = useWatch({ control, name: "finishSizeId" });
    const printingSideId = useWatch({ control, name: "printingSideId" });


    const mediaFilter = useMemo(() =>
    {
        return [
            {
                id: "gsmId",
                value: {
                    alias: "PM",
                    dataType: "numeric",
                    logic: "AND",
                    matchCase: "=",
                    value: gsmId && gsmId.value ? gsmId.value : ""
                }
            }
        ] as Filter[]
    }, [gsmId])

    const finishSizeIdFilter = useMemo(() =>
    {
        return [
            {
                id: "gsmId",
                value: {
                    alias: "PM",
                    dataType: "numeric",
                    logic: "AND",
                    matchCase: "=",
                    value: gsmId && gsmId.value ? gsmId.value : ""
                }
            },
            {
                id: "mediaId",
                value: {
                    alias: "PM",
                    dataType: "numeric",
                    logic: "AND",
                    matchCase: "=",
                    value: mediaId && mediaId.value ? mediaId.value : ""
                }
            },
        ].filter(x => Boolean(x.value.value)) as Filter[]
    }, [gsmId, mediaId])

    useEffect(() =>
    {
        const fetchOtherSpecs = async () =>
        {
            try
            {
                const response = await api.get(`otherspecifcation/getall`);

                if (response.status === 200)
                {
                    setItems(response.data || []);
                }
            } catch (error)
            {
                toast.error("Failed to load specifications");
            }
        };

        fetchOtherSpecs();
    }, []);

    useEffect(() =>
    {
        if (!gsmId?.value)
        {
            resetField("mediaId");
            resetField("finishSizeId");
        }
    }, [gsmId]);

    useEffect(() =>
    {
        if (!mediaId?.value)
        {
            resetField("finishSizeId");
        }
    }, [mediaId]);

    useEffect(() =>
    {
        if (!isLaminationEnabled && !printingSideId) return;

        if (printingSideId.value === "f7ba2a38-0191-ab37-c57d-c65e0d95c45c")
        {
            setValue("laminationSide", {
                label: "Single",
                value: "f7ba2a38-0191-ab37-c57d-c65e0d95c45c"
            });
        }

        if (printingSideId.value === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")
        {
            setValue("laminationSide", {
                label: "Front & Back",
                value: "f4d52b0d-a4fa-4dbb-b855-c215ac55e509"
            });
        }

    }, [printingSideId, isLaminationEnabled]);

    useEffect(() =>
    {
        if (!isLaminationEnabled) return;
        if (!finishSizeId?.value) return;

        setValue("laminationHeight", finishSizeId.height || 0);
        setValue("laminationWidth", finishSizeId.width || 0);

    }, [finishSizeId, isLaminationEnabled]);

    useEffect(() =>
    {
        if (!isLaminationEnabled)
        {
            isLaminationQtyInitialized.current = false;
            return;
        }
        if (!quantity) return;

        if (!isLaminationQtyInitialized.current)
        {
            setValue("laminationQuantity", Number(quantity));
            isLaminationQtyInitialized.current = true;
        }

    }, [isLaminationEnabled, quantity]);

    // useEffect(() =>
    // {
    //     if (!printingSideId) return;

    //     if (printingSideId.value === "f7ba2a38-0191-ab37-c57d-c65e0d95c45c")
    //     {
    //         resetField("backColorId");
    //     }

    //     if (printingSideId.value === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")
    //     {
    //         resetField("frontColorId");
    //         resetField("backColorId");
    //     }
    // }, [printingSideId]);


    const onSaveEstimateAsync = () =>
    {
        if (configuration && data)
        {
            startTransition(async () =>
            {
                try
                {
                    const response = await api.post(`customquote/create`, {
                        ...configuration,
                        instrucation: configuration.description,
                        paperSizeId: data.materialSize,
                        ReferenceNo: "",
                        printingSideId: configuration.printingSideId,
                        ColorTypeFrontId: configuration.frontColorId,
                        ColorTypeBackId: configuration.backColorId,
                        Instruction: "",
                        TotalAmount: data.totalAmount,
                        OtherSpecificationAmount: data.otherSpecification,
                        LaminationAmount: data.laminationCost,
                        Id: data.customJobId
                    })
                    if (response.status == 200 && response.data)
                    {
                        setConfiguration(null)
                        setData(null)
                        await apiActionAsync(response)
                    }

                } catch (error)
                {
                    if (error instanceof AxiosError && error.response)
                    {
                        await apiActionAsync(error.response)
                    }
                }
            })
        }
    }


    const handleOnSubmitAsync = async (payload: FormSchemaType) =>
    {
        try
        {
            const response = await api.post(`customquote/getestimate`, {
                OtherSpecifications: payload.otherSpecifications,
                Quantity: payload.quantity,
                CustomerId: payload.customerId.value,
                GsmId: payload.gsmId.value,
                MediaId: payload.mediaId.value,
                LaminationId: payload.laminationId.value,
                FinishSizeId: payload.finishSizeId.value,
                MachineId: payload.machineId.value,
                LaminationQty: payload.laminationQuantity,
                FrontColorId: payload.frontColorId.value,
                BackColorId: payload.backColorId.value,
                PrintingSideId: payload.printingSideId.value
            })
            if (response.status == 200 && response.data)
            {
                const estimate = response.data as QuoteData
                setData(estimate)
                setValue("machineId", estimate.machineId)
                setConfiguration({ ...payload, machineId: estimate.machineId });
            }
        } catch (error)
        {
            if (error instanceof AxiosError && error.response)
            {
                await apiActionAsync(error.response)
            }

        }
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(handleOnSubmitAsync)} className="flex flex-col space-y-6 px-50">

                <section className="space-y-2.5 ">
                    <h2 className="text-2xl font-bold md:col-span-3">Primary Details</h2>
                    <div className="grid md:grid-cols-1 gap-2.5">
                        <FormField
                            name="title"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm" htmlFor="quantity">
                                        Item Title{" "}
                                        <span className="text-destructive">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            id="title"
                                            type="text"
                                            placeholder="Enter Item Title"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                    </div>
                    <FormField
                        control={form.control}
                        name="instrucation"
                        render={({ field }) => (
                            <FormItem className="col-span-3">
                                <FormLabel className="text-sm">Item Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Add any other specifications or requirements"
                                        rows={4}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </section>


                <section className="space-y-4">
                    <h2 className="text-2xl font-bold md:col-span-3">Specifications</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <FormField
                            name="gsmId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">paper - GSM</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            value={field.value}
                                            onValueChange={(value) =>
                                            {

                                                if (value && value.value !== field.value)
                                                {
                                                    resetField("mediaId")
                                                    resetField("finishSizeId")

                                                }

                                                field.onChange(value)
                                            }}
                                            placeholder="Select paper - GSM"
                                            mode="dynamic"
                                            path="customquote/gsm/search?searchString"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="mediaId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Paper - Type</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            value={field.value}
                                            onValueChange={(value) =>
                                            {

                                                if (value && value.value !== field.value)
                                                {
                                                    resetField("finishSizeId")

                                                }

                                                field.onChange(value)
                                            }}
                                            placeholder="Select Paper Type"
                                            mode="dynamic"
                                            path="customquote/media/search?searchString"
                                            className="w-2xl"
                                            cascadeFilter={mediaFilter}
                                            disabled={!gsmId?.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="finishSizeId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Opening Size<span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <ComboboxGroup
                                            value={field.value as OptionItem}
                                            onValueChange={field.onChange}
                                            placeholder="Select Opening Size"
                                            mode="dynamic"
                                            path="customquote/papersize/search?searchString"
                                            cascadeFilter={finishSizeIdFilter}
                                            disabled={!mediaId?.value}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        name="printingSideId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm">Printing side</FormLabel>
                                <Select
                                    value={field.value?.value}
                                    onValueChange={(val) =>
                                    {
                                        const selected = printingSideOptionItem.find(i => i.value === val);
                                        field.onChange(selected);
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select the printing side" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {printingSideOptionItem.map(item => (
                                            <SelectItem key={item.value} value={item.value}>
                                                {item.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            name="frontColorId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Color Type Front</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select Color Type Front"
                                            mode="dynamic"
                                            path="colors/search?searchString"
                                            disabled={!(printingSideId?.value === "f7ba2a38-0191-ab37-c57d-c65e0d95c45c" || printingSideId?.value === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="backColorId"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-sm">Color Type Back</FormLabel>
                                    <FormControl>
                                        <Combobox
                                            value={field.value}
                                            onValueChange={field.onChange}
                                            placeholder="Select Color Type Back"
                                            mode="dynamic"
                                            path="colors/search?searchString"
                                            disabled={!(printingSideId?.value === "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="col-span-2">
                            <FormField
                                name="quantity"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm" htmlFor="quantity">
                                            Total Printing Quantity{" "}
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="quantity"
                                                type="number"
                                                placeholder="Enter Total Printing Quantity"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                    </div>
                    <div className="space-y-4 col-span-3">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold">Is Lamination Enabled?</h2>
                            <Checkbox
                                checked={isLaminationEnabled}
                                onCheckedChange={(checked) =>
                                {
                                    form.setValue("isLaminationEnabled", !!checked)

                                    if (!checked)
                                    {
                                        form.setValue("laminationId", { label: "", value: "" })
                                        form.setValue("laminationSide", { label: "", value: "" })
                                        form.setValue("laminationHeight", 0)
                                        form.setValue("laminationWidth", 0)
                                        form.setValue("laminationMeasurementUnit", "")
                                    }
                                }}
                            />

                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <FormField
                                name="laminationId"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Lamination type</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                placeholder="Select Type"
                                                mode="dynamic"
                                                path="lamination/search?searchString"
                                                disabled={!isLaminationEnabled}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="laminationSide"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm">Lamination side</FormLabel>
                                        <FormControl>
                                            <Combobox
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                placeholder="Select Side"
                                                mode="dynamic"
                                                path="printingside/search?searchString"
                                                disabled
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="laminationQuantity"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm" htmlFor="quantity">
                                            Lamination Quantity{" "}
                                            <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                id="laminationQuantity"
                                                type="text"
                                                placeholder="Enter Lamination Quantity"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormItem>
                            <FormLabel className="text-sm">
                                Lamination Size <span className="text-xs flex"><span className="text-destructive">*</span></span>
                            </FormLabel>
                            <div className="grid grid-cols-3 gap-2.5">
                                <FormField
                                    name="laminationHeight"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="laminationHeight"
                                                    type="text"
                                                    placeholder="Height"
                                                    {...field}
                                                    disabled={!isLaminationEnabled}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />


                                <FormField
                                    name="laminationWidth"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    id="laminationWidth"
                                                    type="text"
                                                    placeholder="Width"
                                                    {...field}
                                                    disabled={!isLaminationEnabled}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    name="laminationMeasurementUnit"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem className="w-20">
                                            <FormControl>
                                                <Input
                                                    id="laminationMeasurementUnit"
                                                    type="text"
                                                    placeholder="MM"
                                                    {...field}
                                                    readOnly
                                                    className="pointer-events-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                                    disabled={!isLaminationEnabled}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormItem>
                    </div>
                </section>

                <section className="space-y-6 flex-row md:col-span-3">
                    <h2 className="text-2xl font-bold">Other Specifications</h2>
                    <FormField
                        control={form.control}
                        name="otherSpecifications"
                        render={({ field }) => (
                            <FormItem>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-3">
                                    {items.map((spec) => (
                                        <FormItem key={spec.value} className="flex flex-row items-center">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value.some(value => value == spec.value)}
                                                    onCheckedChange={(checked) =>
                                                    {
                                                        if (checked)
                                                        {
                                                            field.onChange([...field.value, spec.value]);
                                                        } else
                                                        {
                                                            field.onChange(field.value.filter((value: string) => value != spec.value));
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm">{spec.label}</FormLabel>
                                        </FormItem>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </section>
                <Button
                    type="submit"
                    size="lg"
                    disabled={formState.isSubmitting}
                    className="ml-auto my-2.5">Get estimate {formState.isSubmitting && <Spinner />}
                </Button>
            </form>
            {data && (
                <AlertDialog open={!!data}>
                    <AlertDialogContent className="overflow-hidden p-0 max-w-sm">
                        {/* Header */}
                        <div className="px-6 pt-6 pb-4 border-b border-border">
                            <AlertDialogTitle className="text-base font-semibold tracking-tight">
                                Order Summary
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm text-muted-foreground mt-0.5">
                                Review your estimate before placing an order.
                            </AlertDialogDescription>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            {/* Total Amount Row */}
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Estimated total</span>
                                <span className="text-sm font-semibold tabular-nums">
                                    {data.totalAmount}
                                </span>
                            </div>

                            <Separator />

                            {/* Disclaimer */}
                            <div className="flex gap-2.5 rounded-md bg-muted/50 border border-border px-3 py-2.5">
                                <InfoIcon className="w-3.5 h-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                                <p className="text-xs leading-relaxed text-muted-foreground">
                                    Prices shown are estimates based on minimum configuration costs.
                                    Actual pricing may vary — for accurate pricing, place an order.
                                </p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 pb-6 flex gap-2.5">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setData(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="default"
                                className="flex-1"
                                onClick={onSaveEstimateAsync}
                            >
                                Place order
                            </Button>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </Form>
    );
}