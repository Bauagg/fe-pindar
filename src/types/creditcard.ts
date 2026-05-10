export interface CreditCardItem {
  id: string;
  title: string;
  yearlyFee: string;
  detailYearlyFee: string;
  benefitId: string;
  benefitName: string;
  redirectLink: string | null;
  imageLink: string;

  features: {
    feature: string;
  }[];
}

export interface CreditCardPublisher {
  id: string;
  name: string;
}

export interface CreditCardType {
  id: string;
  name: string;
}

export interface CreditCardDetail {
  id: string;
  title: string;

  yearlyFee: string;
  detailYearlyFee: string;

  additionalCardAnnualFee: string;

  purchaseRate: string;

  cashbackRate: string;
  detailCashbackRate: string;

  minimumWithdraw: string;

  whoCanRegister: string;

  mustHaveCreditCard: boolean;

  monthlyIncomeMinimum: string;
  yearlyIncomeMinimum: string;

  monthlyMinimumPayment: string;

  latePaymentChargePenalty: string;
  latePaymentAdminCharge: string;

  maximumWithdrawDaily: string | null;

  mainCardMinimumAge: number;
  mainCardMaximumAge: number;

  additionalCardMinimumAge: number;

  detailInformation: string;

  termsDocument: string;

  billPaymentTutorial: string;

  applyTutorial: string | null;

  termAndConditions: string | null;

  mainFeature: string;

  allFacilities: string;

  feeAndCharges: string;

  redirectLink: string | null;

  imageId: string;

  imageLink: string;

  publisher: CreditCardPublisher;

  type: CreditCardType;

  features: string[];
}
