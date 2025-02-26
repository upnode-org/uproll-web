"use client";
import React from "react";
import { Controller, Control } from "react-hook-form";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { ErrorMessage } from "./ErrorMessage";
import { RollupConfig } from "@/lib/opSchema";

export type Option = {
  label: string;
  value: string;
  image?: string;
  bg?: string;
};

export type SquareButtonSelectorProps = {
  label: string;
  options: Option[];
  control: Control<RollupConfig>;
  name: string;
  error?: string;
};

export const SquareButtonSelector: React.FC<SquareButtonSelectorProps> = ({
  label,
  options,
  control,
  name,
  error,
}) => {
  const errorId = `${name}-error`;
  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>
      <Controller
        control={control}
        name={name as keyof RollupConfig}
        render={({ field }) => (
          <div
            className="grid grid-cols-3 gap-4"
            role="radiogroup"
            aria-describedby={error ? errorId : undefined}
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => field.onChange(option.value)}
                className={`
                  flex flex-col items-center justify-center border rounded
                  aspect-square w-full transition-all max-w-sm mx-auto overflow-visible
                  ${
                    field.value === option.value
                      ? "border-blue-500 bg-blue-200"
                      : "border-gray-300 bg-white"
                  }
                `}
                aria-pressed={field.value === option.value}
              >
                {option.image ? (
                  <Image
                    width={100}
                    height={100}
                    src={option.image}
                    alt={option.label}
                    className={`w-1/2 h-1/2 object-contain rounded-full p-5 overflow-visible ${
                      option.bg ? option.bg : ""
                    }`}
                  />
                ) : (
                  <div className="w-1/2 h-1/2 bg-gray-200 flex items-center justify-center">
                    <span>Img</span>
                  </div>
                )}
                <span className="mt-2 text-sm">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      />
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};
