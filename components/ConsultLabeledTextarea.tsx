"use client";

import { useEditableSelectListStore } from "@/context/editableSelectListStore";
import clsx from "clsx";
import React from "react";

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  children: React.ReactNode;
  labelClassName?: string;
  textareaClassName?: string;
  textareaHeight?: string;
  categoryKey?: string;
}

export default function ConsultLabeledTextarea({
  children,
  labelClassName,
  textareaClassName,
  textareaHeight,
  value,
  onChange,
  categoryKey,
  ...props
}: Props) {
  const { setActiveCategory, setActiveField } = useEditableSelectListStore();

  const label = typeof children === "string" ? children : "";

  return (
    <div className="px-2 flex flex-col gap-1 items-start text-sm">
      <label className={clsx("w-full font-bold text-blue-950", labelClassName)}>
        {children}
      </label>

      <textarea
        {...props}
        {...(value !== undefined ? { value } : {})}
        {...(onChange ? { onChange } : {})}
        onFocus={() => {
          setActiveField(label);
          if (categoryKey) setActiveCategory(categoryKey); // set activeCategory on focus
        }}
        // onBlur={() => {
        //   setActiveField(null);
        //   setActiveCategory(null); // reset activeCategory on blur
        // }}
        className={clsx(
          "w-full bg-white border border-blue-200 px-2 pb-0.5 pt-1.5 rounded",
          "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 focus:bg-white",
          textareaHeight ?? "h-24",
          textareaClassName,
        )}
      />
    </div>
  );
}
