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
    const dto = (await req.json()) as CreateConfigDto;

    if (!dto || !dto.config) {
      return NextResponse.json(
        { error: "Configuration is required" },
        { status: 400 }
      );
    }

    const parsedResult = parseConfig(dto.config);
    if (!parsedResult.success) {
      return NextResponse.json(
        { error: "Invalid configuration", details: parsedResult.error },
        { status: 400 }
      );
    }
    const parsedConfig = parsedResult.data;

    const config = await createConfiguration(
      parsedConfig,
      session?.user.id,
      dto.name,
      dto.description
    );

    return NextResponse.json({
      message: "Configuration created successfully",
      status: 201,
      data: config.id,
    });
  } catch (error) {
    console.error("Error creating configuration:", error);
    return NextResponse.json(
      { error: "Failed to create configuration" },
      { status: 500 }
    );
  }
}
