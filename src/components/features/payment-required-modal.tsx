"use client";

import { useEffect, useState } from "react";
import * as Sentry from "@sentry/nextjs";
import { useSubscription } from "@/hooks/use-subscription";
import { createCheckoutSession } from "@/services/payment/checkout";
import { SubscriptionStatus } from "@/models/enums/subscription-status";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { PaymentRequiredModalProps } from "@/models/interfaces/components/features/payment-required-modal";
import { formatAmount } from "@/lib/payment";

/**
 * Modal component that appears when payment is required
 *
 * Shows when subscription status is "past_due" or trial expired without payment.
 * Handles checkout session creation and redirects to Stripe Checkout.
 *
 * @param open - Optional controlled open state
 * @param onOpenChange - Optional callback when open state changes
 */
export function PaymentRequiredModal({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  translation,
}: PaymentRequiredModalProps) {
  const { data, isTrialExpiredWithoutActivePlan } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const shouldBeOpen =
    openProp !== undefined
      ? openProp
      : isTrialExpiredWithoutActivePlan ||
        data?.status === SubscriptionStatus.PAST_DUE;

  useEffect(() => {
    setIsOpen(shouldBeOpen);
  }, [shouldBeOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChangeProp?.(newOpen);
  };

  const handlePayNow = async () => {
    try {
      setIsLoading(true);
      const { checkoutUrl } = await createCheckoutSession();

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { component: "payment-required-modal" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!data) {
    return null;
  }

  const invoiceAmount = data.latestInvoice?.amount ?? 0;
  const invoiceCurrency = data.latestInvoice?.currency ?? "brl";

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {translation?.payment.required ?? "Payment Required"}
          </DialogTitle>
          <DialogDescription>
            {data.status === SubscriptionStatus.PAST_DUE
              ? (translation?.payment.pastDue ??
                "Your subscription has a pending payment. To continue using the service, payment is required.")
              : (translation?.payment.trialExpired ??
                "Your trial period has expired. To continue using the service, add a payment method.")}
          </DialogDescription>
        </DialogHeader>

        {data.latestInvoice && invoiceAmount > 0 && (
          <div className="py-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="text-sm font-medium">
                  {translation?.payment.amountToPay ?? "Amount to pay"}
                </p>
                <p className="text-2xl font-bold">
                  {formatAmount({
                    amount: invoiceAmount,
                    currency: invoiceCurrency,
                    locale: translation ? "en-US" : "pt-BR",
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isLoading}
          >
            {translation?.payment.later ?? "Later"}
          </Button>
          <Button onClick={handlePayNow} disabled={isLoading}>
            {isLoading
              ? (translation?.payment.loading ?? "Loading...")
              : (translation?.payment.payNow ?? "Pay Now")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

PaymentRequiredModal.displayName = "PaymentRequiredModal";
