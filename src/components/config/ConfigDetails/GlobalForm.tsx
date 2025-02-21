import { LOG_LEVELS, LogLevel } from "@/lib/configSchema";
import FormSelect from "./Components/FormSelect";
import FormCheckbox from "./Components/FormCheckbox";
import { Label } from "@/components/ui/label";

export default function GlobalForm() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
      <FormSelect<LogLevel> 
      watchName="optimism_package.global_log_level" 
      options={LOG_LEVELS} 
      label="Global Log Level"
       />
       <div className="pt-8">
      <FormCheckbox 
      watchName="optimism_package.persistent" 
      label="Persistent" />
       </div>
    </div>
  )
}