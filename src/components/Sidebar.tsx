import React from "react";
import
{
    UserPen,
    ClipboardClock,
    Wallet,
    BookImage,
    ClipboardPen,
    MessageCircleQuestionMark,
    // LogOut,
} from "lucide-react";
import { NavLink } from "react-router";
import { Button } from "./ui/button";

const menuItems = [
    { name: "Profile", icon: UserPen, path: "/profile" },
    { name: "Order History", icon: ClipboardClock, path: "/orders" },
    { name: "Manage Wallet", icon: Wallet, path: "/wallet" },
    { name: "Catalogue", icon: BookImage, path: "/catalog" },
    // { name: "Custom Quote", icon: ClipboardPen, path: "/customquote" },
    { name: "Support", icon: MessageCircleQuestionMark, path: "/faq" },
    { name: "Enquiry", icon: ClipboardPen, path: "/enquiry" },
    // { name: "Change Password", icon: Lock, path: "/change-password" },
];

const Sidebar: React.FC = () =>
{
    return (
        <div className="min-w-64 sticky top-0 bg-background border-r text-foreground flex flex-col justify-between p-4">
            <div className="">
                <nav className="space-y-1 grid grid-cols-1 gap-2.5">
                    {menuItems.map((item, index) =>
                    {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={index}
                                to={item.path}
                            >
                                <Button variant='ghost' className="w-full flex flex-row justify-start">
                                    <Icon size={18} />
                                    <span className="text-sm">{item.name}</span>
                                </Button>
                            </NavLink>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;