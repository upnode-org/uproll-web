"use client";
import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RollupConfigSchema, RollupConfig } from "@/lib/opSchema";
import HeroWrapper from "@/components/HeroWrapper";
import AnimatedBackground from "@/components/GradientBackground";
import CommandCopy from "@/components/CommandCopy";
import ModalAlert from "@/components/delete/Alert";
import { Button } from "@/components/ui/button";
import { Save, Download } from "lucide-react";
import { EditableInputField } from "./Components/EditableInputField";
import { SettlementLayerForm } from "./SettlementLayerForm";
import ParticipantsForm from "./ParticipantForm";
import { SignerConfigForm } from "./SignerConfigForm";
// import { AdminConfigForm } from "./AdminConfigForm";
import { ChainConfigForm } from "./ChainConfigForm";
import { GasConfigForm } from "./GasConfigForm";
import { DataAvailabilityConfigForm } from "./DataAvailabilityConfigForm";
import { InteropConfigForm } from "./InteropConfigForm";
import defaultRollup from "@/const/defaultRollup";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { updateConfig, postConfig, deleteConfig, downloadConfigFile } from "@/services/client/config";

interface RollupConfigFormProps {
  initialValues?: RollupConfig;
  id?: string;
}

export const RollupConfigForm: React.FC<RollupConfigFormProps> = ({ initialValues, id }) => {
  const router = useRouter();
  const methods = useForm<RollupConfig>({
    resolver: zodResolver(RollupConfigSchema),
    defaultValues: initialValues || defaultRollup,
  });

  const {
    handleSubmit,
    formState: { isDirty },
  } = methods;

  // Warn user if they attempt to close or refresh the page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isDirty]);

  useEffect(() => {
    console.log("Form Errors",methods.formState.errors);
  }, [methods.formState.errors]);

  const handleSave = async () => {
    const config = methods.getValues();
    try {
      const saveConfig = async () => {
        let response = null;
        if (id) {
          response = await updateConfig(id, config);
        } else {
          response = await postConfig(config);
          if (response.status >= 200 && response.status < 300) {
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
          description: id
            ? "Your configuration has been saved."
            : "Your configuration has been created.",
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
      <form onSubmit={handleSubmit(handleSave)}>
        <HeroWrapper
          backgroundElement={
            <AnimatedBackground className="absolute inset-0 h-full w-full" />
          }
        >
          <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-3">
            <EditableInputField name="rollup_name" />
            <div className="flex justify-between gap-2 w-full max-w-[100%]">
              <div className="flex items-center gap-2 flex-shrink">
                <Button type="submit">
                  <Save className="w-4 h-4" /> {id ? "Save" : "Create"}
                </Button>
                {id && (
                  <Button onClick={handleDownload}>
                    <Download className="w-4 h-4" /> Download
                  </Button>
                )}
                <CommandCopy
                  command={
                    id
                      ? `uproll deploy -i ${id}`
                      : `Create a config before deploying`
                  }
                  disabled={!id}
                />
              </div>
              {id && (
                <ModalAlert
                  title="Delete Configuration?"
                  description="Are you sure you want to delete this configuration? This action cannot be undone."
                  onContinue={handleDelete}
                />
              )}
            </div>
          </div>
        </HeroWrapper>
        <div className="space-y-6 max-w-4xl mx-auto p-3 sm:p-6">
          <SettlementLayerForm />
          <ParticipantsForm />
          <SignerConfigForm />
          {/* <AdminConfigForm /> */}
          <ChainConfigForm />
          <GasConfigForm />
          <DataAvailabilityConfigForm />
          <InteropConfigForm />
        </div>
      </form>
    </FormProvider>
  );
};

export default RollupConfigForm;
