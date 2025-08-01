'use client';

import { useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";

interface AutocompleteProps{
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void,
}



const PlacesAutocomplete = (props:AutocompleteProps) => {
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
        props.onPlaceSelected(place);
      }
    });
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      placeholder="Location, country"
      className="w-full font-normal text-primary text-base  placeholder:font-normal placeholder:text-primary placeholder:text-base border-none focus:outline-none"
    />
  );
};

export default PlacesAutocomplete;
