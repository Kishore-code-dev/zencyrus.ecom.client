import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router";
import { ShoppingCart, Eye, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import type { Product } from "@/types";
import ProductDetailHeader from "@/components/ProductDetail/ProductDetailHeader";
import ProductImage from "@/components/ProductDetail/ProductImage";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import ProductDescription from "@/components/ProductDetail/ProductDescription";
import { Instruction } from "@/components/catalog/instruction";
import { api } from "@/config/api";
import { AxiosError } from "axios";
import { useApiAction } from "@/hooks/use-api-action";
import { Textarea } from "@/components/ui/textarea";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import type { AddToCartItem } from "@/types/cart";
import CartItemSheet from "@/components/cart/CartItemSheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { addToCartSchema } from "@/config/cart";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/use-auth";
import WishListToggler from "@/components/wishlist/WishListToggler";
import DesignFileUpload from "@/components/design-file-upload/DesignFileUpload";
import { Badge } from "@/components/ui/badge";
import DesignFilePreview from "@/components/design-file-upload/DesignFilePreview";
import { cn } from "@/lib/utils";
import { addToCart } from "@/analytics/ecommerce";
import { AttachmentErrorList } from "@/components/ProductDetail/AttachmentErrorList";
import { ButtonGroup } from "@/components/ui/button-group";

const defaultValues: AddToCartItem = {
  customerId: "",
  productId: "",
  quantityId: "",
  instruction: "",
  otherSpecification: [],
  attachments: [],
  noOfUnits: 1,
};

// ── Extracted sub-component ────────────────────────────────────────────────
interface ProductPriceDisplayProps {
  product: Product;
  cellCount: number;
  additionalPrices: number;
  isAuthenticated: boolean;
}

const ProductPriceDisplay = ({
  product,
  cellCount,
  additionalPrices,
  isAuthenticated,
}: ProductPriceDisplayProps) => (
  <div className="flex items-baseline gap-4">
    <span
      className={cn(
        "flex flex-row items-center justify-center text-4xl font-semibold text-foreground space-x-2.5",
        cellCount > 0 ? "line-through text-muted-foreground text-xl" : "",
      )}
    >
      <span>Rs</span>
      {isAuthenticated ? (
        <>
          <span className="line-through text-muted-foreground text-2xl">
            {product.basePrice.toFixed(2)}
          </span>
          <span>{product.price.toFixed(2)}</span>
        </>
      ) : (
        <span>{product.price.toFixed(2)}</span>
      )}
    </span>
    {cellCount > 0 && (
      <span className="text-xl">
        <span className="font-semibold">
          {(cellCount * product.price + additionalPrices).toFixed(2)}
        </span>
        {" / Cellcount "}
        {cellCount}
      </span>
    )}
    <Badge className="my-auto rounded-md uppercase font-bold">
      {product.quantity.label} qty
    </Badge>
  </div>
);

// ── Main component ─────────────────────────────────────────────────────────
export default function ProductDetail() {
  const { id = "", quantityId = "" } = useParams<{
    id: string;
    quantityId: string;
  }>();
  const navigate = useNavigate();
  const { apiActionAsync } = useApiAction();
  const { addToCartItemAsync } = useCart();
  const { isAuthenticated } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);

  const form = useForm<AddToCartItem>({
    defaultValues: {
      ...defaultValues,
      productId: id,
      quantityId,
      noOfUnits: 1,
    },
    mode: "onChange",
    resolver: zodResolver(addToCartSchema),
  });

  const { control, formState, handleSubmit, reset, setValue } = form;

  const { fields } = useFieldArray({ control, name: "attachments" });
  const attachments = useWatch({ control, name: "attachments" });
  const otherSpecification = useWatch({ control, name: "otherSpecification" });

  const additionalPrices = useMemo(() => {
    if (!product?.otherSpecifications) return 0;
    return product.otherSpecifications
      .filter((item) => otherSpecification.includes(item.value))
      .reduce(
        (sum, item) =>
          sum +
          item.price * Math.ceil((product.noOfQuantity * 1) / item.minQuantity),
        0,
      );
  }, [otherSpecification, product?.otherSpecifications]);

  const previewItems = useMemo(
    () => attachments.filter((x) => x.isValid),
    [attachments],
  );

  const cellCount = useMemo(
    () => (attachments.length > 0 ? attachments[0].cellCount : 0),
    [attachments],
  );

  const previousDimension = useMemo(
    () =>
      attachments.length > 0
        ? {
            height: attachments[0].documentHeightInMM,
            width: attachments[0].documentWidthInMM,
          }
        : { height: 0, width: 0 },
    [attachments],
  );

  // Stable callback — reset is stable from react-hook-form, safe to include
  const removeDocument = useCallback(
    (imageTypeId: string) => {
      setValue(
        "attachments",
        attachments.map((a) =>
          a.imageTypeId === imageTypeId
            ? {
                ...a,
                document: undefined,
                isValid: false,
                cellCount: 0,
                documentHeightInMM: 0,
                currentDPI: 0,
                documentHeightInPx: 0,
                documentWidthInMM: 0,
                documentWidthInPx: 0,
              }
            : a,
        ),
      );
    },
    [attachments, setValue],
  );

  const handleOnSubmit = useCallback(
    async (payload: AddToCartItem) => {
      if (product)
        addToCart({
          basePrice: product.basePrice,
          description: product.description,
          helperLink: "",
          helperText: "",
          id: "",
          price: product.price,
          quantity: product.quantity,
          shortDescription: "",
          turnAroundDays: product.turnAroundDays,
          minQuantity: "",
        });
      const { isSuccess = false } = await addToCartItemAsync(payload);
      if (isSuccess) reset(formState.defaultValues);
    },
    [addToCartItemAsync, reset, formState.defaultValues],
  );

  // Keep fetchProductDetails deps lean — exclude `reset` (stable ref)
  const fetchProductDetails = useCallback(async () => {
    try {
      const response = await api.get(
        `product/getbyid?id=${id}&quantityId=${quantityId}`,
      );
      if (response.status === 200 && response.data) {
        setProduct(response.data);
        reset({
          ...defaultValues,
          productId: id,
          quantityId,
          instruction: "",
          otherSpecification: [],
          attachments: response.data.attachments,
          noOfUnits: 1,
        });
      }
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        await apiActionAsync(error.response);
      }
    }
  }, [id, quantityId]);

  const noOfUnits = useWatch<AddToCartItem>({ control, name: "noOfUnits" });

  useEffect(() => {
    setIsLoading(true);
    fetchProductDetails().finally(() => setIsLoading(false));
  }, [fetchProductDetails]);

  if (isLoading) {
    return (
      <div className="bg-background h-full w-full grid grid-cols-1">
        <Spinner className="size-20 m-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-background">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button className="mt-4" onClick={() => navigate("/catalog")}>
            Back to Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        className="min-h-screen w-full bg-background"
        onSubmit={handleSubmit(handleOnSubmit)}
      >
        <div className="w-full mx-auto px-4 py-8">
          <ProductDetailHeader />
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left column */}
            <div className="space-y-4">
              <div className="relative">
                {previewItems.length > 0 ? (
                  <div className="h-fit w-full grid grid-cols-2 gap-2.5">
                    {previewItems.map((attachment, index) => (
                      <div
                        key={index}
                        className="h-full w-full grid grid-cols-1 gap-2.5"
                      >
                        <DesignFilePreview
                          documentHeightInPx={attachment.documentHeightInPx}
                          documentHeightInMM={attachment.documentHeightInMM}
                          documentWidthInPx={attachment.documentWidthInPx}
                          documentWidthInMM={attachment.documentWidthInMM}
                          cellCount={attachment.cellCount}
                          colorSpace={attachment.colorSpace as string}
                          fileType={attachment.imageTypeName}
                          imageUrl={attachment.imageUrl as string}
                          isPdf={
                            attachment?.document?.type == "application/pdf"
                          }
                        />
                        <Button
                          size="sm"
                          className="w-full"
                          variant="ghost"
                          type="button"
                          onClick={() => removeDocument(attachment.imageTypeId)}
                        >
                          <Trash /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ProductImage product={product} />
                )}
                {isAuthenticated && attachments.length === 0 && (
                  <WishListToggler
                    productId={id}
                    quantityId={quantityId}
                    className="absolute top-2 right-2"
                  />
                )}
              </div>
              <ProductInfo product={product} />
            </div>

            {/* Right column */}
            <div className="space-y-4 text-wrap wrap-break-word w-full">
              <ProductDescription product={product} className="w-full" />

              {product.helperLink && (
                <span className="w-fit flex flex-row items-center justify-center gap-2.5">
                  <a
                    href={product.helperLink}
                    className="text-xs text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <p className="text-xl">{product.helperText}</p>
                  </a>
                </span>
              )}

              {attachments.length !== 0 && (
                <div className="text-destructive text-sm font-bold p-2.5">
                  Please do not use the ISO Coated v2 (ECI) profile. Use the
                  U.S. Web Coated (SWOP) v2 profile only for the best color
                  output.
                </div>
              )}

              <ProductPriceDisplay
                product={product}
                cellCount={cellCount}
                additionalPrices={additionalPrices}
                isAuthenticated={isAuthenticated}
              />

              <div
                className={cn(
                  attachments.length - previewItems.length >= 2
                    ? "grid-cols-2"
                    : "grid-cols-1",
                  "grid gap-2.5",
                )}
              >
                {fields.map((attachment, index) => (
                  <div key={attachment.id}>
                    <FormField
                      control={control}
                      name={`attachments.${index}`}
                      render={() => (
                        <FormItem>
                          <DesignFileUpload
                            name={`attachments.${index}`}
                            finishHeight={product.uploadDimensions.height}
                            finishWidth={product.uploadDimensions.width}
                            imageTypeId={attachment.imageTypeId}
                            imageTypeName={attachment.imageTypeName}
                            previousHeight={previousDimension.height}
                            previousWidth={previousDimension.width}
                            cellCount={cellCount}
                          />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name={`attachments.${index}.document`}
                      render={() => (
                        <FormItem className="my-2.5">
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
              <AttachmentErrorList />
              <FormField
                control={control}
                name="instruction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Instruction</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Add any notes or instructions for this item"
                        className="resize-none"
                        rows={5}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {product.otherSpecifications.length > 0 && (
                <FormField
                  control={control}
                  name="otherSpecification"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other specification</FormLabel>
                      <FormItem className="flex flex-warp item-center">
                        {product.otherSpecifications.map((item, index) => (
                          <FormField
                            key={index}
                            control={control}
                            name="otherSpecification"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value.includes(item.value)}
                                    onCheckedChange={(checked) => {
                                      // Can select many item
                                      if (
                                        product.optionType ==
                                        "f7ba2a38-0191-ab37-c57d-c65e0d95c45c"
                                      ) {
                                        const next = checked
                                          ? [...field.value, item.value]
                                          : field.value.filter(
                                              (x) => x !== item.value,
                                            );
                                        field.onChange(next);
                                      }

                                      // only one item
                                      if (
                                        product.optionType ==
                                        "f4d52b0d-a4fa-4dbb-b855-c215ac55e509"
                                      ) {
                                        const next = checked
                                          ? [item.value]
                                          : [];
                                        field.onChange(next);
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-xs">
                                  {item.label}{" "}
                                  <span className="text-xs font-bold">
                                    Rs {item.price}{" "}
                                  </span>
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        ))}
                      </FormItem>
                    </FormItem>
                  )}
                />
              )}

              <ButtonGroup>
                
              </ButtonGroup>

              <Button
                size="lg"
                className="w-full"
                disabled={formState.isSubmitting}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
                {formState.isSubmitting && <Spinner />}
              </Button>

              <CartItemSheet
                className="w-full"
                TriggerButton={
                  <Button size="lg" variant="outline" className="w-full">
                    <Eye className="mr-2 h-5 w-5" /> Preview cart
                  </Button>
                }
              />
            </div>
          </div>
        </div>
        <Instruction />
      </form>
    </Form>
  );
}
