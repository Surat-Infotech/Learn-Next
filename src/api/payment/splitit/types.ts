export type ISplititPaymentIntentRequest = {
    total_amount: number;
    shopper_details: {
        FullName: string,
        Email: string,
        PhoneNumber: string,
        Culture: string,
    };
    billing_address: {
        AddressLine1: string,
        AddressLine2: string,
        City: string,
        Country: string,
        State: string,
        Zip: string,
    }
};
export interface ISplitItPaymentIntentResponse {
    isSuccess: boolean;
    status: number;
    message: string;
    data: ISplitItData;
}
export interface ISplitItData {
    InstallmentPlanNumber: string,
    RefOrderNumber: string,
    PurchaseMethod: string,
    Status: string,
    Currency: string,
    Amount: number,
    ExtendedParams: any,
    Shopper: null,
    BillingAddress: any,
    CheckoutUrl: string
}