import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import yaml from "js-yaml";

function transformConfig(obj: any): any {
  if (Array.isArray(obj)) {
    // Check if every item is an object with exactly "key" and "value" properties.
    if (
      obj.every(
        (item) =>
          item &&
          typeof item === "object" &&
          !Array.isArray(item) &&
          "key" in item &&
          "value" in item &&
          Object.keys(item).length === 2
      )
    ) {
      // Convert array of { key, value } objects into a single object.
      return obj.reduce((acc: Record<string, any>, item) => {
        acc[item.key] = item.value;
        return acc;
      }, {});
    }
    // Check if every item is an object with only a "value" property.
    if (
      obj.every(
        (item) =>
          item &&
          typeof item === "object" &&
          !Array.isArray(item) &&
          Object.keys(item).length === 1 &&
          "value" in item
      )
    ) {
      // Convert array of { value } objects into an array of values.
      return obj.map((item) => item.value);
    }
    // Otherwise, recursively transform each element.
    return obj.map((item) => transformConfig(item));
  } else if (obj && typeof obj === "object") {
    // Recursively transform each property of the object.
    const newObj: Record<string, any> = {};
    for (const key in obj) {
      newObj[key] = transformConfig(obj[key]);
    }
    return newObj;
  }
  // For non-objects and non-arrays, return the value unchanged.
  return obj;
}

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const config = await prisma.configuration.findUnique({
      where: { id },
    });

    if (!config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }

    // Transform the configuration object as specified.
    const transformedConfig = transformConfig(config.config);

    // Convert the transformed configuration object to a YAML string.
    const yamlString = yaml.dump(transformedConfig);

    // Return the YAML string as a file download.
    return new NextResponse(yamlString, {
      headers: {
        "Content-Type": "text/yaml",
        "Content-Disposition": `attachment; filename=configuration-${id}.yaml`,
      },
    });
  } catch (error) {
    console.error("Error getting configuration:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}