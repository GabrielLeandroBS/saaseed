/**
 * Payment required modal component interfaces
 *
 * Interfaces for payment required modal component.
 */

import type { DashboardDictionary } from "@/models/types/i18n";

/**
 * Props for PaymentRequiredModal component
 */
export interface PaymentRequiredModalProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  translation?: {
    payment: DashboardDictionary["payment"];
  };
}

/**
 * Parameters for formatAmount function
 */
export interface FormatAmountParams {
  amount: number;
  currency: string;
  locale?: string;
}
