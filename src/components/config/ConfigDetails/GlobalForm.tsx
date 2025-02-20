import { useFormContext } from "react-hook-form";
import { Config, LOG_LEVELS, LogLevel } from "@/lib/configSchema";
import defaultConfig from "@/const/defaultConfig";
import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function GlobalForm() {
    const { watch, setValue } = useFormContext<Config>();
    const usePersistent = watch("optimism_package.persistent", defaultConfig.optimism_package.persistent);
    const globalLogLevel = watch("optimism_package.global_log_level", defaultConfig.optimism_package.global_log_level);

    return (
<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <div>
              <Label htmlFor="global_log_level">Global Log Level</Label>
              <Select
              value={globalLogLevel }
              onValueChange={(value: LogLevel) =>
                setValue(`optimism_package.global_log_level`, value)
              }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select log level" />
                </SelectTrigger>
                <SelectContent>
                  {LOG_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center">
              <Checkbox 
              checked={usePersistent}
              onCheckedChange={(checked) => {
                if (typeof checked === "boolean") {
                  setValue("optimism_package.persistent", checked);
                }
              }}
              id="persistent" className="mr-2" />
              <Label htmlFor="persistent">Persistent</Label>
            </div>
          </div>
    )
}