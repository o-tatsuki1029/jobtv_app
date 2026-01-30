"use client";

import React from "react";
import StudioLabel from "../atoms/StudioLabel";
import StudioInput from "../atoms/StudioInput";
import StudioTextarea from "../atoms/StudioTextarea";

interface StudioFormFieldProps {
  label: string;
  name: string;
  type?: "text" | "email" | "password" | "textarea";
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  rows?: number;
  error?: string;
  helperText?: string;
}

export default function StudioFormField({
  label,
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
  rows = 5,
  error,
  helperText
}: StudioFormFieldProps) {
  return (
    <div className="space-y-2">
      <StudioLabel htmlFor={name} required={required}>
        {label}
      </StudioLabel>

      {type === "textarea" ? (
        <StudioTextarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          error={!!error}
        />
      ) : (
        <StudioInput
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          error={!!error}
        />
      )}

      {error ? (
        <p className="text-[10px] text-red-500 font-bold">{error}</p>
      ) : helperText ? (
        <p className="text-[10px] text-gray-400 text-right">{helperText}</p>
      ) : null}
    </div>
  );
}
