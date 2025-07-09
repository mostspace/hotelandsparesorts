'use client';

import { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

const PlacesAutocomplete = ({ onPlaceSelected }: { onPlaceSelected: (place: google.maps.places.PlaceResult) => void }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'], // or ['establishment']
    //   componentRestrictions: { country: ['ie'] }, // restrict to country if needed
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place) {
        onPlaceSelected(place);
      }
    });
  }, []);

  return (
    <Input
      ref={inputRef}
      type="text"
      placeholder="Search for a place"
      className="border p-2 rounded w-full"
    />
  );
};

export default PlacesAutocomplete;
