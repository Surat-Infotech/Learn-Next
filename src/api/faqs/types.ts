import { IResponse } from "../types";

export type FaqDetail = {
  _id?: string;
  question: string;
  answer: string;
};

export type SingleFaqResponse = {
  _id: string;
  faqCategory: string;
  __v: number;
  created_at: string; // ISO date string
  deleted_at: string | null;
  detail_json: FaqDetail[];
  updated_at: string; // ISO date string
};



export type IFAQsResponse = IResponse<SingleFaqResponse[]>;
