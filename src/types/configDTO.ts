import { Config } from "@/lib/configSchema";

export interface CreateConfigDto {
  name: string;
  description?: string;
  config: Config;
}

export interface UpdateConfigDto extends Partial<CreateConfigDto> {
  id: string;
}

export interface DeleteConfigDto {
  id: string;
  userId?: string;
}
