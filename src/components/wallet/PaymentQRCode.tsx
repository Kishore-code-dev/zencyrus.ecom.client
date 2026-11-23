import QRCode from "@/assets/QRCODE.jpg"
export default function PaymentQRCode()
{
    return (
        <div className='h-60 w-full border border-border rounded-md grid grid-cols-1'>
            <img
                loading="lazy"
                decoding="async" src={QRCode} className="bg-cover aspect-auto size-40 rounded-md m-auto" />
            <span className="text-sm font-semibold mx-auto">Gokul Printers</span>
        </div>
    )
}
