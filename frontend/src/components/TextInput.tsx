"use client";

type InputProps = {
    label: string;
    name: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    colSpan?: boolean;
    className?: string;
    required?: boolean;
    disabled?: boolean;
};

export function TextInput({
    label,
    name,
    type = "text",
    placeholder,
    value = "",          // ✅ default here
    onChange,
    colSpan = false,
    className = "",
    required = false,
    disabled = false,
}: InputProps) {
    return (
        <div className={colSpan ? "sm:col-span-2" : ""}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={`
          w-full p-2 rounded-md border text-sm
          border-gray-400
          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
          ${disabled ? "bg-gray-100 cursor-not-allowed text-gray-500" : "bg-white"}
          ${className}
        `}
            />
        </div>
    );
}
