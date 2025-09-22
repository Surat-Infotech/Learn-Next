import { useState, useEffect } from 'react';

import { Button } from '@mantine/core';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Function to toggle visibility
  const toggleVisibility = () => {
    if (window.scrollY > 700) {
      // Show button after scrolling down 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            zIndex: 1000,
            borderRadius: '50%',
            background: 'black',
          }}
        >
          <i
            className="fa fa-angle-up"
            style={{
              fontSize: '15px',
              position: 'absolute',
              top: '10px',
              right: '12px',
              zIndex: '9999',
            }}
          />
        </Button>
      )}
    </>
  );
};

export default ScrollToTopButton;
