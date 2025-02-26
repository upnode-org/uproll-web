// import { LOG_LEVELS, LogLevel } from "@/lib/configSchema";
// import FormSelect from "./Components/FormSelect";
// import FormCheckbox from "./Components/FormCheckbox";
// import FormNodeSelectorFields from "./Components/FormRecordFields";
// import FormTolerationsField from "./Components/FormTolerationFieldArray";
// export default function GlobalForm() {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
//       <FormSelect<LogLevel>
//         watchName="optimism_package.global_log_level"
//         options={LOG_LEVELS}
//         label="Global Log Level"
//       />
//       <FormCheckbox
//         watchName="optimism_package.persistent"
//         label="Persistent" />
//       <FormNodeSelectorFields
//         label="Global Node Selectors"
//         fieldArrayName="optimism_package.global_node_selectors"
//       />
//       <FormTolerationsField
//         label="Global Tolerations"
//         fieldArrayName="optimism_package.global_tolerations"
//       />
//     </div>
//   )
// }