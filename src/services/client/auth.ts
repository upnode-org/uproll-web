import api from "./apiClient"

export const signUp = async (email: string, password: string) => {
  const response = await api.post("/auth/signup", { email, password })
  return response
}

