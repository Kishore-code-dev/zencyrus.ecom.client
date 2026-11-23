import CartItemSheet from "@/components/cart/CartItemSheet";
import { Instruction } from "@/components/catalog/instruction";
import DesignFilePreview from "@/components/design-file-upload/DesignFilePreview";
import DesignFileUpload from "@/components/design-file-upload/DesignFileUpload";
import { AttachmentErrorList } from "@/components/ProductDetail/AttachmentErrorList";
import ProductDescription from "@/components/ProductDetail/ProductDescription";
import ProductDetailHeader from "@/components/ProductDetail/ProductDetailHeader";
import ProductImage from "@/components/ProductDetail/ProductImage";
import ProductInfo from "@/components/ProductDetail/ProductInfo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/config/api";
import { addToProductDynamicConfigurationSchema } from "@/config/cart";
import { useApiAction } from "@/hooks/use-api-action";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import type { AddToProductDynamicConfigurationSchema } from "@/types/cart";
import type { Filter } from "@/types/filter";
import type {
  Product,
  ProductConfiguration,
  ProductDynamicConfiguration,
} from "@/types/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Eye, ShoppingCart, Trash } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

type AvailableOptions = Record<
  | "media"
  | "gsm"
  | "lamination"
  | "fileFinishing"
  | "printingSide"
  | "finishSize"
  | "quantity"
  | "pouch"
  | "foilType"
  | "foilSide"
  | "spotUV"
  | "coverType"
  | "pad"
  | "dieCut",
  string[]
>;

type SelectableFieldKey =
  | "mediaId"
  | "gsmId"
  | "laminationId"
  | "fileFinishingId"
  | "printingSideId"
  | "finishSizeId"
  | "quantityId"
  | "pouchId"
  | "foilTypeId"
  | "foilSideId"
  | "spotUVId"
  | "coverTypeId"
  | "padId"
  | "dieCutId";

type OptionVisibility =
  AddToProductDynamicConfigurationSchema["optionVisibility"];

