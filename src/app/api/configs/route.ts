import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CreateConfigDto } from "@/types/configDTO";
import { createConfiguration } from "@/services/server/configuration";
import { parseConfig } from "@/lib/configSchema";

// Create a new configuration
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const dto = (await req.json()).data;
    const { name, description, config } = dto;
    
    if (!dto || !config) {
      console.error("Configuration is required");
      return NextResponse.json(
        { error: "Configuration is required" },
        { status: 400 }
      );
    }

    const parsedResult = parseConfig(config);
    if (!parsedResult.success || !parsedResult.data) {
      console.error("Invalid configuration:", parsedResult.error);
      return NextResponse.json(
        { error: "Invalid configuration", details: parsedResult.error },
        { status: 400 }
      );
    }
    const parsedConfig = parsedResult.data;
    
    const newConfig = await createConfiguration(
      parsedConfig,
      session?.user.id,
      name,
      description
    );

    console.log("Configuration created successfully", newConfig.id);
    return NextResponse.json({
      message: "Configuration created successfully",
      status: 201,
      data: newConfig.id,
    });
  } catch (error) {
    console.error("Error creating configuration:", error);
    return NextResponse.json(
      { error: "Failed to create configuration" },
      { status: 500 }
    );
  }
}
