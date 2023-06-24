import { classNames } from "@/lib/classNames";
import { PropsWithChildren } from "react";

interface ButtonProps {
  disabled?: boolean;
}

const buttonClasses = "px-4 py-2 rounded text-sm font-medium";

export function PrimaryButton({
  children,
  disabled,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={disabled}
      className={classNames(buttonClasses, "bg-blue-500 text-white")}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  disabled,
}: PropsWithChildren<ButtonProps>) {
  return (
    <button
      disabled={disabled}
      className={classNames(buttonClasses, "bg-gray-200")}
    >
      {children}
    </button>
  );
}
