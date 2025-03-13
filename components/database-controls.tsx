"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Save, Upload } from "lucide-react";

interface DatabaseControlsProps {
  onImport: (file: File) => void;
  onExport: () => void;
  onSaveQuery: (name: string) => void;
  onLoadQuery: (query: string) => void;
  savedQueries: { name: string; query: string }[];
  canExport: boolean;
}

export function DatabaseControls({
  onImport,
  onExport,
  onSaveQuery,
  onLoadQuery,
  savedQueries,
  canExport,
}: DatabaseControlsProps) {
  const [queryName, setQueryName] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = function () {
        const importedQuery = this.result as string;
        onImport(file);
        onLoadQuery(importedQuery);
      };

      reader.readAsText(file);
    }
  };

  const handleSaveQuery = () => {
    if (queryName.trim()) {
      onSaveQuery(queryName.trim());
      setQueryName("");
      setSaveDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="import-db">Import Database</Label>
        <div className="flex items-center gap-2">
          <Input
            id="import-db"
            type="file"
            accept=".sqlite,.db,.sqlite3"
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            onClick={() => document.getElementById("import-db")?.click()}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Choose SQLite File
          </Button>
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Export Database</Label>
        <Button
          onClick={onExport}
          variant="outline"
          className="w-full flex items-center gap-2"
          disabled={!canExport}
        >
          <Download className="w-4 h-4" />
          Export as .sqlite
        </Button>
      </div>

      <div className="grid gap-2">
        <Label>Saved Queries</Label>
        <div className="flex items-center gap-2">
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Current Query
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Query</DialogTitle>
                <DialogDescription>
                  Give your query a name to save it for later use.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="query-name">Query Name</Label>
                  <Input
                    id="query-name"
                    value={queryName}
                    onChange={(e) => setQueryName(e.target.value)}
                    placeholder="My awesome query"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveQuery}>Save Query</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {savedQueries.length > 0 && (
        <div className="grid gap-2">
          <Label htmlFor="load-query">Load Saved Query</Label>
          <Select
            onValueChange={(value) => {
              const query = savedQueries.find((q) => q.name === value);
              if (query) {
                onLoadQuery(query.query);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a saved query" />
            </SelectTrigger>
            <SelectContent>
              {savedQueries.map((query, index) => (
                <SelectItem key={index} value={query.name}>
                  {query.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
