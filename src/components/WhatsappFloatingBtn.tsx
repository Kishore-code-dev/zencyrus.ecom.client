import { useCallback } from "react";
import { Button } from "./ui/button";

export default function WhatsappFloatingBtn()
{
    const phoneNumber = "7358992255";
    const message = "Hi, I have a query about printing services.";

    const handleOnClick = useCallback(() =>
    {
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, "_blank", "noopener,noreferrer");
    }, []);

    return (
        <Button
            size="icon-lg"
            onClick={handleOnClick}
            className="fixed bottom-6 right-6 z-50 rounded-full bg-[#25D366] hover:bg-[#1ebe5b] shadow-lg shadow-black/20 transition-transform duration-200 hover:scale-105"
        >
            <img src="/whatsapp.png" className="size-10 rounded-full" />
        </Button>
    );
}