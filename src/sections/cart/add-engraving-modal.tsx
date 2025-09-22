import { useState, useEffect } from 'react';

import clsx from 'clsx';
import { useSession } from 'next-auth/react';

import { Modal, Input, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { cartApi } from '@/api/cart';

// ---------------------------------------------------------------

type Props = {
  disabled: boolean;
  idx?: number;
  _cartItems?: any;
  setClientCartItems?: any;
  setLocalCardItems?: any;
  currentText?: string;
  currentFont?: string;
};

export const engravingFonts = [
  { name: 'Arial', className: 'arial' },
  { name: 'Elephant', className: 'elephant' },
  { name: 'Brush Script', className: 'brush-script' },
  { name: 'Footlight', className: 'footlight' },
  { name: 'Zephyr', className: 'zephyr' },
  { name: 'Bradley Hand ITC', className: 'bradley-hand-itc' },
  { name: 'Copperplate Gothic', className: 'copperplate-gothic' },
  { name: 'Lucida Calligraphy', className: 'lucida-calligraphy' },
];

export default function AddEngravingModal({
  disabled,
  idx,
  _cartItems,
  setClientCartItems,
  setLocalCardItems,
  currentFont,
  currentText,
}: Props) {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: auth, status } = useSession();

  const [selectedFont, setSelectedFont] = useState(currentFont || 'Arial');
  const [engravingText, setEngravingText] = useState(currentText || 'I Love You');
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState(false);

  const fallbackText = currentText?.trim() || 'I Love You';
  const fallbackFont = currentFont?.trim() || 'Arial';

  useEffect(() => {
    if (opened) setLoader(false);
    setError(false);
  }, [opened]);

  const onCartUpdate = async () => {
    if (error || !engravingText.length) return;

    setLoader(true);

    const updatedItem = _cartItems?.[idx ?? 0];
    const payload = { font: selectedFont, text: engravingText };

    const updateLocalCart = () => {
      const updatedArr = _cartItems.map((item: any, i: number) =>
        i === idx
          ? {
              ...item,
              engraving_details: {
                text: engravingText,
                font: selectedFont,
              },
            }
          : item
      );
      if (!auth && status === 'unauthenticated') setLocalCardItems(updatedArr);
      setClientCartItems(updatedArr);
      close();
    };

    try {
      if (auth && status === 'authenticated') {
        const { data } = await cartApi.updateEngraving(updatedItem?._id, payload);
        if (data?.isSuccess) {
          updateLocalCart();
        }
      } else {
        updateLocalCart();
      }
    } catch (err) {
      console.error('Failed to update engraving:', err);
    } finally {
      setLoader(false); // Ensure loader is always reset
    }
  };

  useEffect(() => {
    if (opened) {
      setSelectedFont(fallbackFont);
      setEngravingText(fallbackText);
      setError(false);
    }
  }, [opened, fallbackFont, fallbackText]);

  useEffect(() => {
    setError(!engravingText.trim().length);
  }, [engravingText]);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Engraving Details" centered>
        <p className="text-muted">
          If no engraving is selected, your ring will have only the metal purity stamp and LGD logo.
        </p>
        <div className="mb-3">
          {engravingFonts.map((font) => (
            <div className="form-check" key={font.name}>
              <input
                className="form-check-input"
                type="radio"
                name="fontOptions"
                id={font.name}
                value={font.name}
                checked={selectedFont === font.name}
                onChange={() => setSelectedFont(font.name)}
              />
              <label
                className={clsx('form-check-label')}
                htmlFor={font.name}
                style={{ fontSize: '18px' }}
              >
                {font.name} -{' '}
                <span className={clsx('', { [font.className]: font.className })}>
                  {engravingText}
                </span>
              </label>
            </div>
          ))}
        </div>
        <div className="d-flex align-items-center gap-2">
          <div className="w-100">
            <div className="checkout-form">
              <Input.Wrapper
                label="Engraving text (Limit of 15 characters)"
                error={error ? 'Please enter engraving text' : ''}
              >
                <Input
                  type="text"
                  size="sm"
                  className="w-100"
                  placeholder="Enter engraving text"
                  maxLength={15}
                  value={engravingText}
                  onChange={(e) => setEngravingText(e.target.value)}
                />
              </Input.Wrapper>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <button
            className={clsx('btn btn-dark mb-3 ')}
            onClick={() => {
              onCartUpdate();
            }}
            type="button"
          >
            {loader ? 'Updating...' : 'Update'}
          </button>
        </div>
      </Modal>

      {currentText?.length && currentFont?.length ? (
        <span
          role="button"
          tabIndex={0}
          onClick={open}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
          style={{ fontFamily: currentFont }}
          className="text-decoration-underline cursor-pointer"
        >
          {currentText}
        </span>
      ) : (
        <Button
          size="compact-sm"
          className={clsx('d-block mt-1 fw-700 btn-dark engraving-btn', { 'opacity-50': disabled })}
          disabled={disabled}
          variant="default"
          onClick={open}
        >
          Add Engraving
        </Button>
      )}
    </>
  );
}
