import { FieldError } from "react-hook-form";

export default function ErrorMessage({ error }: { error?: FieldError }) {
  
  if (!error) {
    return null;
  }

  return <p className="text-red-500">{error.message}</p>;
}