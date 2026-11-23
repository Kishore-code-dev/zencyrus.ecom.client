import
{
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { AxiosError } from "axios";
import { api } from "@/config/api";
import { useApiAction } from "@/hooks/use-api-action";
import type {
  CartInfo,
  AddToCartItem,
  CartContextValue,
  CartProviderProps,
  UpdateCartItem,
  AddToProductDynamicConfigurationSchema,
} from "@/types/cart";
import { useAuth } from "@/hooks/use-auth";
import type { DesignFileSchemaType } from "@/config/validate-design-file";

export const CartContextProvider = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: CartProviderProps)
{
  const { apiActionAsync } = useApiAction();
  const { isAuthenticated = false } = useAuth();
  const [loading, startTransition] = useTransition();
  const [cartInfo, setCartInfo] = useState<CartInfo>({
    totalAmount: 0,
    totalItems: 0,
    totalWalletAmount: 0,
    creditBalance: 0
  });

  const buildFormData = (payload: AddToCartItem): FormData =>
  {
    const form = new FormData();

    form.append("CustomerId", String(payload.customerId));
    form.append("ProductId", String(payload.productId));
    form.append("QuantityId", String(payload.quantityId));
    form.append("Instruction", payload.instruction ?? "");

    payload.otherSpecification.forEach((id, i) =>
    {
      form.append(`OtherSpecification[${i}]`, String(id));
    });

    // Helper to append a document sub-object
    const appendDocument = (prefix: string, doc: DesignFileSchemaType) =>
    {
      form.append(`${prefix}.IsValid`, String(doc.isValid));
      form.append(`${prefix}.DocumentHeightInPx`, String(doc.documentHeightInPx));
      form.append(`${prefix}.DocumentHeightInMM`, String(doc.documentHeightInMM));
      form.append(`${prefix}.DocumentWidthInPx`, String(doc.documentWidthInPx));
      form.append(`${prefix}.DocumentWidthInMM`, String(doc.documentWidthInMM));
      form.append(`${prefix}.CellCount`, String(doc.cellCount));
      form.append(`${prefix}.ImageTypeId`, String(doc.imageTypeId));
      form.append(`${prefix}.ImageTypeName`, String(doc.imageTypeName));
      form.append(`${prefix}.CurrentDPI`, String(doc.currentDPI));
      form.append(`${prefix}.PreviewUrl`, String(doc.imageUrl));

      if (doc.document instanceof File)
      {
        form.append(`${prefix}.Document`, doc.document, doc.document.name);
      }
    };
    payload.attachments.forEach((doc, i) =>
    {
      appendDocument(`Attachments[${i}]`, doc);
    });

    return form;
  };

  const addToProductDynamicConfigurationAsync = async (payload: AddToProductDynamicConfigurationSchema) =>
  {
    const cartItemPayload: AddToCartItem = {
      attachments: payload.attachments,
      instruction: payload.instruction,
      otherSpecification: payload.otherSpecification,
      productId: payload.productId,
      quantityId: payload.productQuantityId,
      customerId: "",
      noOfUnits: 1
    }

    return await addToCartItemAsync(cartItemPayload);
  }

  const addToCartItemAsync = async (payload: AddToCartItem) =>
  {
    try
    {
      const form = buildFormData(payload);

      const response = await api.post(`cart/create`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200 && response.data)
      {
        await fetchData();
        return { isSuccess: true };
      }
      return { isSuccess: false };
    } catch (error)
    {
      if (error instanceof AxiosError && error.response)
      {
        await apiActionAsync(error.response);
      }
      return { isSuccess: false };
    }
  };

  const removeToCartItemAsync = useCallback(async (id: string) =>
  {
    try
    {
      const response = await api.delete(`cart/delete?id=${id}`);
      if (response.status == 200 && response.data)
      {
        await fetchData()
      }
    } catch (error)
    {
      if (error instanceof AxiosError && error.response)
      {
        await apiActionAsync(error.response);
      }
    }
  }, []);

  const updateCartItemAsync = useCallback(async (payload: UpdateCartItem) =>
  {
    try
    {
      const response = await api.post(`cart/update?id=${payload.id}`, payload);
      if (response.status == 200 && response.data)
      {
        await fetchData()
        return response.data ?? 0
      }
      return 0;
    } catch (error)
    {
      if (error instanceof AxiosError && error.response)
      {
        await apiActionAsync(error.response);
        return 0;
      }
      return 0;
    }
  }, []);

  const fetchData = async () =>
  {
    startTransition(async () =>
    {
      try
      {
        const response = await api.get(`cart/info`);
        if (response.status == 200 && response.data)
        {
          setCartInfo(response.data);
        }
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response);
        }
      }
    });
  };

  useEffect(() =>
  {
    if (!isAuthenticated) return;
    fetchData();
  }, [isAuthenticated]);

  const contextValue = useMemo(
    () => ({
      addToCartItemAsync,
      removeToCartItemAsync,
      updateCartItemAsync,
      loading,
      cartInfo,
      fetchData,
      addToProductDynamicConfigurationAsync
    }),
    [
      loading,
      cartInfo,
      addToCartItemAsync,
      updateCartItemAsync,
      removeToCartItemAsync,
      fetchData,
    ],
  );

  return (
    <CartContextProvider.Provider value={contextValue}>
      {children}
    </CartContextProvider.Provider>
  );
}
