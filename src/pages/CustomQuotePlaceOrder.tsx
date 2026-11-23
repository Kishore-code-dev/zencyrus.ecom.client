import CustomQuoteCheckout from "@/components/customquote/CustomQuoteCheckout"
import CustomQuoteDetails from "@/components/customquote/CustomQuoteDetails"
import CustomJobProvider from "@/providers/customjob-provider"

export default function CustomQuotePlaceOrder()
{
    return (
        <CustomJobProvider>
            <div className="grid grid-cols-12 gap-5 p-8">
                <CustomQuoteDetails />
                <CustomQuoteCheckout />
            </div>
        </CustomJobProvider>
    )
}
