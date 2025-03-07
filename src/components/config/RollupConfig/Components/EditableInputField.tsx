"use client";
import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import { useController, useFormContext } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "./ErrorMessage";
import { RollupConfig } from "@/lib/opSchema";
import { Edit3 } from "lucide-react";

export type EditableInputFieldProps = {
  label?: string;
  name: keyof RollupConfig;
  error?: string;
};

export const EditableInputField: React.FC<EditableInputFieldProps> = ({
  label,
  name,
  error,
}) => {
  const { control } = useFormContext<RollupConfig>();
  const [isEditing, setIsEditing] = useState(false);
  const {
    field: { value, onChange, onBlur, ref, name: fieldName },
  } = useController({
    name,
    control,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const setRefs = (instance: HTMLInputElement | null) => {
    if (typeof ref === "function") {
      ref(instance);
    } else if (ref) {
      (ref as React.MutableRefObject<HTMLInputElement | null>).current = instance;
    }
    inputRef.current = instance;
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    }
  };

  const errorId = `${fieldName}-error`;

  return (
    <div className="space-y-1 font-light text-4xl">
      {label && (
        <Label
          htmlFor={fieldName as string}
          className="text-sm font-medium text-gray-700"
        >
          {label}
        </Label>
      )}
      {isEditing ? (
        <div className="flex items-end bg-transparent gap-3">
          <input
            id={fieldName as string}
            value={value as string}
            onChange={onChange}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              onBlur();
              setIsEditing(false);
            }}
            ref={setRefs}
            autoFocus
            className={`bg-transparent text-white text-4xl py-1 px-2 font-light border w-full overflow-visible text-ellipsis ${
              error ? "border-red-500" : ""
            }`}
            style={{ width: "100%", minWidth: "0", textOverflow: "unset" }}
            aria-describedby={error ? errorId : undefined}
            aria-invalid={!!error}
          />
        </div>
      ) : (
        <div className="flex items-end bg-transparent py-1 px-2 gap-2 border border-transparent">
          <span className="text-white">{value as string}</span>
          <div
            className="cursor-pointer rounded-full align-bottom p-1 aspect-square hover:bg-gray-50 text-white hover:text-black mb-1"
            onClick={() => setIsEditing(true)}
          >
            <Edit3 className="size-4" />
          </div>
        </div>
      )}
      <ErrorMessage id={errorId} error={error} />
    </div>
  );
};
