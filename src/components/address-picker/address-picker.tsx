import { useFormContext, useWatch } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Combobox } from "../ui/combobox";
import { useMemo, useTransition, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { AxiosError } from "axios";
import { api } from "@/config/api";
import type { OptionItem } from "@/types/common";
import { useApiAction } from "@/hooks/use-api-action";
import type { Filter } from "@/types/filter";

export interface AutoFillResult {
    countryId: OptionItem;
    stateId: OptionItem;
    districtId: OptionItem;
    cityId: OptionItem;
    pincodeId: OptionItem;
}

interface AddressPickerProps extends ComponentProps<"div"> {
    disabled?: boolean;
}

export default function AddressPicker({
    className,
    disabled = false,
    ...props
}: AddressPickerProps) {
    const { control, setValue } = useFormContext();
    const { apiActionAsync } = useApiAction();
    const [loading, startTransition] = useTransition();

    const pincodeId = useWatch({
        control,
        name: "pincodeId",
    });

    const pinCodeCascadeFilter: Filter[] = useMemo(() => {
        if (pincodeId && pincodeId.label) {
            return [
                {
                    id: "Name",
                    value: {
                        alias: "pincode",
                        dataType: "text",
                        logic: "AND",
                        matchCase: "=",
                        value: pincodeId.label,
                    },
                } as Filter,
            ];
        }

        return [];
    }, [pincodeId]);

    // const onClickAutoFillAsync = () =>
    // {
    //     if (!(pincodeId && pincodeId.value)) return;

    //     startTransition(async () =>
    //     {
    //         try
    //         {
    //             const reponse = await api.get(`address/autofill?id=${pincodeId.value}`)
    //             if (reponse.status == 200 && reponse.data)
    //             {
    //                 const data = reponse.data as AutoFillResult
    //                 setValue("cityId", data.cityId, { shouldDirty: true })
    //                 setValue("districtId", data.districtId, { shouldDirty: true })
    //                 setValue("stateId", data.stateId, { shouldDirty: true })
    //                 setValue("countryId", data.countryId, { shouldDirty: true })
    //             }
    //         } catch (error)
    //         {
    //             if (error instanceof AxiosError && error.response)
    //             {
    //                 await apiActionAsync(error.response)
    //             }
    //         }
    //     })
    // }

    return (
        <div className={cn("grid grid-cols-2 gap-2.5", className)} {...props}>
            <FormField
                control={control}
                name="addressLine1"
                rules={{
                    required: {
                        value: true,
                        message: "Address1 is required",
                    },
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Address 1{" "}
                            <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="House / Street" />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="addressLine2"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address 2</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="Area / Landmark" />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="pincodeId"
                render={({ field }) => (
                    <FormItem className="col-span-2 ">
                        <FormLabel>
                            Pincode <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormItem>
                            <FormControl>
                                <Combobox
                                    ref={field.ref}
                                    value={field.value}
                                    onValueChange={(pincode) => {
                                        field.onChange(pincode);
                                        if (pincode && pincode.value) {
                                            startTransition(async () => {
                                                try {
                                                    const reponse =
                                                        await api.get(
                                                            `address/autofill?id=${pincode.value}`,
                                                        );
                                                    if (
                                                        reponse.status == 200 &&
                                                        reponse.data
                                                    ) {
                                                        const data =
                                                            reponse.data as AutoFillResult;
                                                        setValue(
                                                            "cityId",
                                                            {
                                                                label: "",
                                                                value: "",
                                                            },
                                                            {
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                        setValue(
                                                            "districtId",
                                                            data.districtId,
                                                            {
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                        setValue(
                                                            "stateId",
                                                            data.stateId,
                                                            {
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                        setValue(
                                                            "countryId",
                                                            data.countryId,
                                                            {
                                                                shouldDirty: true,
                                                            },
                                                        );
                                                    }
                                                } catch (error) {
                                                    if (
                                                        error instanceof
                                                            AxiosError &&
                                                        error.response
                                                    ) {
                                                        await apiActionAsync(
                                                            error.response,
                                                        );
                                                    }
                                                }
                                            });
                                        }
                                    }}
                                    path="pincode/search?optionSize=50&searchString"
                                    disabled={loading || field.disabled}
                                />
                            </FormControl>
                            {/* <Button type='button' disabled={disabled} className='col-span-1' onClick={onClickAutoFillAsync}>Auto fill</Button> */}
                        </FormItem>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="countryId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Country <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <Combobox
                                ref={field.ref}
                                value={field.value}
                                onValueChange={field.onChange}
                                path="country/search?optionSize=50&searchString"
                                disabled={loading || field.disabled}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="stateId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            State <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <Combobox
                                ref={field.ref}
                                value={field.value}
                                onValueChange={field.onChange}
                                path="state/search?optionSize=50&searchString"
                                disabled={true}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="districtId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            District <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <Combobox
                                ref={field.ref}
                                value={field.value}
                                onValueChange={field.onChange}
                                path="district/search?optionSize=50&searchString"
                                disabled={true}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="cityId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Area <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                            <Combobox
                                key={pincodeId?.value}
                                ref={field.ref}
                                value={field.value}
                                onValueChange={field.onChange}
                                cascadeFilter={pinCodeCascadeFilter}
                                path="city/search?optionSize=50&searchString"
                                disabled={loading || field.disabled}
                                mode="dynamic"
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
            {/* <FormField
                control={control}
                name="area"
                render={({ field }) => (
                    <FormItem className='col-span-2'>
                        <FormLabel>If your area is not listed, please enter it here.</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                placeholder="If your area is not listed, please enter it here"
                            />
                        </FormControl>
                    </FormItem>
                )}
            /> */}
        </div>
    );
}
