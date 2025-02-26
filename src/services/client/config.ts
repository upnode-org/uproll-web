"use client"
import api from "./apiClient"
import { RollupConfig } from "@/lib/opSchema";

export const postConfig = async (config: RollupConfig) => {
  const response = await api.post("/configs", {
    data: {
      name: config.rollup_name,
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

export const updateConfig = async (id: string, config: RollupConfig) => {
  const response = await api.put(`/configs/${id}`, {
      data: {
        config,
        name: config.rollup_name,
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

export const downloadConfigFile = async (id: string) => {
  const response = await api.get(`/configs/${id}/yaml`)
  return response
}

export const deleteConfig = async (id: string) => {
  const response = await api.delete(`/configs/${id}`)
  return response
}

export const deleteConfigs = async (ids: string[]) => {
  const response = await api.delete("/configs", {
    data: { ids },
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return response
}