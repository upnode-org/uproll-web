"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Trash2, Search, Eye, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data for demonstration
const mockConfigs = [
  { id: "1", name: "Config 1" },
  { id: "2", name: "Config 2" },
  { id: "3", name: "Config 3" },
]

export function ConfigList() {
  const [selectedConfigs, setSelectedConfigs] = useState<string[]>([])
  const [filterText, setFilterText] = useState("")
  const { toast } = useToast()

  const handleSelect = (id: string) => {
    setSelectedConfigs((prev) => (prev.includes(id) ? prev.filter((configId) => configId !== id) : [...prev, id]))
  }

  const handleDelete = () => {
    // TODO: Implement actual deletion logic
    console.log("Deleting configs:", selectedConfigs)
    setSelectedConfigs([])
  }

  const handleCopyCommand = (id: string) => {
    const command = `uproll deploy --config-id ${id}`
    navigator.clipboard.writeText(command).then(() => {
      toast({
        title: "Command copied",
        description: "The deployment command has been copied to your clipboard.",
      })
    })
  }

  const filteredConfigs = mockConfigs.filter((config) => config.name.toLowerCase().includes(filterText.toLowerCase()))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <div className="relative flex-grow mr-2">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Filter configs..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-8 pr-4 py-2 w-full"
          />
        </div>
        <Button
          onClick={handleDelete}
          variant="destructive"
          disabled={selectedConfigs.length === 0}
          className={selectedConfigs.length === 0 ? "opacity-50 cursor-not-allowed" : ""}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {filteredConfigs.map((config) => (
        <div key={config.id} className="flex items-center justify-between px-4 py-2 border rounded">
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`select-${config.id}`}
              checked={selectedConfigs.includes(config.id)}
              onCheckedChange={() => handleSelect(config.id)}
            />
            <span className="text-sm">{config.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => handleCopyCommand(config.id)} variant="outline" size="sm">
              <Copy className="h-4 w-4" />
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/config/view/${config.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
          </div>
        </div>
      ))}
      {filteredConfigs.length === 0 && <div className="text-center text-gray-500">No configs found</div>}
    </div>
  )
}

