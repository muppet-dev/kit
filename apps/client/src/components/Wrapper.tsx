import { AppSidebar } from "@/components/Sidebar"
import { Tabs } from "@/components/Tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { transportSchema } from "../../../server/src/validations/transport"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

type TransportConfig = {
  transportType: "stdio" | "sse";
  command?: string;
  url?: string;
  arguments?: string;
}

export default function Wrapper({ children }: { children: React.ReactNode }) {
  const [transportConfig, setTransportConfig] = useState<TransportConfig | null>(null)

  const [formData, setFormData] = useState<TransportConfig>({
    transportType: "stdio",
    command: "",
    url: "",
    arguments: ""
  })

  const [error, setError] = useState<string>("");

  const handleSave = () => {
    try {
      const validatedData = transportSchema.parse(formData);
      setTransportConfig(validatedData);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid configuration");
    }
  };

  const handleReset = () => {
    setTransportConfig(null);
    setFormData({
      transportType: "stdio",
      command: "",
      url: "",
      arguments: ""
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-2" />
            <Separator orientation="vertical" className="mr-4 h-4" />
            <Tabs />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            {children}
          </div>
        </div>
      </SidebarInset>
      <AlertDialog open={!transportConfig}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Configure Transport</AlertDialogTitle>
            <AlertDialogDescription>
              Please configure the transport settings to continue
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <form className="grid gap-4 py-4" onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}>
            <div className="grid grid-cols-4 w-full items-center gap-2">
              <label htmlFor="transportType" className="text-right w-full text-sm font-medium">
                Transport Type
              </label>
              <div className="col-span-3 gap-2">
                <Select value={formData.transportType} onValueChange={(value: "stdio" | "sse") => setFormData(prev => ({
                  ...prev,
                  transportType: value
                }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transport type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stdio">STDIO</SelectItem>
                    <SelectItem value="sse">SSE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.transportType === "stdio" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="command" className="text-right w-full text-sm font-medium">
                  Command
                </label>
                <Input
                  id="command"
                  className="col-span-3"
                  placeholder="Enter command"
                  value={formData.command}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    command: e.target.value
                  }))}
                />
              </div>
            )}
            
            {formData.transportType === "sse" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="url" className="text-right w-full text-sm font-medium">
                  URL
                </label>
                <Input
                  className="col-span-3"
                  placeholder="Enter URL"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    url: e.target.value
                  }))}
                />
              </div>
            )}

            {formData.transportType === "stdio" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="arguments" className="text-right w-full text-sm font-medium">
                  Arguments
                </label>
                <Input
                  className="col-span-3 text-md"
                  placeholder="Enter arguments"
                  value={formData.arguments}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    arguments: e.target.value
                  }))}
                />
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
          </form>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleReset}>Reset Configuration</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Save Configuration</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
    </SidebarProvider>
  )
}
