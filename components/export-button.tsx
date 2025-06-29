import { Download } from "lucide-react";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExportService } from "@/lib/services/export-service";
import { toast } from "sonner";
import { Button } from "./ui/button";

const exportService = ExportService.getInstance();

interface ExportButtonProps {
  message: { content: string };
  client_name: string ;
}

interface ExportProps {
  format: "pdf" | "word" | "text";
  draftContent: string;
  client_name: string | null;
}

export default function ExportButton({
  message,
  client_name
}: Partial<ExportButtonProps>) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async ({ format, draftContent, client_name }: ExportProps) => {
    if (!draftContent || !client_name) return;

    setIsExporting(true);
    try {
      const fileName = `claim-draft-${client_name.replace(/\s+/g, "-").toLowerCase()}`;
      switch (format) {
        case "pdf":
          await exportService.exportAsPDF(draftContent, fileName);
          break;
        case "word":
          await exportService.exportAsWord(draftContent, fileName);
          break;
        case "text":
          await exportService.exportAsPlainText(draftContent, fileName);
          break;
      }
      toast.success(`Draft exported as ${format.toUpperCase()} successfully`);
    } catch {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="!cursor-pointer border border-primary text-primary hover:text-muted hover:bg-primary rounded-lg"
          disabled={isExporting}
        >
          <Download className="w-4 h-4 mr-2" />
          Export {isExporting && <span className="ml-2 animate-pulse text-primary">...</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
        <DropdownMenuItem
          onClick={() =>
            handleExport({
              format: "pdf",
              draftContent: message?.content || "",
              client_name: client_name ?? null,
            })
          }
        >
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleExport({
              format: "word",
              draftContent: message?.content || "",
              client_name: client_name ?? null,
            })
          }
        >
          Export as DOCX
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            handleExport({
              format: "text",
              draftContent: message?.content || "",
              client_name: client_name ?? null,
            })
          }
        >
          Export as TXT
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
