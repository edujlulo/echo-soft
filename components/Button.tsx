import React from "react";

// Extendemos las props estándar de un <button> HTML
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <button
      {...props} // Esto incluye type, disabled, onClick, etc.
      className={`
        px-3
        pt-1
        text-sm 
        bg-blue-50
        border border-gray-400 
        rounded 
        transition-colors duration-200 ease-in-out
        hover:bg-blue-200 hover:border-blue-500
        focus:outline-none focus:ring-2 focus:ring-blue-300
        cursor-pointer
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
