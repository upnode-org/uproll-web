"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Config, ConfigSchema } from "@/lib/configSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Save, Trash2 } from "lucide-react";
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

interface ConfigFormProps {
  id?: string;
  initialConfig?: Config;
  initialName?: string;
  initialDescription?: string;
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
  const [name, setName] = useState<string>(initialName);
  const [description, setDescription] = useState<string>(initialDescription);

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
        const response = await downloadConfigFile(id);
        if (response) {
          return "Configuration downloaded!";
        }
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
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" /> Delete
            </Button>
          )}
        </div>

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
              <AccordionTrigger>Observability</AccordionTrigger>
              <AccordionContent>
                <ObservabilityForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="interop">
              <AccordionTrigger>Interop</AccordionTrigger>
              <AccordionContent>
                <InteropForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="altda">
              <AccordionTrigger>AltDA</AccordionTrigger>
              <AccordionContent>
                <AltDAForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="chains">
              <AccordionTrigger>Chains</AccordionTrigger>
              <AccordionContent>
                <ChainsForm />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="opcontractdeployer">
              <AccordionTrigger>OpContractDeployer</AccordionTrigger>
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
