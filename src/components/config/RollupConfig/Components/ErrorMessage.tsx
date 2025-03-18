"use client";
import React from "react";

export interface ErrorMessageProps {
  id: string;
  error?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ id, error }) => {
  if (!error) return null;

  try {
    return (
      <p id={id} className="text-xs text-red-500" role="alert">
        {error}
      </p>
    );
  } catch (e) {
    console.error(id, error, e);
    return null;
  }
};
