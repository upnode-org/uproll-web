// "use client";
// import React from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Label } from "@/components/ui/label";
// import { Config } from "@/lib/configSchema";
// import { FieldPathByValue, useFormContext } from "react-hook-form";
// import get from "lodash.get";
// import ErrorMessage from "./ErrorMessage";

// type CheckboxProps = {
//   watchName: FieldPathByValue<Config, boolean | undefined>;
//   label?: string;
// };

// export default function FormCheckbox({ watchName, label }: CheckboxProps) {
//   const {
//     watch,
//     setValue,
//     formState: { errors },
//   } = useFormContext<Config>();

//   const useValue = watch(watchName);
//   const fieldError = get(errors, watchName);

//   return (
//     <div className="flex flex-col">
//       <div className={`flex items-center space-x-2 ${label ? "pt-5" : ""}`}>
//         <Checkbox
//           id={String(watchName)}
//           checked={useValue}
//           onCheckedChange={(checked) => {
//             if (typeof checked === "boolean") {
//               setValue(watchName, checked);
//             }
//           }}
//         />
//         {label && <Label htmlFor={String(watchName)}>{label}</Label>}
//       </div>
//       {fieldError && <ErrorMessage error={fieldError} />}
//     </div>
//   );
// }
