import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return value !== null && typeof value === "object" && typeof (value as any).then === "function";
}