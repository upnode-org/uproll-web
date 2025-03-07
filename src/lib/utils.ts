import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { RollupConfigSchema } from "@/lib/opSchema";
import defaultRollup from "@/const/defaultRollup";
import get from "lodash.get";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isPromise<T>(value: T | Promise<T>): value is Promise<T> {
  return (
    value !== null &&
    typeof value === "object" &&
    "then" in value &&
    typeof (value as PromiseLike<T>).then === "function"
  );
}

// Utility function to determine if a field is a number based on its Zod schema definition
export function isNumberField(path: string): boolean {
  try {
    // Transform the path for schema traversal (account for Zod's shape property)
    const schemaPath = path.split('.').map(segment => `shape.${segment}`).join('.');
    
    // Get schema definition directly using lodash.get
    const currentSchema = get(RollupConfigSchema, schemaPath);
    
    // Check if the schema at this path is a number type
    if (currentSchema) {
      // Check for different Zod number types
      if (currentSchema instanceof z.ZodNumber) return true;
      
      // For optional fields, check the unwrapped type
      if (currentSchema instanceof z.ZodOptional && 
          currentSchema._def.innerType instanceof z.ZodNumber) {
        return true;
      }
      
      // Check for default values that are numbers
      if (currentSchema._def && currentSchema._def.defaultValue !== undefined) {
        return typeof currentSchema._def.defaultValue === 'number';
      }
    }
    
    // Check the default value in our defaultRollup as a fallback
    const defaultValue = get(defaultRollup, path);
    return typeof defaultValue === 'number';
  } catch (error) {
    console.error(`Error determining field type for ${path}:`, error);
    return false;
  }
};