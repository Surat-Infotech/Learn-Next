export type IKlarnaPaymentIntentRequest = {
    locale: string,
    order_amount: number;
    purchase_country: string,
    purchase_currency: string,
    order_tax_amount: number,
    order_lines: any,
    billing_address: {
        given_name: string,
        family_name: string,
        email: string,
        phone: string,
        street_address: string,
        city: string,
        postal_code: string,
        region: string,
        country: string,
        title: string
    },
    shipping_address: {
        given_name: string,
        family_name: string,
        email: string,
        phone: string,
        street_address: string,
        city: string,
        postal_code: string,
        region: string,
        country: string,
        title: string
    }
}
export interface IKlarnaPaymentIntentResponse {
    isSuccess: boolean;
    status: number;
    message: string;
    data: IKlarnaData
}
export interface IKlarnaData {
    client_token: string,
    payment_method_categories: any,
    session_id: string,
}