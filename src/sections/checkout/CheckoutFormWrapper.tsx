import { FC, Ref } from 'react';

import { env } from '@env';
import { Elements } from '@stripe/react-stripe-js';
import { Appearance, loadStripe, StripeElementsOptions } from '@stripe/stripe-js';

import CheckoutForm, { ICheckoutFormRef } from './CheckoutForm';

// ----------------------------------------------------------------------

const stripePromise = loadStripe(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export type ICheckoutFormWrapperProps = {
  total_amount: number | any;
  checkoutRef: Ref<ICheckoutFormRef>;
};

const CheckoutFormWrapper: FC<ICheckoutFormWrapperProps> = (props) => {
  const { total_amount, checkoutRef } = props;

  const appearance: Appearance = { theme: 'stripe' };

  const options: StripeElementsOptions = {
    // clientSecret,
    mode: 'payment',
    amount: parseInt(`${total_amount * 100}`, 10),
    currency: 'usd',
    appearance,
  };

  return (
    <>
      {Number(total_amount) > 0 && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm ref={checkoutRef} total_amount={total_amount} />
        </Elements>
      )}
    </>
  );
};

export default CheckoutFormWrapper;
