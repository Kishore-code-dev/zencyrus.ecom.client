import { useEffect, useState, useTransition } from 'react'
import { api } from "@/config/api"
import { useApiAction } from "@/hooks/use-api-action"
import { AxiosError } from "axios"
import NavItemSkeleton from './nav-item-skeleton'
import NavItemPopoverTrigger from './nav-item-popover-trigger'
// import NavItemDropdownTrigger from './nav-item-dropdown-trigger'
import type { ProductNavItem } from '@/types/nav-item'
// import { Button } from '../ui/button'
// import { ChevronLeft, ChevronRight } from 'lucide-react'
// import { Ellipsis } from 'lucide-react'
// import { X } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '../ui/button'

interface NavItemProps
{
  mode?: 'dropdown' | 'popover'
}


export default function NavItem({ }: NavItemProps)
{
  const { apiActionAsync } = useApiAction()
  const [loading, startTransition] = useTransition()
  const [items, setItems] = useState<ProductNavItem[]>([])

  // const [showAll, setShowAll] = useState(false)

  useEffect(() =>
  {
    startTransition(async () =>
    {
      try
      {
        const response = await api.get(`navitem/getall`)
        if (response.status == 200 && response.data)
        {
          setItems(response.data)
        }
      } catch (error)
      {
        if (error instanceof AxiosError && error.response)
        {
          await apiActionAsync(error.response)
        }
      }
    })

  }, [])

  // const visibleItems = showAll ? items.slice(7) : items.slice(0, 7)

  return (
    <nav className="h-fit w-full md:grid p-2.5 hidden sticky top-0 z-50 bg-background">
      {loading ? (
        <NavItemSkeleton />
      ) : (
        <div className='w-full flex items-center gap-2 overflow-auto relative' style={{ scrollbarWidth: 'none' }}>
          <Link to={'/catalog'}>
            <Button
              size='lg'
              variant='ghost'
              className={"rounded-xs text-sm! relative p-0 m-0 text-[0.65rem]"}
            >
              All Product
            </Button>
          </Link>
          {items.map(item => (
            <NavItemPopoverTrigger key={item.id} navItem={item} />
          ))}
        </div>
      )}
    </nav>
  )
}
