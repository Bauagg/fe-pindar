// types/lender.ts

export interface Lender {
  id: string;
  lendername: string;
  imagelink: string;
  maxtenor: number;
  maxloan: string;
  ispin: boolean;
  directlink: string;
}

export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

export interface LenderResponse {
  code: number;
  message: string;
  data: {
    lenders: Lender[];
    pagination: Pagination;
  };
}

export interface FilterState {
  key: string;
  selectedPlafond: string;
  selectedLoanAmounts: string;
  selectedPayments: string;
}
