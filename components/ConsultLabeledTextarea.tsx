"use client";

import React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children: React.ReactNode;
  labelClassName?: string;
  textareaClassName?: string;
}

export default function ConsultLabeledTextarea({
  children,
  labelClassName,
  textareaClassName,
  // type,
  // value,
  // onChange,
  ...props
}: Props) {
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   let newValue = e.target.value;

  //   // Solo convertir a mayúsculas si NO es email o password
  //   if (type !== "email" && type !== "password") {
  //     newValue = newValue.toUpperCase();
  //   }

  //   // Llamamos al onChange externo si existe
  //   if (onChange) {
  //     // Creamos un evento similar para respetar el onChange original
  //     const event = {
  //       ...e,
  //       target: { ...e.target, value: newValue },
  //     } as React.ChangeEvent<HTMLInputElement>;

  //     onChange(event);
  //   }
  // };

  return (
    <div className="px-2 flex flex-col gap-1 items-start text-sm">
      <label className={`w-full font-bold text-blue-950 ${labelClassName}`}>
        {children}
      </label>

      <textarea
        {...props}
        // type={type}
        // value={value ?? ""}
        // onChange={handleChange}
        className={`w-full h-24 bg-white border border-blue-200 px-2 pb-0.5 pt-1.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:bg-white ${textareaClassName}`}
      />
    </div>
  );
}
