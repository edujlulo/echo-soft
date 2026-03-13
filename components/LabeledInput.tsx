"use client";

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
  type,
  value,
  onChange,
  ...props
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Solo convertir a mayúsculas si NO es email o password
    if (type !== "email" && type !== "password") {
      newValue = newValue.toUpperCase();
    }

    // Llamamos al onChange externo si existe
    if (onChange) {
      // Creamos un evento similar para respetar el onChange original
      const event = {
        ...e,
        target: { ...e.target, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(event);
    }
  };

  return (
    <div className="flex items-center text-sm">
      <label className={`px-2 w-22 text-blue-950 ${labelClassName}`}>
        {children}
      </label>

      <input
        {...props}
        type={type}
        value={value}
        onChange={handleChange}
        className={`bg-blue-50 flex-1 border border-blue-300 px-2 pb-0.5 pt-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:bg-white ${inputClassName}`}
      />
    </div>
  );
}
