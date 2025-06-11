import { useEffect, useRef } from "react";

const AutocompleteInput = ({ name, value, onChange, placeholder }) => {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!window.google || !window.google.maps.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ["geocode"], // or 'establishment', or use componentRestrictions, etc.
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onChange({
        target: {
          name,
          value: place.formatted_address || place.name,
        },
      });
    });
  }, []);

  return (
    <input
      ref={inputRef}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default AutocompleteInput;
