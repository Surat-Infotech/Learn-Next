import { IResponse } from '../types';

export type IInventoryDiamondInquiryRequest = {
  name: string;
  email: string;
  mobile?: string;
  country_code?: string;
  reference?: string;
  message?: string;
};

export type IInventoryVideoInquiryRequest = {
  name: string;
  email: string;
  country_code?: string;
  mobile?: string;
  sku: string;
};

export type ICustomengagementRingInquiryRequest = {
  first_name: string;
  last_name: string;
  mobile?: string;
  country_code?: string;
  email: string;
  images: string[];
  reference_url: string;
  description: string;
  sku?: string;
  metal?: string;
  size?: string;
};

export type IContactFeedbackInquiryRequest = {
  name: string;
  email: string;
  message?: string;
};

export type IInventoryDiamondInquiryResponse = IResponse<any>;
export type IInventoryVideoInquiryResponse = IResponse<any>;
export type ICustomengagementRingInquiryResponse = IResponse<any>;
export type IContactFeedbackInquiryResponse = IResponse<any>;
