// components/CheckoutButton.tsx
'use client';

import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton({ items }: { items: any[] }) {
  const handleCheckout = async () => {
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();
    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId: data.id });
  };

  return <button onClick={handleCheckout}>Pay Now</button>;
}
