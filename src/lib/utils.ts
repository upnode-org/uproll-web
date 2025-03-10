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

/**
 * Recursively traverses a Zod schema based on a dot-separated path.
 *
 * This version unwraps:
 * - Objects (by looking into their shape)
 * - Arrays (by using the element schema)
 * - Optional/nullable types
 * - Unions (by iterating over the union options and returning the first successful match)
 *
 * @param schema - The current Zod schema.
 * @param path - An array of keys representing the path.
 * @returns The Zod schema at the given path or undefined if not found.
 */
function getSchemaAtPath(
  schema: z.ZodTypeAny,
  path: string[]
): z.ZodTypeAny | undefined {
  // Unwrap ZodEffects first.
  if (schema instanceof z.ZodEffects) {
    return getSchemaAtPath(schema._def.schema, path);
  }

  // Handle discriminated unions.
  if (schema instanceof z.ZodDiscriminatedUnion) {
    for (const option of schema.options.values()) {
      const result = getSchemaAtPath(option, path);
      if (result !== undefined) return result;
    }
    return undefined;
  }

  // Handle regular unions.
  if (schema instanceof z.ZodUnion) {
    for (const option of schema._def.options) {
      const result = getSchemaAtPath(option, path);
      if (result !== undefined) return result;
    }
    return undefined;
  }

  if (path.length === 0) return schema;
  const [key, ...rest] = path;

  // Handle objects: traverse into the object's shape.
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    if (shape[key]) {
      return getSchemaAtPath(shape[key], rest);
    }
  }

  // Handle arrays: continue with the element schema.
  if (schema instanceof z.ZodArray) {
    return getSchemaAtPath(schema.element, path);
  }

  // Unwrap optional or nullable types.
  if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
    return getSchemaAtPath(schema._def.innerType, path);
  }

  // If no matching case was found, return undefined.
  return undefined;
}

/**
 * Determines the input type ("text" for strings, "number" for numbers)
 * for a field at a given dot-separated path within a Zod schema.
 */
export function getInputTypeFromPath(
  schema: z.ZodTypeAny,
  path: string
): 'text' | 'number' | undefined {
  const targetSchema = getSchemaAtPath(schema, path.split('.'));
  if (!targetSchema) return undefined;
  if (targetSchema instanceof z.ZodString) return 'text';
  if (targetSchema instanceof z.ZodNumber) return 'number';
  return undefined;
}
