import { forwardRef, useImperativeHandle } from 'react';

import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

import { stripeApi } from '@/api/payment/stripe';

import { paths } from '@/routes/paths';

// ----------------------------------------------------------------------

export type ICheckoutFormProps = {
  total_amount: number;
};

export type ICheckoutFormRef = {
  paymentWithStripe: (
    order_id: string
  ) => Promise<{ tracking_id: string; status: number } | undefined>;
};

const CheckoutForm = forwardRef<ICheckoutFormRef, ICheckoutFormProps>((props, ref) => {
  const { total_amount } = props;

  const stripe = useStripe();
  const elements = useElements();

  const options: StripePaymentElementOptions = {
    layout: 'tabs',
  };

  const paymentWithStripe = async (order_id: string) => {
    // Stripe.js hasn't yet loaded.
    // Make sure to disable form submission until Stripe.js has loaded.
    if (!stripe || !elements) return;

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();

    if (submitError) {
      throw new Error(submitError.message);
    }
    const { data } = await stripeApi.getPaymentIntent({
      total_amount,
      order_id,
    });

    const currentDomain = window.location.origin;

    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      clientSecret: data.clientSecret,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${currentDomain}${paths.orderThankYou.root(order_id)}`,
      },
      redirect: 'if_required',
    });

    if (!paymentError && paymentIntent.status === 'succeeded') {
      // eslint-disable-next-line consistent-return
      return { tracking_id: data.clientSecret, status: data.status };
    }

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.

    if (paymentError?.type === 'card_error' || paymentError?.type === 'validation_error') {
      throw new Error(`Stripe: ${paymentError?.message}`);
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  };

  useImperativeHandle(ref, () => ({
    paymentWithStripe,
  }));

  return <PaymentElement options={options} />;
});

export default CheckoutForm;

//   useEffect(() => {
//     if (!stripe) {
//       return;
//     }

//     const clientSecret = new URLSearchParams(window.location.search).get(
//       'payment_intent_client_secret'
//     );

//     if (!clientSecret) return;

//     stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
//       switch (paymentIntent?.status) {
//         case 'succeeded':
//           setMessage('Payment succeeded!');
//           break;
//         case 'processing':
//           setMessage('Your payment is processing.');
//           break;
//         case 'requires_payment_method':
//           setMessage('Your payment was not successful, please try again.');
//           break;
//         default:
//           setMessage('Something went wrong.');
//           break;
//       }
//     });
//   }, [stripe]);
