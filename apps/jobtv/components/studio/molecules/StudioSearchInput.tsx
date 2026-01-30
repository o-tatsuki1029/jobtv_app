"use client";

import React from "react";
import { Search } from "lucide-react";
import StudioInput from "../atoms/StudioInput";

interface StudioSearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export default function StudioSearchInput({ containerClassName = "", ...props }: StudioSearchInputProps) {
  return (
    <div className={`relative ${containerClassName}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <StudioInput className="pl-10 pr-4" {...props} />
    </div>
  );
}
