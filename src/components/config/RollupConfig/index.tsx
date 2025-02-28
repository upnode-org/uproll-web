"use client";
import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RollupConfigSchema, RollupConfig } from "@/lib/opSchema";
import HeroWrapper from "@/components/HeroWrapper";
import AnimatedBackground from "@/components/GradientBackground";
import CommandCopy from "@/components/CommandCopy";
import ModalAlert from "@/components/delete/Alert";
import { Button } from "@/components/ui/button";
import { Save, Download, Plus } from "lucide-react";
import { EditableInputField } from "./Components/EditableInputField";
import { SettlementLayerForm } from "./SettlementLayerForm";
import { ParticipantForm } from "./ParticipantForm";
import { SignerConfigForm } from "./SignerConfigForm";
import { AdminConfigForm } from "./AdminConfigForm";
import { ChainConfigForm } from "./ChainConfigForm";
import { GasConfigForm } from "./GasConfigForm";
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
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "participants",
  });

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
    <form onSubmit={handleSubmit(handleSave)}>
      <HeroWrapper
        backgroundElement={
          <AnimatedBackground className="absolute inset-0 h-full w-full" />
        }
      >
        <div className="max-w-4xl mx-auto p-3 sm:p-6 space-y-3">
          <EditableInputField
            control={control}
            name="rollup_name"
            error={errors.rollup_name?.message as string}
          />
          <div className="flex justify-between gap-2 w-full max-w-[100%]">
            <div className="flex items-center gap-2 flex-shrink">
              <Button onClick={handleSave}>
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
                    ? `uproll deploy ${id}`
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
        <SettlementLayerForm
          register={register}
          control={control}
          errors={errors}
        />
        <fieldset className="border border-gray-300 p-4 mb-6 rounded-md">
          <legend className="px-2 text-lg font-semibold space-x-2 flex items-center justify-between gap-2">
            Participants
            <Button
              size={null}
              type="button"
              onClick={() =>
                append({
                  el_type: "op-geth",
                  el_image: "op-geth:latest",
                  cl_type: "op-node",
                  cl_image: "op-node:latest",
                })
              }
              className="p-0.5 rounded-full"
            >
              <Plus />
            </Button>
          </legend>
          {fields.map((field, index) => (
            <React.Fragment key={field.id}>
              <ParticipantForm
                index={index}
                register={register}
                control={control}
                errors={errors}
                remove={remove}
              />
              {index < fields.length - 1 && (
                <div className="border-t border-gray-300 my-4"></div>
              )}
            </React.Fragment>
          ))}
        </fieldset>
        <SignerConfigForm register={register} errors={errors} />
        <AdminConfigForm register={register} errors={errors} />
        <ChainConfigForm register={register} errors={errors} />
        <GasConfigForm register={register} errors={errors} />
      </div>
    </form>
  );
};

export default RollupConfigForm;
