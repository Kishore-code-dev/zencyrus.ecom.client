import { usePagedResult } from '@/hooks/use-paged-result';
import type { CartItem } from '@/types/cart';
import CartItemCard from './CartItemCard';
import CartItemSkeleton from './CartItemSkeleton';

const SKELETON_COUNT = Array.from({ length: 10 })

const CartItems = () =>
{
  const { pagedResult, loading = false } = usePagedResult()
  const items = (pagedResult.items || []) as CartItem[];


  if (loading)
  {
    return (
      <div className='lg:col-span-2 grid grid-cols-1 gap-2.5'>
        {SKELETON_COUNT.map((_, i) => <CartItemSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className="lg:col-span-2 space-y-6">
      {items.map((item: CartItem) => (
        <CartItemCard key={item.id} cartItem={item} />
      ))}
    </div>
  )
}

export default CartItems