export type IPaymentIntentRequest = {
  total_amount: number;
  order_id: string;
};

export interface IPaymentIntentResponse {
  isSuccess: boolean;
  status: number;
  message: string;
  clientSecret: string;
  data: IData;
}

export interface IData {
  id: string;
  object: string;
  amount: number;
  amount_capturable: number;
  amount_details: IAmountDetails;
  amount_received: number;
  application: any;
  application_fee_amount: any;
  automatic_payment_methods: IAutomaticPaymentMethods;
  canceled_at: any;
  cancellation_reason: any;
  capture_method: string;
  client_secret: string;
  confirmation_method: string;
  created: number;
  currency: string;
  customer: any;
  description: any;
  invoice: any;
  last_payment_error: any;
  latest_charge: any;
  livemode: boolean;
  metadata: IMetadata;
  next_action: any;
  on_behalf_of: any;
  payment_method: any;
  payment_method_configuration_details: IPaymentMethodConfigurationDetails;
  payment_method_options: IPaymentMethodOptions;
  payment_method_types: string[];
  processing: any;
  receipt_email: any;
  review: any;
  setup_future_usage: any;
  shipping: any;
  source: any;
  statement_descriptor: any;
  statement_descriptor_suffix: any;
  status: string;
  transfer_data: any;
  transfer_group: any;
}

export interface IAmountDetails {
  tip: ITip;
}

export interface ITip { }

export interface IAutomaticPaymentMethods {
  allow_redirects: string;
  enabled: boolean;
}

export interface IMetadata { }

export interface IPaymentMethodConfigurationDetails {
  id: string;
  parent: any;
}

export interface IPaymentMethodOptions {
  afterpay_clearpay: IAfterpayClearpay;
  card: ICard;
  cashapp: ICashapp;
  klarna: IKlarna;
}

export interface IAfterpayClearpay {
  reference: any;
}

export interface ICard {
  installments: any;
  mandate_options: any;
  network: any;
  request_three_d_secure: string;
}

export interface ICashapp { }

export interface IKlarna {
  preferred_locale: any;
}
