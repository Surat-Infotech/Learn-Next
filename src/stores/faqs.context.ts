import { useState } from 'react';

import constate from 'constate';

const useOrder = () => {
  const [faqs, setFaqs] = useState<any | null>(null);

  return {
    faqs,
    setFaqs,
  };
};

const [FAQsProvider, useFAQsContext] = constate(useOrder);

export { FAQsProvider, useFAQsContext };
