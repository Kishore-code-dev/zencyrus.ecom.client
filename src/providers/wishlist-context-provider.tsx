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
  WishlistItem,
  WishListContextValue,
  WishlistProviderProps,
  WishlistProduct

} from "@/types/wishlist";
import { useAuth } from "@/hooks/use-auth";


export const WishListContextProvider = createContext<WishListContextValue | null>(null);

export function WishListProvider({ children }: WishlistProviderProps)
{
  const { apiActionAsync } = useApiAction();
  const { isAuthenticated = false } = useAuth();
  const [loading, startTransition] = useTransition();
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>([]);

  const addToWishListItemAsync = async (payload: WishlistItem) =>
  {
    try
    {
      const response = await api.post("mywishlist/create", payload);

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

  useEffect(() =>
  {
    if (!isAuthenticated) return;

    fetchData();

  }, [isAuthenticated]);

  const fetchData = async () =>
  {
    startTransition(async () =>
    {
      try
      {
        const response = await api.get("mywishlist/getall");

        if (response.status === 200 && response.data)
        {
          setWishlistItems(response.data);
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


  const removeWishListItemAsync = useCallback(async (id: string) =>
  {
    try
    {
      await api.delete(`mywishlist/delete?id=${id}`);
      await fetchData();
    } catch (error)
    {
      if (error instanceof AxiosError && error.response)
      {
        await apiActionAsync(error.response);
      }
    }
  }, []);



  const contextValue = useMemo(
    () => ({
      addToWishListItemAsync,
      removeWishListItemAsync,
      loading,
      wishlistItems,
      fetchData
    }),
    [
      loading,
      addToWishListItemAsync,
      removeWishListItemAsync,
      wishlistItems,
      fetchData
    ],
  );

  return (
    <WishListContextProvider.Provider value={contextValue}>
      {children}
    </WishListContextProvider.Provider>
  );
}
