"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Upload } from "lucide-react"

export function ConfigUpload() {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0])
    // TODO: Implement file upload logic
    console.log("File uploaded:", acceptedFiles[0])
    setOpen(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mr-2">
          <Upload className="mr-2 h-4 w-4" />
          Upload Config
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Config</DialogTitle>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer ${
            isDragActive ? "border-primary" : "border-muted"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the config file here...</p>
          ) : (
            <p>Drag and drop a config file here, or click to select a file</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