const defaultAvailableOptions: AvailableOptions = {
  coverType: [],
  dieCut: [],
  fileFinishing: [],
  finishSize: [],
  foilSide: [],
  foilType: [],
  gsm: [],
  lamination: [],
  media: [],
  pad: [],
  pouch: [],
  printingSide: [],
  quantity: [],
  spotUV: [],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isOptionDisabled(
  available: string[] | undefined,
  value: string,
): boolean {
  if (available === undefined) return false;
  if (available.length === 0) return false;
  return !available.includes(value);
}

function toggleValue(current: string | undefined, next: string): string {
  return current === next ? "" : next;
}

// Every possible selectable facet, tagged with:
//  - which optionVisibility flag controls it
//  - the property name expected by the /product/configuration filter API
//  - the key under which its options array is returned in ProductConfiguration
const FACET_DEFINITIONS: Array<{
  fieldKey: SelectableFieldKey;
  propertyName: string;
  resultKey: keyof AvailableOptions;
  visibilityKey: keyof OptionVisibility;
}> = [
  {
    fieldKey: "mediaId",
    propertyName: "mediaId",
    resultKey: "media",
    visibilityKey: "isMedia",
  },
  {
    fieldKey: "gsmId",
    propertyName: "gsmId",
    resultKey: "gsm",
    visibilityKey: "isGsm",
  },
  {
    fieldKey: "laminationId",
    propertyName: "laminationId",
    resultKey: "lamination",
    visibilityKey: "isLamination",
  },
  {
    fieldKey: "printingSideId",
    propertyName: "printingSideId",
    resultKey: "printingSide",
    visibilityKey: "isPrintingSide",
  },
  {
    fieldKey: "finishSizeId",
    propertyName: "finishSizeId",
    resultKey: "finishSize",
    visibilityKey: "isFinishSize",
  },
  {
    fieldKey: "quantityId",
    propertyName: "quantityId",
    resultKey: "quantity",
    visibilityKey: "isQuantity",
  },
  {
    fieldKey: "foilSideId",
    propertyName: "foilSideId",
    resultKey: "foilSide",
    visibilityKey: "isFoilSide",
  },
  {
    fieldKey: "foilTypeId",
    propertyName: "foilTypeId",
    resultKey: "foilType",
    visibilityKey: "isFoilType",
  },
  {
    fieldKey: "spotUVId",
    propertyName: "spotUVId",
    resultKey: "spotUV",
    visibilityKey: "isSpotUV",
  },
  {
    fieldKey: "padId",
    propertyName: "padId",
    resultKey: "pad",
    visibilityKey: "isPad",
  },
  {
    fieldKey: "dieCutId",
    propertyName: "dieCutId",
    resultKey: "dieCut",
    visibilityKey: "isDiecut",
  },
  {
    fieldKey: "pouchId",
    propertyName: "pouchId",
    resultKey: "pouch",
    visibilityKey: "isPouch",
  },
  {
    fieldKey: "coverTypeId",
    propertyName: "coverTypeId",
    resultKey: "coverType",
    visibilityKey: "isCoverType",
  },
  {
    fieldKey: "fileFinishingId",
    propertyName: "fileFinishingId",
    resultKey: "fileFinishing",
    visibilityKey: "isFileFinishing",
  },
];

export default function ProductDynamicConfiguration() {
  const { productId = "" } =
    useParams<Readonly<Partial<{ productId: string }>>>();
  const { isAuthenticated } = useAuth();
  const { apiActionAsync } = useApiAction();
  const { addToProductDynamicConfigurationAsync } = useCart();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();
  const [product, setProduct] = useState<ProductDynamicConfiguration | null>(
    null,
  );
  const [finishSize, setFinishSize] = useState<{
    height: number;
    width: number;
  }>({ height: 0, width: 0 });
  const [productPrice, setProductPrice] = useState<
    Product & { isValid: boolean }
  >({
    basePrice: 0,
    isValid: false,
    price: 0,
    description: "",
    id: "",
    helperLink: "",
    helperText: "",
    turnAroundDays: "",
    quantity: {
      label: "",
      value: "",
    },
    shortDescription: "",
  });

  const [availableOptions, setAvailableOptions] = useState<AvailableOptions>(
    defaultAvailableOptions,
  );
  const [selectionTick, setSelectionTick] = useState(0);

  const userTouchedFields = useRef<Set<SelectableFieldKey>>(new Set());

  const lastProcessedTick = useRef(0);
  const latestValues = useRef<
    Partial<Record<SelectableFieldKey, string | undefined>>
  >({});

  const abortRef = useRef<AbortController | null>(null);

  const productSpecifications: string[] = useMemo(
    () =>
      product
        ? [product.producType.label, product.classification.label].filter(
            Boolean,
          )
        : [],
    [product],
  );

  const form = useForm<AddToProductDynamicConfigurationSchema>({
    defaultValues: {
      productId,
      customerId: "",
      finishSizeId: "",
      instruction: "",
      laminationId: "",
      gsmId: "",
      mediaId: "",
      printingSideId: "",
      productQuantityId: "",
      quantityId: "",
      foilSideId: "",
      foilTypeId: "",
      spotUVId: "",
      coverTypeId: "",
      dieCutId: "",
      padId: "",
      pouchId: "",
      fileFinishingId: "",
      productUploadFileDimensionsId: "",
      optionVisibility: {
        isCoverType: false,
        isDiecut: false,
        isFinishSize: false,
        isFoilSide: false,
        isFoilType: false,
        isGsm: false,
        isLamination: false,
        isMedia: false,
        isPad: false,
        isPouch: false,
        isPrintingSide: false,
        isQuantity: false,
        isSpotUV: false,
        isFileFinishing: false,
      },
      otherSpecification: [],
      attachments: [],
    },
    mode: "onChange",
    resolver: zodResolver(addToProductDynamicConfigurationSchema),
    disabled: isPending,
  });

  const { control, formState, handleSubmit, reset, setValue, getValues } = form;

  const updateConfiguration = useCallback(
    (productConfig: ProductConfiguration, visibility?: OptionVisibility) => {
      const vis = visibility ?? getValues("optionVisibility");

      const autoSelect = (
        fieldKey: SelectableFieldKey,
        options: Array<{ value: string }>,
        isVisible: boolean,
        onSelect?: (value: string) => void,
      ) => {
        if (!isVisible) return;

        if (options.length === 1 && !userTouchedFields.current.has(fieldKey)) {
          setValue(fieldKey, options[0].value);
          onSelect?.(options[0].value);
        }
        if (options.length === 0) {
          setValue(fieldKey, "");
          userTouchedFields.current.delete(fieldKey);
          onSelect?.("");
        }
      };

      autoSelect("mediaId", productConfig.media, vis.isMedia);
      autoSelect("gsmId", productConfig.gsm, vis.isGsm);
      autoSelect("laminationId", productConfig.lamination, vis.isLamination);
      autoSelect(
        "fileFinishingId",
        productConfig.fileFinishing,
        vis.isFileFinishing,
      );
      autoSelect(
        "printingSideId",
        productConfig.printingSide,
        vis.isPrintingSide,
      );
      autoSelect(
        "finishSizeId",
        productConfig.finishSize,
        vis.isFinishSize,
        (val) => {
          if (val) {
            const item = productConfig.finishSize.find((x) => x.value === val);
            if (item) setFinishSize({ height: item.height, width: item.width });
          } else {
            setFinishSize({ height: 0, width: 0 });
          }
        },
      );
      autoSelect("quantityId", productConfig.quantity, vis.isQuantity);
      autoSelect("pouchId", productConfig.pouch, vis.isPouch);
      autoSelect("foilTypeId", productConfig.foilType, vis.isFoilType);
      autoSelect("foilSideId", productConfig.foilSide, vis.isFoilSide);
      autoSelect("spotUVId", productConfig.spotUV, vis.isSpotUV);
      autoSelect("coverTypeId", productConfig.coverType, vis.isCoverType);
      autoSelect("padId", productConfig.pad, vis.isPad);
      autoSelect("dieCutId", productConfig.dieCut, vis.isDiecut);

      // Upload dimensions are not user-selectable, always auto-set
      if (productConfig.uploadDimensions.length === 1) {
        setValue(
          "productUploadFileDimensionsId",
          productConfig.uploadDimensions[0].value,
        );
        setFinishSize({
          height: productConfig.uploadDimensions[0].height,
          width: productConfig.uploadDimensions[0].width,
        });
      } else {
        setValue("productUploadFileDimensionsId", "");
        setFinishSize({ height: 0, width: 0 });
      }
    },
    [setValue, getValues],
  );

  // Bumps selectionTick — the ONLY thing that should cause a refetch of
  // /product/configuration. Called from every option button's onClick,
  // right before field.onChange(...).
  const markTouched = useCallback((fieldKey: SelectableFieldKey) => {
    userTouchedFields.current.add(fieldKey);
    setSelectionTick((t) => t + 1);
  }, []);

  const { fields } = useFieldArray({ control, name: "attachments" });

  const mediaId = useWatch({ control, name: "mediaId" });
  const gsmId = useWatch({ control, name: "gsmId" });
  const laminationId = useWatch({ control, name: "laminationId" });
  const printingSideId = useWatch({ control, name: "printingSideId" });
  const finishSizeId = useWatch({ control, name: "finishSizeId" });
  const coverTypeId = useWatch({ control, name: "coverTypeId" });
  const attachments = useWatch({ control, name: "attachments" });
  const quantityId = useWatch({ control, name: "quantityId" });
  const foilSideId = useWatch({ control, name: "foilSideId" });
  const foilTypeId = useWatch({ control, name: "foilTypeId" });
  const spotUVId = useWatch({ control, name: "spotUVId" });
  const pouchId = useWatch({ control, name: "pouchId" });
  const padId = useWatch({ control, name: "padId" });
  const dieCutId = useWatch({ control, name: "dieCutId" });
  const fileFinishingId = useWatch({ control, name: "fileFinishingId" });

  // Keep the ref in sync every render. Plain assignment during render is
  // safe here (no side effects, no scheduling) and guarantees the fetch
  // effect always reads the latest selections without needing them as deps.
  latestValues.current = {
    mediaId,
    gsmId,
    laminationId,
    printingSideId,
    finishSizeId,
    quantityId,
    foilSideId,
    foilTypeId,
    spotUVId,
    padId,
    dieCutId,
    pouchId,
    coverTypeId,
    fileFinishingId,
  };

  const onSubmitAsync = async (
    payload: AddToProductDynamicConfigurationSchema,
  ) => {
    const { isSuccess = false } =
      await addToProductDynamicConfigurationAsync(payload);
    if (isSuccess) {
      userTouchedFields.current.clear();
      reset({ ...formState.defaultValues, attachments: [] });
      setProduct((pre) => (pre ? { ...pre, attachments: [] } : null));
    }
  };

  // ── Auto-clear all values when no visible option is selected ──────────────
  useEffect(() => {
    const visibility = product?.optionVisibility;
    if (!visibility) return;

    const visibleFieldMap: Array<{
      visible: boolean;
      value: string | undefined;
    }> = [
      { visible: visibility.isMedia, value: mediaId },
      { visible: visibility.isGsm, value: gsmId },
      { visible: visibility.isLamination, value: laminationId },
      { visible: visibility.isPrintingSide, value: printingSideId },
      { visible: visibility.isFinishSize, value: finishSizeId },
      { visible: visibility.isCoverType, value: coverTypeId },
      { visible: visibility.isQuantity, value: quantityId },
      { visible: visibility.isFoilType, value: foilTypeId },
      { visible: visibility.isFoilSide, value: foilSideId },
      { visible: visibility.isSpotUV, value: spotUVId },
      { visible: visibility.isPad, value: padId },
      { visible: visibility.isDiecut, value: dieCutId },
      { visible: visibility.isPouch, value: pouchId },
      { visible: visibility.isFileFinishing, value: fileFinishingId },
    ];

    const visibleFields = visibleFieldMap.filter((f) => f.visible);
    const allUnselected =
      visibleFields.length > 0 && visibleFields.every((f) => !f.value);

    // Nothing to clear — skip to avoid redundant setValue churn/re-renders.
    if (!allUnselected) return;
    if (userTouchedFields.current.size === 0 && !getValues("productQuantityId"))
      return;

    const fieldsToClear: SelectableFieldKey[] = [
      "mediaId",
      "gsmId",
      "laminationId",
      "fileFinishingId",
      "printingSideId",
      "finishSizeId",
      "quantityId",
      "pouchId",
      "foilTypeId",
      "foilSideId",
      "spotUVId",
      "coverTypeId",
      "padId",
      "dieCutId",
    ];
    fieldsToClear.forEach((key) => setValue(key, ""));
    setValue("productQuantityId", "");
    setValue("productUploadFileDimensionsId", "");
    setFinishSize({ height: 0, width: 0 });
    setProductPrice({
      basePrice: 0,
      isValid: false,
      price: 0,
      description: "",
      id: "",
      helperLink: "",
      helperText: "",
      turnAroundDays: "",
      quantity: {
        label: "",
        value: "",
      },
      shortDescription: "",
    });
    userTouchedFields.current.clear();
  }, [
    mediaId,
    gsmId,
    laminationId,
    printingSideId,
    finishSizeId,
    coverTypeId,
    quantityId,
    foilTypeId,
    foilSideId,
    spotUVId,
    padId,
    dieCutId,
    pouchId,
    fileFinishingId,
    product?.optionVisibility,
    setValue,
    getValues,
  ]);

  // ── buildFilterEntries ────────────────────────────────────────────────────
  // Builds the Filter[] payload for /product/configuration from CURRENT
  // selections, driven entirely by optionVisibility (works for any product,
  // any subset of visible facets — nothing is hardcoded).
  //
  // Pass `excludeKey` to omit one facet's own filter from the payload. This
  // is the fix for the self-exclusion bug: when asking "what quantity values
  // are still valid", you must NOT constrain the query by quantity itself,
  // or the API trivially narrows/echoes back only the currently selected one.
  const buildFilterEntries = useCallback(
    (
      vis: OptionVisibility,
      values: Partial<Record<SelectableFieldKey, string | undefined>>,
      excludeKey?: SelectableFieldKey,
    ): Filter[] => {
      const entries: Filter[] = FACET_DEFINITIONS.filter(
        ({ fieldKey, visibilityKey }) =>
          vis[visibilityKey] &&
          fieldKey !== excludeKey &&
          Boolean(values[fieldKey]),
      ).map(({ fieldKey, propertyName }) => ({
        id: propertyName,
        value: {
          alias: "productquantity_ibfk_1",
          dataType: "numeric",
          logic: "AND",
          matchCase: "=",
          value: values[fieldKey],
        },
      }));

      entries.push({
        id: "productId",
        value: {
          alias: "productquantity_ibfk_1",
          dataType: "numeric",
          logic: "AND",
          matchCase: "=",
          value: productId,
        },
      });

      return entries;
    },
    [productId],
  );

  // ── Configuration fetch ────────────────────────────────────────────────────
  // Fires ONLY when selectionTick changes (i.e. a real user click via
  // markTouched), or when productId/product itself changes.
  useEffect(() => {
    if (!productId || !product) return;

    if (selectionTick === lastProcessedTick.current) return;
    lastProcessedTick.current = selectionTick;

    const vis = product.optionVisibility;
    const values = latestValues.current;

    // Cancel any still-in-flight request from a previous selection.
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    startTransition(async () => {
      try {
        // ── 1) FULL filter → resolves the matched product / price / attachments ──
        const fullFilters = buildFilterEntries(vis, values);
        const fullResponse = await api.post(
          `product/configuration?productId=${productId}`,
          fullFilters,
          { signal: controller.signal },
        );

        if (!(fullResponse.status === 200 && fullResponse.data)) return;

        const fullConfig: ProductConfiguration = fullResponse.data;

        if (fullConfig.product.length === 1) {
          setProductPrice({
            isValid: true,
            basePrice: fullConfig.product[0].basePrice,
            description: fullConfig.product[0]?.description,
            id: fullConfig.product[0].id,
            price: fullConfig.product[0].price,
            helperLink: fullConfig.product[0].helperLink,
            helperText: fullConfig.product[0].helperText,
            turnAroundDays: fullConfig.product[0].turnAroundDays,
            quantity: {
              label: fullConfig.product[0].minQuantity as string,
              value: "",
            },
            shortDescription: fullConfig.product[0].shortDescription,
          });
          setQuantity(fullConfig.quantity[0]?.quantity ?? 0);
          setValue("productQuantityId", fullConfig.product[0].id);
        } else {
          setProductPrice({
            isValid: false,
            basePrice: 0,
            description: "",
            id: "",
            price: 0,
            helperLink: "",
            helperText: "",
            turnAroundDays: "",
            quantity: {
              label: "",
              value: "",
            },
            shortDescription: "",
          });
          setValue("productQuantityId", "");
          setQuantity(0);
        }

        setValue("productId", productId);
        setValue("attachments", fullConfig.attachments);

        // ── 2) PER-FACET filters (self-excluded) → each facet's own sibling list ──
        // OPTIMIZATION (this is the fix for "multiple API hits per click"):
        //
        // buildFilterEntries() already skips any facet whose current value is
        // falsy. That means for a facet the user hasn't selected yet, the FULL
        // filter call above never included that facet's own filter anyway —
        // so `fullConfig[resultKey]` IS ALREADY the self-excluded result for
        // that facet. Re-querying it is a wasted, duplicate network call.
        //
        // We only need a genuinely fresh, self-excluded query for a facet that
        // currently HAS a selected value, since excluding that facet's own
        // filter changes the query compared to the full one.
        //
        // Net effect: on a product where nothing is selected yet, a click now
        // costs exactly 1 request instead of (1 + number of visible facets).
        // As the user makes more selections, only the facets they've actually
        // picked need their own follow-up request — everything else is reused.
        const visibleFacets = FACET_DEFINITIONS.filter(
          ({ visibilityKey }) => vis[visibilityKey],
        );

        const facetsNeedingOwnQuery = visibleFacets.filter(({ fieldKey }) =>
          Boolean(values[fieldKey]),
        );
        const facetsReusingFullConfig = visibleFacets.filter(
          ({ fieldKey }) => !values[fieldKey],
        );

        const facetResults =
          facetsNeedingOwnQuery.length > 0
            ? await Promise.all(
                facetsNeedingOwnQuery.map(async ({ fieldKey, resultKey }) => {
                  const filters = buildFilterEntries(vis, values, fieldKey);
                  const res = await api.post(
                    `product/configuration?productId=${productId}`,
                    filters,
                    { signal: controller.signal },
                  );
                  const list = (res.data?.[resultKey] ?? []) as Array<{
                    value: string;
                  }>;
                  return { resultKey, list };
                }),
              )
            : [];

        const nextAvailable: AvailableOptions = defaultAvailableOptions;

        // Facets with no current selection: reuse the list already present
        // in the full-filter response — no extra request needed.
        facetsReusingFullConfig.forEach(({ resultKey }) => {
          const list = (fullConfig[resultKey] ?? []) as Array<{
            value: string;
          }>;
          nextAvailable[resultKey] = list.map((x) => x.value);
        });

        facetResults.forEach(({ resultKey, list }) => {
          nextAvailable[resultKey] = list.map((x) => x.value);
        });

        setAvailableOptions(nextAvailable);

        // Auto-select / auto-clear logic still uses the FULL config. Its
        // internal setValue calls do NOT appear in this effect's deps
        // (selectionTick/productId/product only), so they cannot cause
        // another run of this effect.
        updateConfiguration(fullConfig, vis);
      } catch (error) {
        if (error instanceof AxiosError && error.code === "ERR_CANCELED") {
          // A newer selection superseded this request — ignore silently.
          return;
        }
        if (error instanceof AxiosError && error.response) {
          await apiActionAsync(error.response);
        }
      }
    });
  }, [productId, selectionTick, product]);

  const otherSpecification = useWatch({ control, name: "otherSpecification" });

  const additionalPrices = useMemo(() => {
    if (!product?.otherSpecifications) return 0;
    return product.otherSpecifications
      .filter((item) => otherSpecification.includes(item.value))
      .reduce(
        (sum, item) =>
          sum + item.price * Math.ceil((quantity * 1) / item.minQuantity),
        0,
      );
  }, [otherSpecification, product?.otherSpecifications, quantity]);

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
                currentDPI: 0,
                documentHeightInMM: 0,
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

  // ── Initial product load ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        form.reset();
        setLoading(true);
        const response = await api.get(
          `product/dynamicconfiguration?productId=${productId}`,
        );
        if (response.status === 200 && response.data) {
          const productData = response.data as any;
          setProduct(productData);
          setValue("optionVisibility", productData.optionVisibility);
          setValue("attachments", productData.attachments);
          // Seed availableOptions from the initial (unfiltered) load so
          // options render enabled before the user makes any selection.
          const vis: OptionVisibility = productData.optionVisibility;
          const initialAvailable: AvailableOptions = defaultAvailableOptions;
          FACET_DEFINITIONS.filter(
            ({ visibilityKey }) => vis[visibilityKey],
          ).forEach(({ resultKey }) => {
            const list = (productData[resultKey] ?? []) as Array<{
              value: string;
            }>;
            initialAvailable[resultKey] = list.map((x) => x.value);
          });
          setAvailableOptions(initialAvailable);

          // Pass visibility explicitly so hidden fields are skipped from the start
          updateConfiguration(productData as ProductConfiguration, vis);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response) {
          await apiActionAsync(error.response);
        }
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  if (loading) {
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

  const optionButtonClass = (isSelected: boolean, isDisabled: boolean) =>
    cn(
      "cursor-pointer rounded-lg border transition-all",
      isSelected && "border-primary! bg-primary/50!",
      isDisabled && "opacity-40 cursor-not-allowed pointer-events-none",
    );

  return (
    <Form {...form}>
      <form
        className="min-h-screen w-full bg-background"
        onSubmit={handleSubmit(onSubmitAsync)}
      >
        <div className="w-full mx-auto px-4 py-8">
          <ProductDetailHeader />
          <div className="grid gap-12 lg:grid-cols-2">
            {/* ── Left column: image / design preview ── */}
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
                          <Trash /> Remove {attachment.imageTypeName}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <ProductImage product={product} />
                )}
              </div>
              <ProductInfo product={productPrice} />
            </div>

            {/* ── Right column: configuration form ── */}
            <div className="space-y-5 text-wrap wrap-break-word w-full">
              <ProductDescription product={product} className="w-full" />
              <div className="flex flex-row flex-wrap items-center gap-2.5">
                {productSpecifications.map((specification, index) => (
                  <Badge key={index} className="rounded-md">
                    {specification}
                  </Badge>
                ))}
              </div>
              {productPrice && productPrice.shortDescription && (
                <p className="w-full text-sm font-bold text-wrap wrap-break-word">
                  <span className="text-muted-foreground font-normal text-wrap">
                    Product Name:
                  </span>{" "}
                  {productPrice.shortDescription}
                </p>
              )}

              <p
                className="text-muted-foreground text-xs"
                dangerouslySetInnerHTML={{
                  __html: productPrice.description ?? "",
                }}
              />

              {productPrice.isValid && (
                <div className="flex items-baseline gap-4">
                  <span
                    className={cn(
                      "flex flex-row items-center justify-center text-4xl font-semibold text-foreground space-x-2.5",
                      cellCount > 0
                        ? "line-through text-muted-foreground text-xl"
                        : "",
                    )}
                  >
                    <span>Rs</span>
                    {isAuthenticated ? (
                      cellCount > 0 ? null : (
                        <>
                          <span className="line-through text-muted-foreground text-2xl">
                            {productPrice.basePrice.toFixed(2)}
                          </span>
                          <span>{productPrice.price.toFixed(2)}</span>
                        </>
                      )
                    ) : (
                      <span>{productPrice.price.toFixed(2)}</span>
                    )}
                  </span>
                  {cellCount > 0 && (
                    <span className="text-xl space-x-2.5">
                      <span className="line-through text-muted-foreground text-2xl">
                        {productPrice.price.toFixed(2)}
                      </span>
                      <span className="font-semibold">
                        {(
                          cellCount * productPrice.price +
                          additionalPrices
                        ).toFixed(2)}
                      </span>
                      {" / Cellcount "}
                      {cellCount}
                    </span>
                  )}
                  {productPrice.helperLink && (
                    <span className="w-fit flex flex-row items-center justify-center gap-2.5">
                      <a
                        href={productPrice.helperLink}
                        className="text-xs text-primary"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <p className="text-xl">{productPrice.helperText}</p>
                      </a>
                    </span>
                  )}
                </div>
              )}

              {/* ── Die Cut ── */}
              {product.optionVisibility.isDiecut &&
                product.dieCut.length > 0 && (
                  <FormField
                    control={control}
                    name="dieCutId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Die cut</FormLabel>
                        <div className="flex flex-wrap gap-2.5">
                          {product.dieCut.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.dieCut,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("dieCutId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " h-fit w-fit p-1.5"
                                }
                              >
                                <img
                                  loading="lazy"
                                  decoding="async"
                                  src={item.label}
                                  className="size-24 object-contain rounded-lg"
                                />
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── GSM ── */}
              {product.optionVisibility.isGsm && product.gsm.length > 0 && (
                <FormField
                  control={control}
                  name="gsmId"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 gap-2.5">
                      <FormLabel>Gsm</FormLabel>
                      <div className="flex flex-wrap w-full gap-2.5">
                        {product.gsm.map((item, index) => {
                          const disabled = isOptionDisabled(
                            availableOptions.gsm,
                            item.value,
                          );
                          return (
                            <Button
                              key={index}
                              size="lg"
                              variant="outline"
                              type="button"
                              onClick={() => {
                                markTouched("gsmId");
                                field.onChange(
                                  toggleValue(field.value, item.value),
                                );
                              }}
                              className={
                                optionButtonClass(
                                  item.value === field.value,
                                  disabled,
                                ) + " p-4 min-w-max"
                              }
                            >
                              <span className="text-xs">{item.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ── Media ── */}
              {product.optionVisibility.isMedia && product.media.length > 0 && (
                <FormField
                  control={control}
                  name="mediaId"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 gap-2.5">
                      <FormLabel>Media</FormLabel>
                      <div className="flex flex-wrap w-full gap-2.5">
                        {product.media.map((item, index) => {
                          const disabled = isOptionDisabled(
                            availableOptions.media,
                            item.value,
                          );
                          return (
                            <Button
                              key={index}
                              size="lg"
                              variant="outline"
                              type="button"
                              onClick={() => {
                                markTouched("mediaId");
                                field.onChange(
                                  toggleValue(field.value, item.value),
                                );
                              }}
                              className={
                                optionButtonClass(
                                  item.value === field.value,
                                  disabled,
                                ) + " p-4 min-w-max"
                              }
                            >
                              <span className="text-xs">{item.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ── Lamination ── */}
              {product.optionVisibility.isLamination &&
                product.lamination.length > 0 && (
                  <FormField
                    control={control}
                    name="laminationId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Lamination</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.lamination.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.lamination,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("laminationId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── Printing Side ── */}
              {product.optionVisibility.isPrintingSide &&
                product.printingSide.length > 0 && (
                  <FormField
                    control={control}
                    name="printingSideId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Printing side</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.printingSide.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.printingSide,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("printingSideId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── Finish Size ── */}
              {product.optionVisibility.isFinishSize &&
                product.finishSize.length > 0 && (
                  <FormField
                    control={control}
                    name="finishSizeId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Size</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.finishSize.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.finishSize,
                              item.value,
                            );
                            const label =
                              product.sizeFormat == "BOTH"
                                ? item.label
                                : product.sizeFormat == "IN"
                                  ? item.label.split("|")[0]
                                  : item.label.split("|")[1];

                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("finishSizeId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── Cover Type ── */}
              {product.optionVisibility.isCoverType &&
                product.coverType.length > 0 && (
                  <FormField
                    control={control}
                    name="coverTypeId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Cover type</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.coverType.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.coverType,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("coverTypeId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── Pad ── */}
              {product.optionVisibility.isPad && product.pad.length > 0 && (
                <FormField
                  control={control}
                  name="padId"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 gap-2.5">
                      <FormLabel>Pad</FormLabel>
                      <div className="flex flex-wrap w-full gap-2.5">
                        {product.pad.map((item, index) => {
                          const disabled = isOptionDisabled(
                            availableOptions.pad,
                            item.value,
                          );
                          return (
                            <Button
                              key={index}
                              size="lg"
                              variant="outline"
                              type="button"
                              onClick={() => {
                                markTouched("padId");
                                field.onChange(
                                  toggleValue(field.value, item.value),
                                );
                              }}
                              className={
                                optionButtonClass(
                                  item.value === field.value,
                                  disabled,
                                ) + " p-4 min-w-max"
                              }
                            >
                              <span className="text-xs">{item.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ── Pouch ── */}
              {product.optionVisibility.isPouch && product.pouch.length > 0 && (
                <FormField
                  control={control}
                  name="pouchId"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-1 gap-2.5">
                      <FormLabel>Pouch</FormLabel>
                      <div className="flex flex-wrap w-full gap-2.5">
                        {product.pouch.map((item, index) => {
                          const disabled = isOptionDisabled(
                            availableOptions.pouch,
                            item.value,
                          );
                          return (
                            <Button
                              key={index}
                              size="lg"
                              variant="outline"
                              type="button"
                              onClick={() => {
                                markTouched("pouchId");
                                field.onChange(
                                  toggleValue(field.value, item.value),
                                );
                              }}
                              className={
                                optionButtonClass(
                                  item.value === field.value,
                                  disabled,
                                ) + " p-4 min-w-max"
                              }
                            >
                              <span className="text-xs">{item.label}</span>
                            </Button>
                          );
                        })}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ── Foil Type ── */}
              {product.optionVisibility.isFoilType &&
                product.foilType.length > 0 && (
                  <FormField
                    control={control}
                    name="foilTypeId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Foil type</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.foilType.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.foilType,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("foilTypeId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── Foil Side ── */}
              {product.optionVisibility.isFoilSide &&
                product.foilSide.length > 0 && (
                  <FormField
                    control={control}
                    name="foilSideId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Foil side</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.foilSide.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.foilSide,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("foilSideId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── Spot UV ── */}
              {product.optionVisibility.isSpotUV &&
                product.spotUV.length > 0 && (
                  <FormField
                    control={control}
                    name="spotUVId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Spot UV</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.spotUV.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.spotUV,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("spotUVId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── File Finishing ── */}
              {product.optionVisibility.isFileFinishing &&
                product.fileFinishing.length > 0 && (
                  <FormField
                    control={control}
                    name="fileFinishingId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>File Finishing</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.fileFinishing.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.fileFinishing,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("fileFinishingId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

              {/* ── Quantity ── */}
              {product.optionVisibility.isQuantity &&
                product.quantity.length > 0 && (
                  <FormField
                    control={control}
                    name="quantityId"
                    render={({ field }) => (
                      <FormItem className="grid grid-cols-1 gap-2.5">
                        <FormLabel>Quantity</FormLabel>
                        <div className="flex flex-wrap w-full gap-2.5">
                          {product.quantity.map((item, index) => {
                            const disabled = isOptionDisabled(
                              availableOptions.quantity,
                              item.value,
                            );
                            return (
                              <Button
                                key={index}
                                size="lg"
                                variant="outline"
                                type="button"
                                onClick={() => {
                                  markTouched("quantityId");
                                  field.onChange(
                                    toggleValue(field.value, item.value),
                                  );
                                }}
                                className={
                                  optionButtonClass(
                                    item.value === field.value,
                                    disabled,
                                  ) + " p-4 min-w-max"
                                }
                              >
                                <span className="text-xs">{item.label}</span>
                              </Button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              <AttachmentErrorList />
              {/* ── Item Instruction ── */}
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
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ── Other Specifications ── */}
              {product.otherSpecifications.length > 0 && (
                <FormField
                  control={control}
                  name="otherSpecification"
                  render={() => (
                    <FormItem>
                      <FormLabel>Other specification</FormLabel>
                      <FormItem className="flex flex-row flex-wrap gap-2.5">
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
                                  {item.label}
                                  <span className="text-xs font-bold">
                                    Rs{" "}
                                    {item.price *
                                      Math.ceil(
                                        (quantity == 0 ? 1 : quantity * 1) /
                                          item.minQuantity,
                                      )}
                                  </span>
                                </FormLabel>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        ))}
                        <FormMessage />
                      </FormItem>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ── Design File Uploads ── */}
              {finishSize.height > 0 && finishSize.width > 0 && (
                <div
                  className={cn(
                    attachments.length - previewItems.length >= 2
                      ? "grid-cols-2"
                      : "grid-cols-1",
                    "grid gap-2.5",
                  )}
                >
                  {fields.map((attachment, index) => (
                    <div key={index} className="w-full min-w-0">
                      <FormField
                        control={control}
                        name={`attachments.${index}`}
                        render={() => (
                          <FormItem>
                            <DesignFileUpload
                              name={`attachments.${index}`}
                              finishHeight={finishSize.height}
                              finishWidth={finishSize.width}
                              imageTypeId={attachment.imageTypeId}
                              imageTypeName={attachment.imageTypeName}
                              cellCount={cellCount}
                              previousHeight={previousDimension.height}
                              previousWidth={previousDimension.width}
                            />
                            <FormMessage />
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
              )}

              <Button
                size="lg"
                className="w-full"
                disabled={loading || formState.isSubmitting}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
                {formState.isSubmitting && <Spinner />}
              </Button>

              <CartItemSheet
                className="w-full"
                TriggerButton={
                  <Button size="lg" variant="outline" className="w-full">
                    <Eye className="mr-2 h-5 w-5" /> Preview Cart
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
