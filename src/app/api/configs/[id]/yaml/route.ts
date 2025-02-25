import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import yaml from "js-yaml";

interface KeyValue {
  key: string;
  value: unknown;
}

function transformConfig(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    // Check if every item is an object with exactly "key" and "value" properties.
    if (
      obj.every(
        (item): item is KeyValue =>
          !!item &&
          typeof item === "object" &&
          !Array.isArray(item) &&
          "key" in item &&
          "value" in item &&
          Object.keys(item).length === 2
      )
    ) {
      // Convert array of { key, value } objects into a single object.
      return obj.reduce((acc: Record<string, unknown>, item) => {
        const kv = item as KeyValue;
        acc[kv.key] = kv.value;
        return acc;
      }, {});
    }
    // Check if every item is an object with only a "value" property.
    if (
      obj.every(
        (item) =>
          !!item &&
          typeof item === "object" &&
          !Array.isArray(item) &&
          Object.keys(item as object).length === 1 &&
          "value" in (item as object)
      )
    ) {
      // Convert array of { value } objects into an array of values.
      return obj.map((item) => (item as { value: unknown }).value);
    }
    // Otherwise, recursively transform each element.
    return obj.map((item) => transformConfig(item));
  } else if (obj && typeof obj === "object") {
    // Recursively transform each property of the object.
    const newObj: Record<string, unknown> = {};
    for (const key in obj as Record<string, unknown>) {
      newObj[key] = transformConfig((obj as Record<string, unknown>)[key]);
    }
    return newObj;
  }
  // For non-objects and non-arrays, return the value unchanged.
  return obj;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Additional checks for optimism_package sub-properties.
    if (
      transformedConfig &&
      typeof transformedConfig === "object" &&
      "optimism_package" in transformedConfig
    ) {
      const optimismPackage = (transformedConfig as Record<string, unknown>).optimism_package;
      if (optimismPackage && typeof optimismPackage === "object") {
        const opPkg = optimismPackage as Record<string, unknown>;
        // For "interop": check for a child property "enabled" === true.
        if (
          "interop" in opPkg &&
          opPkg.interop &&
          typeof opPkg.interop === "object"
        ) {
          const interop = opPkg.interop as Record<string, unknown>;
          if (interop.enabled !== true) {
            delete opPkg.interop;
          }
        }
        // For "observability": check for a child property "enabled" === true.
        if (
          "observability" in opPkg &&
          opPkg.observability &&
          typeof opPkg.observability === "object"
        ) {
          const observability = opPkg.observability as Record<string, unknown>;
          if (observability.enabled !== true) {
            delete opPkg.observability;
          }
        }
        // For "altda_deploy_config": check for a child property "use_altda" === true.
        if (
          "altda_deploy_config" in opPkg &&
          opPkg.altda_deploy_config &&
          typeof opPkg.altda_deploy_config === "object"
        ) {
          const altda = opPkg.altda_deploy_config as Record<string, unknown>;
          if (altda.use_altda !== true) {
            delete opPkg.altda_deploy_config;
          }
        }
      }
    }

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
