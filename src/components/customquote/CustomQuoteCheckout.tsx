import CustomQuoteDocuments from "./CustomQuoteDocuments";
// import CustomQuoteEstimate from "./CustomQuoteEstimate";
import CustomQuotePaymentMethod from "./CustomQuotePaymentMethod";
import CustomQuoteShippingAddress from "./CustomQuoteShippingAddress";

export default function CustomQuoteCheckout()
{
    return (
        <div className="col-span-9 h-fit grid grid-cols-1 gap-5">
            <CustomQuoteDocuments />
            {/* <CustomQuoteEstimate /> */}
            <div className="grid grid-cols-2 gap-5">
                <CustomQuoteShippingAddress />
                <CustomQuotePaymentMethod />
            </div>
        </div>
    )
}
