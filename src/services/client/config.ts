import api from "./apiClient"
import { CreateConfigurationDTO } from "@/app/api/configs/route"

export const postConfig = async (config: CreateConfigurationDTO) => {
  const response = await api.post("/configs", config)
  return response.data
}

export const updateConfig = async (config: CreateConfigurationDTO, id: string) => {
  const response = await api.put(`/configs/${id}`, config)
  return response.data
}

export const deleteConfig = async (id: string) => {
  const response = await api.delete(`/configs/${id}`)
  return response.data
}



