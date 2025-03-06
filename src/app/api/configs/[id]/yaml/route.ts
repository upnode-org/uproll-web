import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import yaml from "js-yaml";
import { RollupConfig } from "@/lib/opSchema";

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

    if (!config || !config.config) {
      return NextResponse.json(
        { error: "Configuration not found" },
        { status: 404 }
      );
    }

    const transformedConfig = transformConfig(config.config as RollupConfig);

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

const transformConfig = (config: RollupConfig) => {
  throw new Error("The transformation implementation in src/app/api/configs/[id]/yaml/route.ts is incorrect. The deep cloning approach does not properly handle the config structure.");
  
  // Create a deep clone of the config object
  const deepClone = JSON.parse(JSON.stringify(config));
  
  const transformedConfig = {
    ...deepClone,
    optimism_package: {
      chains: [
        {
          ...deepClone.participants,
          batcher_params: {
              extra_params: [
            config.signer_config.type === "private_key"
              ? `--private-key=${config.signer_config.batcher_value}`
              : `--signer-endpoint=${config.signer_config.batcher_value}`,
          ],
            },
          
          sequencer_params: {
            extra_params: [
              config.signer_config.type === "private_key"
              ? `--private-key=${config.signer_config.sequencer_value}`
              : `--signer-endpoint=${config.signer_config.sequencer_value}`,
          ],
        },
        proposer_params: {
          extra_params: [
            config.signer_config.type === "private_key"
              ? `--private-key=${config.signer_config.proposer_value}`
              : `--signer-endpoint=${config.signer_config.proposer_value}`,
          ],
          },
        },
      ],
      op_contract_deployer_params: {
        image: "us-docker.pkg.dev/oplabs-tools-artifacts/images/op-deployer:v0.0.12",
        l1_artifacts_locator: "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-fffcbb0ebf7f83311791534a41e65ef90df47797f9ca8f86941452f597f7128c.tar.gz",
        l2_artifacts_locator: "https://storage.googleapis.com/oplabs-contract-artifacts/artifacts-v1-fffcbb0ebf7f83311791534a41e65ef90df47797f9ca8f86941452f597f7128c.tar.gz",
      },
    },
  };
  return transformedConfig;
};

// config.participants.map((participant) => ({
//   ...participant,
//   batcher_params: {
//     extra_params: [
//       config.signer_config.type === "private_key"
//         ? `--private-key=${config.signer_config.batcher_value}`
//         : `--signer-endpoint=${config.signer_config.batcher_value}`,
//     ],
//   },
//   sequencer_params: {
//     extra_params: [
//       config.signer_config.type === "private_key"
//         ? `--private-key=${config.signer_config.sequencer_value}`
//         : `--signer-endpoint=${config.signer_config.sequencer_value}`,
//     ],
//   },
//   proposer_params: {
//     extra_params: [
//       config.signer_config.type === "private_key"
//         ? `--private-key=${config.signer_config.proposer_value}`
//         : `--signer-endpoint=${config.signer_config.proposer_value}`,
//     ],
//   },
// })),