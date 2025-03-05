"use client";

import type React from "react";

import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { xcodeLight } from "@uiw/codemirror-theme-xcode";
import { useTheme } from "next-themes";
import { keymap } from "@codemirror/view";

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

  const executeKeymap = keymap.of([
    {
      key: "Ctrl-Enter",
      run: () => {
        onExecute();
        return true;
      },
    },
    {
      key: "Cmd-Enter",
      run: () => {
        onExecute();
        return true;
      },
    },
  ]);

  if (!mounted) {
    return <div className="h-[200px] border rounded-md bg-muted" />;
  }

  return (
    <div className="border rounded-md overflow-hidden">
      <CodeMirror
        value={value}
        height="200px"
        extensions={[sql(), executeKeymap]}
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
      <div className="p-2 text-xs text-muted-foreground bg-muted/30">
        Press Ctrl+Enter to execute query
      </div>
    </div>
  );
}
