"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Button } from "./ui/button";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function CheckoutButton({
  items,
  appointmentId,
}: {
  appointmentId?: string;
  items: any[];
}) {
  if (!appointmentId) return;

  const handleCheckout = async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, appointmentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Checkout failed");
      }

      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to initialize");

      await stripe.redirectToCheckout({ sessionId: data.id });
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <Button className="w-fit mx-auto" onClick={handleCheckout}>
      Pay Now
    </Button>
  );
}
