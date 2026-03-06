import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-0.5
        text-sm 
        bg-gray-100 
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
