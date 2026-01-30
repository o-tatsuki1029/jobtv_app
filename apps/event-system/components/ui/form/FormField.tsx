import React from "react";

type FormFieldProps = {
  label: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({
  label,
  children,
  className = "block mb-5",
}: FormFieldProps) {
  return (
    <label className={className}>
      {label}
      {children}
    </label>
  );
}

type TextInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: "text" | "email" | "password";
  className?: string;
  required?: boolean;
};

export function TextInput({
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "px-2 py-2 border rounded w-full text-base",
  required = false,
}: TextInputProps) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={className}
      required={required}
    />
  );
}

type SelectInputProps = {
  name: string;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
};

export function SelectInput({
  name,
  value,
  onChange,
  options,
  placeholder,
  className = "px-2 py-2 border rounded w-full text-base",
  disabled = false,
  required = false,
}: SelectInputProps) {
  return (
    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className={className}
      disabled={disabled}
      required={required}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

type DateInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export function DateInput({
  name,
  value,
  onChange,
  className = "px-2 py-2 border rounded w-full",
}: DateInputProps) {
  return (
    <input
      type="date"
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}

type TimeInputProps = {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export function TimeInput({
  name,
  value,
  onChange,
  className = "px-2 py-2 border rounded w-full",
}: TimeInputProps) {
  return (
    <input
      type="time"
      name={name}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}

type NumberInputProps = {
  name: string;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  min?: number;
  max?: number;
  className?: string;
  required?: boolean;
  placeholder?: string;
};

export function NumberInput({
  name,
  value,
  onChange,
  min,
  max,
  className = "px-2 py-2 border rounded w-full text-base",
  required = false,
  placeholder,
}: NumberInputProps) {
  return (
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      className={className}
      required={required}
      placeholder={placeholder}
    />
  );
}
