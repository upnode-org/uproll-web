"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Trash2, Search, ChevronRight, Plus } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
import { getUserConfigurations } from "@/services/server/configuration"
import CommandCopy from "@/components/CommandCopy"

export function ConfigList({ configs }: { configs: Awaited<ReturnType<typeof getUserConfigurations>> }) {
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([])
  const [filterText, setFilterText] = useState("")
  // const { toast } = useToast()

  const handleSelect = (id: string) => {
    setSelectedConfigs((prev) => (prev.includes(id) ? prev.filter((configId) => configId !== id) : [...prev, id]))
  }

  const handleDelete = () => {
    // TODO: Implement actual deletion logic
    console.log("Deleting configs:", selectedConfigs)
    setSelectedConfigs([])
  }

  const filteredConfigs = configs.filter((config) => config.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div className="">
      <div className="flex justify-between items-center mb-4 px-4 gap-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2  size-4" />
          <Input
            type="text"
            placeholder="Filter configs..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-8 pr-4 py-2 w-full"
          />
        </div>
        <CreateConfigButton />
        <Button
          onClick={handleDelete}
          variant="destructive"
          disabled={selectedConfigs.length === 0}
          className={"p-2" + (selectedConfigs.length === 0 ? " opacity-50 cursor-not-allowed" : "")}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {filteredConfigs.map((config) => (
        <div key={config.id} className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`select-${config.id}`}
              checked={selectedConfigs.includes(config.id)}
              onCheckedChange={() => handleSelect(config.id)}
            />
            <span className="text-sm font-semibold">{config.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CommandCopy
              command={`uproll deploy ${config.id}`}
            />
            <Button>
              <Link href={`/config/view/${config.id}`} className="flex items-center flex-row">
                View
                <ChevronRight className=" ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      ))}
      {filteredConfigs.length === 0 &&
        <div className="text-center h-40 flex flex-row justify-center items-center border-y border-stone-900 gap-4">
          <p className="text-xl uppercase ">ERR: No configs found</p>
          <CreateConfigButton />
        </div>
      }
    </div>
  )
}

const CreateConfigButton = () => {
  return (
    <Link href="/config">
      <Button>Create config <Plus className="ml-1 h-4 w-4" /></Button>
    </Link>
  )
}
