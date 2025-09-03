'use client';

import { useEffect, useRef, useState } from 'react';

interface AutocompleteProps {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void,
  locationName: string
}

const PlacesAutocomplete = (props: AutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [location, setLocation] = useState(props.locationName);

  useEffect(() => {
    if (!inputRef.current || !window.google) return;

    autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['(cities)'],
    });

    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place) {
        props.onPlaceSelected(place);
        setLocation(place.formatted_address || place.name || ""); // update local state
      }
    });
  }, []);

  useEffect(() => {
    setLocation(props.locationName); // updates when prop changes
  }, [props.locationName]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={location}
      onChange={(e) => setLocation(e.target.value)} // keep it controlled
      placeholder="Location, country"
      className="w-full font-normal text-primary text-base placeholder:font-normal placeholder:text-primary placeholder:text-base border-none focus:outline-none"
    />
  );
};

export default PlacesAutocomplete;
