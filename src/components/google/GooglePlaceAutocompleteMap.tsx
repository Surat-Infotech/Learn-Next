'use client';

import { useRef, useState } from 'react';

import { Autocomplete, useLoadScript } from '@react-google-maps/api';

import { Input } from '@mantine/core';

// ----------------------------------------------------------------------

export default function GooglePlaceAutocomplete({
  setPlaces,
  label,
}: {
  setPlaces: (places: any) => void;
  label?: string;
}) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries: ['places'],
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      setPlaces(place.address_components);
      setValue(place.formatted_address || '');
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
        <Input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.currentTarget.value)}
          placeholder={label || 'Enter & Select Address'}
        />
      </Autocomplete>
    </div>
  );
}
