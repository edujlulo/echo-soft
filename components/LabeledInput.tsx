"use client";

import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import React from "react";
import { Database } from "@/types/database";

type ConsultationRow = Database["public"]["Tables"]["consultations"]["Row"];

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  children: React.ReactNode;
  labelClassName?: string;
  inputClassName?: string;
  forceUpperCase?: boolean;
  categoryKey?: string;
  resetEditableSelectListOnFocus?: boolean;
}

export default function LabeledInput({
  children,
  labelClassName,
  inputClassName,
  type,
  value,
  onChange,
  forceUpperCase,
  categoryKey,
  resetEditableSelectListOnFocus = false,
  ...props
}: Props) {
  const { setActiveField, setActiveCategory, resetEditableSelectList } =
    useEditableSelectListStore();

  const label =
    typeof children === "string"
      ? children.replace(/:/g, "").toUpperCase()
      : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // Solo convertir a mayúsculas si NO es los siguientes types
    if (
      type !== "email" &&
      type !== "password" &&
      type !== "date" &&
      forceUpperCase !== false
    ) {
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
        value={value ?? ""}
        maxLength={60}
        onChange={handleChange}
        onFocus={() => {
          if (resetEditableSelectListOnFocus) {
            resetEditableSelectList();
            return;
          }

          setActiveField(label);
          if (categoryKey) setActiveCategory(categoryKey); // set activeCategory on focus
        }}
        // onBlur={() => setActiveField(null)}
        className={`bg-blue-50 border border-blue-300 px-2 pb-0.5 pt-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:bg-white ${inputClassName}`}
      />
    </div>
  );
}
