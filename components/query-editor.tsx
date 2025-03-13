"use client";

import type React from "react";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import { useTheme } from "next-themes";

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
}

export function QueryEditor({ value, onChange, onExecute }: QueryEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-[200px] border rounded-md bg-muted" />;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <CodeMirror
        value={value}
        height="200px"
        extensions={[sql()]}
        onChange={onChange}
        theme={theme === "dark" ? vscodeDark : xcodeLight}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          autocompletion: true,
          foldGutter: true,
        }}
      />
    </div>
  );
}
