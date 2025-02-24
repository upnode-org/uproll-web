"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Config, ConfigSchema } from "@/lib/configSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { updateConfig, postConfig, deleteConfig, downloadConfigFile } from "@/services/client/config";
import defaultConfig from "@/const/defaultConfig";
import { useRouter } from "next/navigation";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import ObservabilityForm from "./ObservabilityForm";
import InteropForm from "./InteropForm";
import AltDAForm from "./AltDAForm";
import ChainsForm from "./ChainsForm";
import OpContractDeployerForm from "./OpContractDeployerForm";
import CommandCopy from "@/components/CommandCopy";
import GlobalForm from "./GlobalForm";
import ModalAlert from "@/components/delete/Alert";
// import DockerImageSearch from "./Components/DockerImageSearch";
import FormCheckbox from "./Components/FormCheckbox";
interface ConfigFormProps {
  id?: string;
  initialConfig?: Config;
  initialName?: string | null;
  initialDescription?: string | null;
}

export default function ConfigForm({
  id,
  initialConfig,
  initialName = "",
  initialDescription = "",
}: ConfigFormProps) {
  const methods = useForm<Config>({
    resolver: zodResolver(ConfigSchema),
    defaultValues: initialConfig || defaultConfig,
    mode: "all",
  });

  const router = useRouter();
  const [name, setName] = useState<string>(initialName || "Unamed Configuration");
  const [description, setDescription] = useState<string>(initialDescription || "");

  const { watch } = methods;

  useEffect(() => {
    const subscription = watch((formValues, { name }) => {
      console.log(`Form ${name} state changed:`);
      console.log(formValues);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleSave = async () => {
    const config = methods.getValues();
    try {
      const saveConfig = async () => {
        let response = null;
        if (id) {
          response = await updateConfig(id, config, name, description);
        } else {
          response = await postConfig(config, name, description);
          if (response.status >= 200 && response.status < 300) {
            console.log("response.data", response.data);
            router.push(`/config/view/${response.data.data}`);
          }
        }
        if (response.status >= 200 && response.status < 300) {
          return "Configuration saved!";
        } else {
          throw new Error("Failed to save configuration");
        }
      };

      await toast.promise(saveConfig(), {
        loading: {
          title: id ? "Saving config..." : "Creating config...",
          description: "Please wait.",
        },
        success: {
          title: "Success!",
          description: id ? "Your configuration has been saved." : "Your configuration has been created.",
        },
        error: {
          title: "Error",
          description: "Failed to save configuration.",
          variant: "destructive",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const removeConfig = async () => {
        if (!id) {
          throw new Error("No config id provided");
        }
        const response = await deleteConfig(id);
        if (response.status >= 200 && response.status < 300) {
          router.push("/config/view");
          return "Configuration deleted!";
        } else {
          throw new Error("Failed to delete configuration");
        }
      };

      await toast.promise(removeConfig(), {
        loading: {
          title: "Deleting config...",
          description: "Please wait.",
        },
        success: {
          title: "Deleted!",
          description: "Your configuration has been deleted.",
        },
        error: {
          title: "Error",
          description: "Failed to delete configuration.",
          variant: "destructive",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    try {
      const downloadConfig = async () => {
        if (!id) {
          throw new Error("No config id provided");
        }

        // Fetch the configuration file as a blob.
        const response = await downloadConfigFile(id);

        // Retrieve the filename from the content-disposition header if available.
        const contentDisposition = response.headers["content-disposition"];
        let fileName = `configuration-${id}.yaml`;
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1];
          }
        }

        // Create a Blob from the response data.
        const blob = new Blob([response.data], { type: "text/yaml" });

        // Create an object URL for the blob.
        const url = window.URL.createObjectURL(blob);

        // Create a temporary anchor element to trigger the download.
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        // Clean up: remove the link and revoke the object URL.
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return "Configuration downloaded!";
      };

      await toast.promise(downloadConfig(), {
        loading: {
          title: "Downloading config...",
          description: "Please wait.",
        },
        success: {
          title: "Downloaded!",
          description: "Your configuration has been downloaded.",
        },
        error: {
          title: "Error",
          description: "Failed to download configuration.",
          variant: "destructive",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="space-y-6 pt-4">
        {/* Action buttons */}
        <div className="flex justify-between gap-2 w-full">
          <div className="flex items-center gap-2">
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" /> {id ? "Save" : "Create"}
            </Button>
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4" /> Download
            </Button>
            <CommandCopy
              command={
                id
                  ? `uproll deploy ${id}`
                  : `Save to generate a deploy command`
              }
              disabled={!id}
            />
          </div>
          {id && (
            <>
              <ModalAlert
                title="Delete Configuration?"
                description="Are you sure you want to delete this configuration? This action cannot be undone."
                onContinue={handleDelete}
              />
            </>
          )}
        </div>
        {/* <DockerImageSearch /> */}
        <form className="space-y-6">
          {/* Top-Level Form Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <GlobalForm />

          {/* Additional Form Components */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="observability">
              <div className="flex items-center [&>h3]:flex-grow gap-2 w-full">
                <FormCheckbox watchName="optimism_package.observability.enabled" />
                <AccordionTrigger>Observability</AccordionTrigger>
              </div>
              <AccordionContent>
                <ObservabilityForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="interop">
              <div className="flex items-center [&>h3]:flex-grow gap-2 w-full">
                <FormCheckbox watchName="optimism_package.interop.enabled" />
                <AccordionTrigger>Interop</AccordionTrigger>
              </div>
              <AccordionContent>
                <InteropForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="altda">
              <div className="flex items-center [&>h3]:flex-grow gap-2 w-full">
                <FormCheckbox watchName="optimism_package.altda_deploy_config.use_altda" />
                <AccordionTrigger>Alternate Data Availability</AccordionTrigger>
              </div>
              <AccordionContent>
                <AltDAForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="chains">
              <div className="flex items-center [&>h3]:flex-grow gap-2 w-full">
                {/* Doesnt need a checkbox here because it's a list of chains, but need a gap to keep in line with other accordion items */}
                <div className="w-4" />
                <AccordionTrigger>Chains</AccordionTrigger>
              </div>
              <AccordionContent>
                <ChainsForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="opcontractdeployer">
              <div className="flex items-center [&>h3]:flex-grow gap-2 w-full">
                <div className="w-4" />
                <AccordionTrigger>OpContractDeployer</AccordionTrigger>
              </div>
              <AccordionContent>
                <OpContractDeployerForm />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </form>
      </div>
    </FormProvider>
  );
}
