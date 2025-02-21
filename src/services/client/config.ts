"use client"
import { Config } from "@/lib/configSchema";
import api from "./apiClient"

export const postConfig = async (config: Config, name?: string, description?: string) => {
  console.log("Config", config);
  const response = await api.post("/configs", {
    data: {
      name,
      description,
      config,
    },
  },
  {
    headers: {
      "Content-Type": "application/json",
    },
  } 
);
  return response;
}

export const updateConfig = async (id: string, config: Config, name?: string, description?: string) => {
  const response = await api.put(`/configs/${id}`, {
      data: {
        config,
        name,
        description
      }
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    } 
  );
  return response
}

export const deleteConfig = async (id: string) => {
  const response = await api.delete(`/configs/${id}`)
  return response
}

export const downloadConfigFile = async (id: string) => {
  const response = await api.get(`/configs/${id}/yaml`)
  return response
}


