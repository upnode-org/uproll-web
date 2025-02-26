// "use client";
// import React from "react";
// import { useFormContext, useFieldArray, FieldArrayPath } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import { Plus, Trash2 } from "lucide-react";
// import { Config } from "@/lib/configSchema";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import get from "lodash.get";
// import ErrorMessage from "./ErrorMessage";
// import { FieldError } from "react-hook-form";

// type FormFieldArrayProps = {
//   label: string;
//   fieldArrayName: FieldArrayPath<Config>;
//   placeholder?: string;
//   buttonText?: string;
// };

// export default function FormFieldArray({
//   label,
//   fieldArrayName,
//   placeholder = "Value",
//   buttonText = "Add",
// }: FormFieldArrayProps) {
//   const {
//     control,
//     register,
//     formState: { errors },
//   } = useFormContext<Config>();
//   const { fields, append, remove } = useFieldArray({ control, name: fieldArrayName });

//   // Retrieve error for the entire array (e.g. a validation rule on the array as a whole)
//   const arrayError = get(errors, fieldArrayName);

//   return (
//     <div className="w-full col-span-2">
//       <div className="flex items-center justify-between space-x-2 mb-2">
//         <Label>{label}</Label>
//         <Button type="button" onClick={() => append({ value: "" })}>
//           <Plus className="h-4 w-4" />
//           {buttonText}
//         </Button>
//       </div>
//       {fields.map((field, index) => (
//         <div key={field.id} className="flex items-center space-x-2 mb-2">
//           <Input
//             {...register(`${fieldArrayName}.${index}.value` as FieldArrayPath<Config>)}
//             placeholder={placeholder}
//           />
//           <Button variant="outline" size="icon" onClick={() => remove(index)}>
//             <Trash2 className="h-4 w-4" />
//           </Button>
//         </div>
//       ))}
//       {arrayError && 
//         !Array.isArray(arrayError) &&
//         "message" in arrayError && (
//           <ErrorMessage error={arrayError as FieldError} />
//         )}
//     </div>
//   );
// }
