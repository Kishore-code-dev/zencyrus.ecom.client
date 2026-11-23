import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Button } from "../ui/button"
import { useState, type ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import type { ProductNavItem, } from "@/types/nav-item"
import { Link } from "react-router"
import { debounce } from "@/lib/debounce"
// import { Badge } from "../ui/badge"

interface NavItemTriggerProps extends ComponentProps<typeof Button>
{
    navItem: ProductNavItem
}

export default function NavItemPopoverTrigger({ className, navItem, ...props }: NavItemTriggerProps)
{
    const [open, setOpen] = useState<boolean>(false)
    const onMouseEnter = () =>
    {
        setOpen(true)
    }

    if (navItem.isShown)
    {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant='ghost'
                        className={cn(className, "rounded-xs text-sm! relative p-0 m-0 text-[0.65rem]")}
                        onMouseEnter={onMouseEnter}
                        onMouseLeave={() =>
                            debounce(() =>
                            {
                                setOpen(false)
                            }, 1000)}
                        disabled={!navItem.isShown}
                        {...props}
                    >
                        {navItem.name}
                        {open ? <ChevronUp /> : <ChevronDown />}
                    </Button>
                </PopoverTrigger>
                <PopoverContent align="center"
                    side="bottom"
                    className="w-full"
                    onMouseEnter={() =>
                        debounce(() =>
                        {
                            setOpen(true)
                        }, 1000)}
                    onMouseLeave={() => setOpen(false)}
                >
                    <div className={cn("max-h-6/12 rounded-sm overflow-auto max-w-7xl flex flex-wrap gap-5")}>
                        {navItem.subNavItem.map(subNavItem =>
                            <div className="space-y-2">
                                <span className="font-bold text-sm">{subNavItem.classification.label}</span>
                                {subNavItem.menus.map((item, idx) =>
                                    item.isDynamicConfiguration ? (
                                        <div key={idx} className="h-fit max-w-full text-wrap grid grid-cols-1 gap-3.5 mt-2">
                                            <Link
                                                to={`/product/dynamicconfiguration/${item.productId}`}
                                                className="h-full w-full text-sm text-wrap wrap-break-word text-muted-foreground rounded-md hover:text-primary"
                                                style={{ textAlign: "left", textWrapMode: "wrap", textWrapStyle: "stable" }}
                                                onClick={() => setOpen(false)}
                                            >
                                                {item.alias}
                                            </Link>
                                        </div>
                                    )
                                        : (
                                            <>
                                                {item.products.map((product) => (
                                                    <div key={product.value} className="h-fit max-w-full text-wrap grid grid-cols-1 gap-1.5 mt-2">
                                                        {product.isShown ? (
                                                            <Link
                                                                key={product.value}
                                                                to={`product/${product.value}/${product.quantityId}`}
                                                                className="h-full w-full text-sm text-wrap wrap-break-word text-muted-foreground rounded-md hover:text-primary"
                                                                style={{ textAlign: "left", textWrapMode: "wrap", textWrapStyle: "stable" }} onClick={() => setOpen(false)}>
                                                                {product.label}
                                                            </Link>
                                                        ) : (
                                                            <div
                                                                className="h-full w-full text-sm text-wrap wrap-break-word text-muted-foreground rounded-md "
                                                                style={{ textAlign: "left", textWrapMode: "wrap", textWrapStyle: "stable" }} onClick={() => setOpen(false)}>
                                                                {product.label}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </>
                                        ))}
                            </div>)}
                    </div>
                </PopoverContent>
            </Popover >
        )
    }

    return (
        // <Button
        //     size='lg'
        //     variant='ghost'
        //     className={cn(className, "rounded-xs relative")}
        //     disabled
        //     {...props}
        // >
        //     {navItem.name}
        //     <ChevronDown />
        // </Button>
        <></>
    )
}
