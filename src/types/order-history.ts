export interface OrdersHistory
{
    id: number;
    orderReferenceNumber: string;
    status: string;
    totalAmount: number;
    refundAmount: number
    subTotalAmount: number;
    shippingAmount: number;
    orderDate: Date;
    totalItems: number;
    addressReferenceName: string;
    addressLine1: string;
    addressLine2: string;
    mobileNo: string;
    country: string;
    state: string;
    district: string;
    city: string;
    pinCode: string;
    trackingNumber: string;
    shippingProvider: string;
    trackingUrl: string;
    isCustomJob: number;
    customJobId: null;
    isPaymentSucceeded: string
}



export interface Address
{
    city: string;
    state: string;
    country: string;
    pinCode: string;
    district: string;
    MobileNo: string;
    trackingUrl: string;
    addressLine1: string;
    addressLine2: string;
    trackingNumber: null;
    shippingProvider: string;
    addressReferenceName: string;
}

export interface OrderItem
{
    amount: number;
    product: string;
    imageUrl: string;
    quantity: string;
}