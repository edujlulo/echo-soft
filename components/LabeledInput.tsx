interface Props {
  children: React.ReactNode;
  labelClassName?: string;
  inputClassName?: string;
  defaultValue?: string;
  disabled?: boolean;
}

export default function LabeledInput({
  children,
  labelClassName,
  inputClassName,
  defaultValue,
  disabled = false,
}: Props) {
  return (
    <div className="flex items-center text-sm">
      <label className={`px-2 w-22 text-blue-950 ${labelClassName}`}>
        {children}
      </label>
      <input
        className={`flex-1 border border-blue-300 px-2 py-1 rounded focus:outline-none focus:border-red-500  focus:bg-amber-100 ${inputClassName}`}
        defaultValue={defaultValue}
        disabled={disabled}
      />
    </div>
  );
}
