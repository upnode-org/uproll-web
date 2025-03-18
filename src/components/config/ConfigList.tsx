"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Trash2, Search, ChevronRight, Plus, Folder } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getUserConfigurations } from "@/services/server/configuration";
import CommandCopy from "@/components/CommandCopy";
import { deleteConfigs } from "@/services/client/config";
import ModalAlert from "../delete/Alert";
import HeroWrapper from "@/components/HeroWrapper";
import AnimatedBackground from "@/components/GradientBackground";
import Container from "@/components/Container";
export function ConfigList({ configs: initialConfigs }: { configs: Awaited<ReturnType<typeof getUserConfigurations>> }) {
  // Create local state from the initial configs prop.
  const [configs, setConfigs] = useState(initialConfigs);
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([]);
  const [filterText, setFilterText] = useState("");
  const { toast } = useToast();

  const handleSelect = (id: string) => {
    setSelectedConfigs((prev) =>
      prev.includes(id)
        ? prev.filter((configId) => configId !== id)
        : [...prev, id]
    );
  };

  const handleDelete = async () => {
    try {
      const removeConfig = async () => {
        if (selectedConfigs.length === 0) {
          throw new Error("No configs selected");
        }
        const response = await deleteConfigs(selectedConfigs);
        if (response.status >= 200 && response.status < 300) {
          // Clear the selected configs and update the local configs state.
          setSelectedConfigs([]);
          setConfigs((prevConfigs) => prevConfigs.filter((config) => !selectedConfigs.includes(config.id)));
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

  const filteredConfigs = configs.filter((config) =>
    config.name.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header section with gradient background */}
      <HeroWrapper backgroundElement={<AnimatedBackground className="absolute inset-0 h-full w-full" />}>
        <div className="max-w-4xl mx-auto p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Filter configs..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-8 pr-4 py-2 w-full bg-white"
              />
            </div>
            <CreateConfigButton />
            <ModalAlert
              triggerComponent={
                <div className="bg-black">
                  <Button
                    variant="destructive"
                    disabled={selectedConfigs.length === 0}
                    className={"p-2 " + (selectedConfigs.length === 0 ? " cursor-not-allowed" : "")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              }
              title="Delete Configuration?"
              description="Are you sure you want to delete this configuration? This action cannot be undone."
              onContinue={handleDelete}
            />
          </div>
        </div>
      </HeroWrapper>
      <Container className="flex-1 flex overflow-auto">
        {/* Content section fills remaining space */}
          {configs.length > 0 ? (
            filteredConfigs.length > 0 ? (
              <div className="flex flex-col flex-grow">
                {filteredConfigs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-row"
                  >
                    <div className="flex items-center space-x-2 flex-row">
                      <Checkbox
                        id={`select-${config.id}`}
                        checked={selectedConfigs.includes(config.id)}
                        onCheckedChange={() => handleSelect(config.id)}
                      />
                      <span className="text-sm font-semibold">{config.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CommandCopy command={`uproll deploy -i ${config.id}`} />
                      <Button>
                        <Link href={`/config/view/${config.id}`} className="flex items-center">
                          View
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-grow items-center justify-center">
                <div className="flex flex-col items-center justify-center h-full gap-1">
                  <Folder className="h-12 w-12 mb-4 text-muted-foreground" />
                  <h1 className="text-xl font-semibold">No matching configurations</h1>
                  <p className="text-sm text-muted-foreground">
                    We couldn’t find any configurations matching “{filterText}”. Try adjusting your search criteria.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="flex flex-grow items-center justify-center">
              <div className="flex flex-col items-center justify-center h-full gap-1">
                <Folder className="h-12 w-12 mb-4 text-muted-foreground" />
                <h1 className="text-xl font-semibold">No configurations found</h1>
                <p className="text-sm text-muted-foreground">
                  It looks like you don&apos;t have any configurations.
                </p>
                <div className="mt-4">
                  <CreateConfigButton />
                </div>
              </div>
            </div>
          )}
      </Container>
    </div>
  );
}

const CreateConfigButton = () => {
  return (
    <Link href="/config">
      <Button>
        Create config <Plus className="ml-1 h-4 w-4" />
      </Button>
    </Link>
  );
};

export default ConfigList;
