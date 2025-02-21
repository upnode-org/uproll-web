"use server";
import { Config, parseConfig } from "@/lib/configSchema";
import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Retrieves all configurations for a specific user.
 *
 * @param userId - The ID of the user.
 * @returns A promise that resolves to an array of configurations.
 */
export async function getUserConfigurations(userId: string) {
  try {
    const configurations = await prisma.configuration.findMany({
      where: { userId },
    });
    return configurations;
  } catch (error) {
    console.error("Error fetching configurations for user:", error);
    throw error;
  }
}

/**
 * Retrieves the detailed configuration for a specific user.
 *
 * @param userId - The ID of the user.
 * @param configId - The ID of the configuration.
 * @returns A promise that resolves to the configuration details or null if not found.
 */
export async function getConfigurationDetail(userId: string, configId: string) {
  try {
    const configuration = await prisma.configuration.findFirst({
      where: { id: configId, userId },
    });

    const parsedConfig = parseConfig(configuration?.config);

    if (!parsedConfig.success) {
      throw new Error("Configuration not found");
    }

    return parsedConfig.data;
  } catch (error) {
    console.error("Error fetching configuration detail for user:", error);
    throw new Error("Configuration not found");
  }
}

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
/**
 * Creates a new configuration for a specific user.
 *
 * @param config - The configuration details.
 * @param userId - The ID of the user. If not provided the config will be created as a public config and will expire after 24 hours.
 * @returns A promise that resolves to the new configuration details or null if error.
 */
export async function createConfiguration(
  config: Config,
  userId?: string,
  name?: string,
  description?: string
) {
  try {
    const expiresAt = userId ? undefined : new Date(new Date().getTime() + EXPIRATION_TIME);    

    console.dir(config, { depth: null, colors: true });
    const newConfig = await prisma.configuration.create({
      data: {
        config: config,
        name: name || "Untitled Configuration",
        description: description || "",
        ...(userId
          ? { user: { connect: { id: userId } } }
          : { expiresAt }),
      },
    });
    return newConfig;
  } catch (error) {
    console.error("Error creating configuration:", error);
    throw error;
  }
}

export async function updateConfiguration(
  config: Config,
  configId: string,
  name?: string,
  description?: string
) {
  try {
    const updatedConfig = await prisma.configuration.update({
      where: { id: configId },
      data: {
        config: config,
        name: name || undefined,
        description: description || undefined,
      },
    });
    return updatedConfig;
  } catch (error) {
    console.error("Error updating configuration:", error);
    throw error;
  }
}

export async function deleteConfiguration(configId: string) {
  try {
    await prisma.configuration.delete({
      where: { id: configId },
    });
  } catch (error) {
    console.error("Error deleting configuration:", error);
    throw error;
  }
}
