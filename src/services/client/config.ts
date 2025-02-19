import { ConfigurationDetailUpdate } from "../server/configuration"
import api from "./apiClient"
import { CreateConfigurationDTO } from "@/app/api/configs/route"

export const postConfig = async (config: CreateConfigurationDTO) => {
  const response = await api.post("/configs", config)
  return response.data
}

export const updateConfig = async (config: ConfigurationDetailUpdate, id: string) => {
  const response = await api.put(`/configs`, {
    data: {
      id: id,
      config: config
    }
  })
  return response.data
}

export const deleteConfig = async (id: string) => {
  const response = await api.delete(`/configs`, {
    data: {
      id: id
    }
  })
  return response.data
}



