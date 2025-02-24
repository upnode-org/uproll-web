// "use client"

// import { useState, useCallback } from "react"
// import { useDropzone } from "react-dropzone"
// import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Upload } from "lucide-react"
// import { postConfig } from "@/services/client/config"
// import { CreateConfigurationDTO } from "@/app/api/configs/route"

// export function ConfigUpload() {
//   const [open, setOpen] = useState(false)
//   const [file, setFile] = useState<File | null>(null)

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     setFile(acceptedFiles[0])
//     // TODO: Implement file upload logic
//     console.log("File uploaded:", acceptedFiles[0])
//     if(file) {
//       const config = JSON.parse(await file.text())
//       const response = await postConfig(config as CreateConfigurationDTO)
//       if(response.success) {
//         console.log("Config uploaded:", response)
//         setOpen(false)
//       } else {
//         console.error("Config upload failed:", response)
//       }
//     }
//   }, [])

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="mr-2">
//           <Upload className="mr-2 h-4 w-4" />
//           Upload Config
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Upload Config</DialogTitle>
//         </DialogHeader>
//         <div
//           {...getRootProps()}
//           className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer ${
//             isDragActive ? "border-primary" : "border-muted"
//           }`}
//         >
//           <input {...getInputProps()} />
//           {isDragActive ? (
//             <p>Drop the config file here...</p>
//           ) : (
//             <p>Drag and drop a config file here, or click to select a file</p>
//           )}
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

