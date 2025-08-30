import React from "react";

type BadgeProps = {
  children: React.ReactNode;
  color?: "blue" | "green" | "red" | "yellow" | "gray";
};

export function Badge({ children, color = "gray" }: BadgeProps) {
  const colors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    yellow: "bg-yellow-100 text-yellow-800",
    gray: "bg-gray-100 text-gray-800",
  };

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[color]}`}
    >
      {children}
    </span>
  );
}
