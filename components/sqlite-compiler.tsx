"use client";

import { useEffect, useState, useRef } from "react";
import { QueryEditor } from "@/components/query-editor";
import { ResultsTable } from "@/components/results-table";
import { ErrorLog } from "@/components/error-log";
import { DatabaseControls } from "@/components/database-controls";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Play } from "lucide-react";
import { SampleQueries } from "@/components/sample-queries";

export type QueryResult = {
  columns: string[];
  values: any[][];
};

export function SQLiteCompiler() {
  const [db, setDb] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [query, setQuery] = useState<string>("SELECT sqlite_version();");
  const [results, setResults] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string>("results");
  const [savedQueries, setSavedQueries] = useState<
    { name: string; query: string }[]
  >([]);

  const sqliteInitialized = useRef(false);

  useEffect(() => {
    if (sqliteInitialized.current) return;

    sqliteInitialized.current = true;

    const initializeSqlJs = async () => {
      try {
        const initSqlJs = (await import("sql.js")).default;

        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
          TOTAL_MEMORY: 512 * 1024 * 1024,
        });

        const newDb = new SQL.Database();
        setDb(newDb);

        executeQuery(newDb, "SELECT sqlite_version();");

        setLoading(false);
      } catch (err) {
        console.error("Failed to initialize SQL.js", err);
        setError(
          "Failed to initialize SQL.js. Please check your internet connection and try again."
        );
        setLoading(false);
      }
    };

    initializeSqlJs();

    const loadSavedQueries = () => {
      const saved = localStorage.getItem("savedQueries");
      if (saved) {
        try {
          setSavedQueries(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to load saved queries", e);
        }
      }
    };

    loadSavedQueries();

    return () => {
      if (db) {
        db.close();
      }
    };
  }, [db]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("savedQueries");
    if (saved) {
      try {
        setSavedQueries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load saved queries", e);
      }
    }
    return () => {
      if (db) db.close();
    };
  }, [db]);

  const executeQuery = (database: any, sql: string) => {
    setError(null);
    setResults(null);
    setActiveTab("results");

    try {
      const startTime = performance.now();

      const result = database.exec(sql);

      const endTime = performance.now();
      setExecutionTime(endTime - startTime);

      if (result.length === 0) {
        setResults({
          columns: [],
          values: [],
        });
      } else {
        setResults({
          columns: result[0].columns,
          values: result[0].values,
        });
      }
    } catch (err: any) {
      setError(err.message);
      setActiveTab("error");
      setExecutionTime(null);
    }
  };

  const handleRunQuery = () => {
    if (!db) return;
    executeQuery(db, query);
  };

  const handleImportDatabase = (file: File) => {
    const reader = new FileReader();

    reader.onload = async function () {
      try {
        const arrayBuffer = this.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);

        if (db) {
          db.close();
        }

        const initSqlJs = (await import("sql.js")).default;

        const SQL = await initSqlJs({
          locateFile: (file) => `https://sql.js.org/dist/${file}`,
        });

        const newDb = new SQL.Database(uint8Array);
        setDb(newDb);

        executeQuery(
          newDb,
          "SELECT name FROM sqlite_master WHERE type='table';"
        );

        setError(null);
      } catch (err: any) {
        console.error("Import error:", err);
        setError(`Failed to import database: ${err.message}`);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExportDatabase = () => {
    if (!db) return;

    const data = db.export();
    const blob = new Blob([data], { type: "application/x-sqlite3" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "database.sqlite";
    a.click();

    URL.revokeObjectURL(url);
  };

  const handleSaveQuery = (name: string) => {
    const newSavedQueries = [...savedQueries, { name, query }];
    setSavedQueries(newSavedQueries);
    localStorage.setItem("savedQueries", JSON.stringify(newSavedQueries));
  };

  const handleLoadQuery = (query: string) => {
    setQuery(query);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Initializing SQLite...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SQLite Browser Compiler</h1>
        <ThemeToggle />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>SQL Query Editor</CardTitle>
                <Button
                  onClick={handleRunQuery}
                  className="flex items-center gap-2"
                  disabled={!db}
                >
                  <Play className="w-4 h-4" />
                  Run Query
                </Button>
              </div>
              <CardDescription>
                Write your SQL query below and click Run Query to execute
              </CardDescription>
            </CardHeader>
            <CardContent>
              <QueryEditor
                value={query}
                onChange={setQuery}
                onExecute={handleRunQuery}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>
                  {activeTab === "results" ? "Query Results" : "Error Log"}
                </CardTitle>
                {executionTime !== null && (
                  <span className="text-sm text-muted-foreground">
                    Execution time: {executionTime.toFixed(2)}ms
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="error">Errors</TabsTrigger>
                </TabsList>
                <TabsContent value="results">
                  <ResultsTable results={results} />
                </TabsContent>
                <TabsContent value="error">
                  <ErrorLog error={error} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Database Controls</CardTitle>
              <CardDescription>
                Import or export SQLite database files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DatabaseControls
                onImport={handleImportDatabase}
                onExport={handleExportDatabase}
                onSaveQuery={handleSaveQuery}
                savedQueries={savedQueries}
                onLoadQuery={handleLoadQuery}
                canExport={!!db}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sample Queries</CardTitle>
              <CardDescription>
                Try these example queries to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SampleQueries onSelectQuery={handleLoadQuery} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
