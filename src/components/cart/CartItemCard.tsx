import { Eye, ShoppingBag, Upload } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import type { CartItem } from '@/types/cart';
import type { ImageOptionItem, OtherSpecificationPriceOptionItem } from '@/types/common';
import z from 'zod';
import { useForm, useWatch } from 'react-hook-form';
import { Form, FormControl, FormItem, FormLabel, FormField, FormMessage } from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useTransition } from 'react';
import { Checkbox } from '../ui/checkbox';
import RemoverCartItem from './RemoverCartItem';
import { InputGroup, InputGroupInput } from '../ui/input-group';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';


const formSchema = z.object({
    id: z.string(),
    otherSpecification: z.array(z.string()),
    noOfUnits: z.coerce.number<number>(),
    instruction: z.string().optional()
})

type FormSchemaType = z.infer<typeof formSchema>

export default function CartItemCard({ cartItem }: { cartItem: CartItem })
{
    const { updateCartItemAsync, cartInfo } = useCart();
    const form = useForm<FormSchemaType>({
        defaultValues: {
            id: cartItem.id,
            otherSpecification: cartItem.otherSpecification,
            instruction: cartItem.instruction,
            noOfUnits: cartItem.noOfUnits,
        },
        resolver: zodResolver(formSchema),
        mode: "onSubmit"
    })

    const [_, startTransition] = useTransition()

    const { control, setError, clearErrors } = form

    const otherSpecification = useWatch({
        control,
        name: "otherSpecification"
    })

    const noOfUnits = useWatch({
        control,
        name: "noOfUnits"
    })

    const TotalCostPerItem: number = useMemo(() =>
    {
        const quantityCost = cartItem.unitPrice * cartItem.cellCount * noOfUnits;
        const otherSpecicationCost = cartItem.otherSpecificationOptions.reduce((acc: number, curr: OtherSpecificationPriceOptionItem) =>
        {
            acc += otherSpecification.includes(curr.value) ? curr.price * Math.ceil((cartItem.quantity * noOfUnits) / curr.minQuantity) : 0
            return acc;
        }, 0)

        return quantityCost + otherSpecicationCost
    }, [cartItem, cartInfo, noOfUnits, otherSpecification])

    return (
        <Form {...form}>
            <div
                key={cartItem.id}
                className="rounded-xl grid border border-border bg-card p-6 shadow-soft"
            >
                <div className="flex gap-6">
                    {/* Product Image */}
                    {/* <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-secondary">
                        <img
                            loading="lazy"
                            decoding="async"
                            src={cartItem.productImage}
                            alt={cartItem.product}
                            className="h-full w-full object-cover"
                        />
                    </div> */}

                    {/* Product Info */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <h3 className="font-display text-lg font-semibold">
                                <span>{cartItem.product}</span>
                                <p className="text-xs text-muted-foreground py-2">{cartItem.productDescription}</p>
                                <Badge className='text-sm font-bold'>Rs {cartItem.unitPrice}</Badge>
                                <span className='mx-1' />
                                <Badge className='text-sm font-bold'>Qty {cartItem.quantity * noOfUnits}</Badge>
                                <span className='mx-1' />
                                <Badge className='text-sm font-bold'>Cellcount {cartItem.cellCount}</Badge>
                            </h3>
                            <div className="flex items-center gap-2">
                                <div className="min-w-32 max-w-md">
                                    <FormField
                                        defaultValue={cartItem.noOfUnits}
                                        control={control}
                                        name='noOfUnits'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <InputGroup>
                                                        <InputGroupInput
                                                            type='number'
                                                            className='w-20'
                                                            min={0}
                                                            value={field.value}
                                                            onChange={(event) =>
                                                            {
                                                                let noOfUnits = Number(event.target.value)
                                                                if (noOfUnits == 0 || noOfUnits <= 0)
                                                                {
                                                                    setError('noOfUnits', { message: "Minimum value is 1" })
                                                                }
                                                                else
                                                                {
                                                                    clearErrors("noOfUnits")
                                                                }
                                                                field.onChange(noOfUnits)
                                                                if (noOfUnits != 0)
                                                                {
                                                                    startTransition(async () =>
                                                                    {
                                                                        await updateCartItemAsync({ ...(control._formValues as FormSchemaType), noOfUnits })
                                                                    })
                                                                }
                                                            }}
                                                            ref={field.ref}
                                                        />
                                                    </InputGroup>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
                                <RemoverCartItem className='mt-auto' cartItem={cartItem} id={cartItem.id} />
                            </div>
                        </div>
                    </div>
                </div>

                <FormField
                    control={control}
                    name='instruction'
                    render={({ field }) => (
                        <FormItem className='my-1.5'>
                            <FormLabel>Instruction</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder='Enter the instruction'
                                    rows={4}
                                    className='resize-none'
                                    value={field.value}
                                    onChange={(e) =>
                                    {
                                        field.onChange(e)
                                        startTransition(async () =>
                                        {
                                            await updateCartItemAsync({ ...(control._formValues as FormSchemaType), noOfUnits })
                                        })
                                    }}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                {/* Other Specifications */}
                {cartItem.otherSpecificationOptions && cartItem.otherSpecificationOptions.length > 0 && (
                    <div className="mt-6 border-t border-border pt-6">
                        <div className="flex items-center gap-2 mb-3">
                            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Other Specifications</span>
                        </div>
                        <FormField
                            control={control}
                            name='otherSpecification'
                            render={({ field }) => (
                                <FormItem className="flex flex-wrap gap-2">
                                    {cartItem.otherSpecificationOptions.map((spec: OtherSpecificationPriceOptionItem, index: number) => (
                                        <FormItem
                                            key={index}
                                            className="flex flex-row"
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value.includes(spec.value)}
                                                    onCheckedChange={(checked) =>
                                                    {
                                                        // Can select many item
                                                        if (cartItem.optionType == "f7ba2a38-0191-ab37-c57d-c65e0d95c45c")
                                                        {
                                                            const next = checked
                                                                ? [...field.value, spec.value]
                                                                : field.value.filter((x) => x !== spec.value);
                                                            field.onChange(next);
                                                            startTransition(async () =>
                                                            {
                                                                await updateCartItemAsync({ ...(control._formValues as FormSchemaType), otherSpecification: next })
                                                            })
                                                        }

                                                        // only one item
                                                        if (cartItem.optionType == "f4d52b0d-a4fa-4dbb-b855-c215ac55e509")
                                                        {
                                                            const next = checked ? [spec.value] : [];
                                                            field.onChange(next);
                                                            startTransition(async () =>
                                                            {
                                                                await updateCartItemAsync({ ...(control._formValues as FormSchemaType), otherSpecification: next })
                                                            })
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel>{spec.label} <span className='text-xs font-bold'>Rs {spec.price}</span></FormLabel>
                                        </FormItem>
                                    ))}
                                </FormItem>
                            )}
                        />
                    </div>
                )}

                {/* Design Upload Section */}
                <div className="mt-6 border-t border-border pt-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Design Files</span>
                    </div>
                    {cartItem.designFiles.length > 0 ? (
                        <div className="flex flex-row flex-wrap gap-1">
                            {cartItem.designFiles.map((file: ImageOptionItem, index: number) => (
                                <div key={index} className="group relative overflow-hidden rounded-md border h-fit w-32">
                                    <div className='grid grid-cols-1 gap-2'>
                                        <img
                                            loading="lazy"
                                            decoding="async"
                                            src={file.label}
                                            alt="Preview"
                                            className="object-contain w-full h-full"
                                        />
                                        <p className='text-sm font-semibold mx-auto'>{file.description}</p>
                                    </div>

                                    {/* Hover overlay with actions */}
                                    <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button
                                                    type='button'
                                                    size="icon"
                                                    variant="secondary"
                                                    className="rounded-full"
                                                    title="View"
                                                >
                                                    <Eye className="size-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <img
                                                    loading="lazy"
                                                    decoding="async"
                                                    src={file.label}
                                                    alt="Full preview"
                                                    className="object-contain w-full max-h-[75vh]"
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-sm text-muted-foreground">
                            No design uploaded
                        </span>
                    )}
                </div>
                <span className='ml-auto leading-3 font-bold'>Total Rs {TotalCostPerItem}</span>
            </div>
        </Form >
    )
}
