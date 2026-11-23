import { Link, useNavigate } from "react-router";
import { ShoppingCart, User, Wallet, Menu, UserPen, ClipboardClock, BookImage, ClipboardPen, MessageCircleQuestionMark, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Heart } from "lucide-react";

import
{
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import ThemeToggler from "../theme-toggler/theme-toggler";
import CartItemSheet from "../cart/CartItemSheet";
import { ChevronDown } from "lucide-react";
import WishlistItemSheet from "../wishlist/wishlist-item-sheet";
import { Badge } from "../ui/badge";
export default function RightHeader()
{

  const { cartInfo } = useCart();
  const { user, isAuthenticated, signOutAsync } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 shrink-0">

      <ThemeToggler />
      {/* <Link to={`/catalog`} className="hidden sm:flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
        <BookImage className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">
          Catalogue
        </span>
      </Link> */}

      {isAuthenticated ? (
        <>
          {/* Wallet */}
          <Link to={`/wallet`} className="hidden sm:flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">
              <span className="text-primary">Rs. </span> {cartInfo.totalWalletAmount}
            </span>
          </Link>
          {/* <Link to={`/customquote`} className="hidden sm:flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <ClipboardPen className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">
              Custom quote
            </span>
          </Link> */}

          {/* Cart */}
          {/* <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate("/cart")}
          >
            <ShoppingCart className="h-5 w-5" />
            {cartInfo.totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-primary text-xs font-bold">
                {cartInfo.totalItems}
              </span>
            )}
          </Button> */}
          <CartItemSheet
            TriggerButton={
              <Button size='icon' variant='ghost' className="relative">
                <ShoppingCart />
                <Badge className="rounded-full size-5 absolute -top-2 -right-1">
                  <span className="m-auto">{cartInfo.totalItems}</span>
                </Badge>
              </Button>}
          />
          <WishlistItemSheet BtnIcon={<Heart />} label="" />
          {/* User */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="hidden md:flex items-center gap-2 px-2">
                <User className="h-5 w-5" />
                <span className="text-sm font-semibold">Welcome, {user && <span className="text-xs font-normal">{user.name}</span>}</span>
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-85">
              <div className="px-3 py-2 ">
                <p className="font-medium break-all">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div> <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <UserPen className="h-5 w-5 " /> Profile </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/orders")}>
                <ClipboardClock className="h-5 w-5" />
                Order History
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/wallet")}>
                <Wallet className="h-5 w-5" />
                Manage Wallet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/catalog")}>
                <BookImage className="h-5 w-5" />
                Catalogue
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => navigate("/customquote")}>
                <ClipboardPen className="h-5 w-5" /> Custom Quote </DropdownMenuItem> */}
              <DropdownMenuItem onClick={() => navigate("/faq")}>
                <MessageCircleQuestionMark className="h-5 w-5" /> Support </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/enquiry")}>
                <ClipboardPen className="h-5 w-5" /> Enquiries </DropdownMenuItem>
              <DropdownMenuSeparator />
              {!isAuthenticated && (<> <DropdownMenuItem onClick={() => navigate("/auth/login")}>
                Login
              </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/auth/register")}>
                  Register
                </DropdownMenuItem> </>)}
              {isAuthenticated && (<DropdownMenuItem onClick={signOutAsync} className="text-destructive" > Sign Out </DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>

        </>

      ) : (
        <div className="hidden md:flex gap-3">
          <Button variant="ghost" onClick={() => navigate("/auth/login")}>
            Sign In
          </Button>
          <Button variant="accent" onClick={() => navigate("/auth/register")}>
            Register
          </Button>
        </div>
      )}

      {/* Mobile menu */}
      <div className="lg:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-85">
            <div className="px-3 py-2 ">
              <p className="font-medium break-all">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div> <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserPen className="h-5 w-5 " /> Profile </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/orders")}>
              <ClipboardClock className="h-5 w-5" />
              Order History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/wallet")}>
              <Wallet className="h-5 w-5" />
              Manage Wallet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/catalog")}>
              <BookImage className="h-5 w-5" />
              Catalog
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/customquote")}>
              <ClipboardPen className="h-5 w-5" /> Custom Quote </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/faq")}>
              <MessageCircleQuestionMark className="h-5 w-5" /> Support </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/enquiry")}>
              <ClipboardPen className="h-5 w-5" /> Enquiries </DropdownMenuItem>
            <DropdownMenuSeparator />
            {!isAuthenticated && (<> <DropdownMenuItem onClick={() => navigate("/auth/login")}>
              Login
            </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/auth/register")}>
                Register
              </DropdownMenuItem> </>)}
            {isAuthenticated && (<DropdownMenuItem onClick={signOutAsync} className="text-destructive" > Sign Out </DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
}
