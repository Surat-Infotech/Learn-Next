import { Api } from '..';
import {
  IInventoryVideoInquiryRequest,
  IInventoryVideoInquiryResponse,
  IContactFeedbackInquiryRequest,
  IInventoryDiamondInquiryRequest,
  IContactFeedbackInquiryResponse,
  IInventoryDiamondInquiryResponse,
  ICustomengagementRingInquiryRequest,
  ICustomengagementRingInquiryResponse,
} from './types';

class Inquiry extends Api {
  readonly baseUrl: string = 'v1/inquiry';

  /**
   * Method to send inquiry for diamond
   */
  readonly sendDiamondInquiry = (payload: IInventoryDiamondInquiryRequest, name: string) => {
    const obj = {
      type: name,
      form_json: payload,
    };
    return this.http.post<IInventoryDiamondInquiryResponse>(this.route(''), obj);
  };

  /**
   * Method to send inquiry for video
   */
  readonly sendVideoInquiry = (payload: IInventoryVideoInquiryRequest, name: string) => {
    const obj = {
      type: name,
      form_json: payload,
    };
    return this.http.post<IInventoryVideoInquiryResponse>(this.route(''), obj);
  };

  /**
   * Method to send inquiry for custom engagement ring
   */
  readonly sendcustomEngagementRingInquiry = (
    payload: ICustomengagementRingInquiryRequest,
    name: string
  ) => {
    const obj = {
      type: name,
      form_json: payload,
    };
    return this.http.post<ICustomengagementRingInquiryResponse>(this.route(''), obj);
  };

  /**
   * Method to send inquiry for contact from
   */
  readonly sendcontactInquiry = (payload: IContactFeedbackInquiryRequest, name: string) => {
    const obj = {
      type: name,
      form_json: payload,
    };
    return this.http.post<IContactFeedbackInquiryResponse>(this.route(''), obj);
  };

  /**
   * Method to send inquiry for feedback form
   */
  readonly sendfeedbackInquiry = (payload: IContactFeedbackInquiryRequest, name: string) => {
    const obj = {
      type: name,
      form_json: payload,
    };
    return this.http.post<IContactFeedbackInquiryResponse>(this.route(''), obj);
  };
}

export const inquiryApi = new Inquiry();
