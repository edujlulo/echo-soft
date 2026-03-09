import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
  labelClassName?: string;
  inputClassName?: string;
}

export default function LabeledInput({
  children,
  labelClassName,
  inputClassName,
  ...props
}: Props) {
  return (
    <div className="flex items-center text-sm">
      <label className={`px-2 w-22 text-blue-950 ${labelClassName}`}>
        {children}
      </label>

      <input
        {...props}
        className={`bg-blue-50 flex-1 border border-blue-300 px-2 pb-0.5 pt-1.5 rounded focus:outline-none focus:border-red-500 focus:bg-amber-100 ${inputClassName}`}
      />
    </div>
  );
}
