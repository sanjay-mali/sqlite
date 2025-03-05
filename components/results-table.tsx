import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { QueryResult } from "@/components/sqlite-compiler"

interface ResultsTableProps {
  results: QueryResult | null
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results) {
    return <div className="text-center py-8 text-muted-foreground">Run a query to see results</div>
  }

  if (results.columns.length === 0) {
    return (
      <div className="text-center py-8 text-green-500 dark:text-green-400">
        Query executed successfully. No results to display.
      </div>
    )
  }

  if (results.values.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Query returned no rows</div>
  }

  return (
    <div className="border rounded-md">
      <ScrollArea className="h-[400px]">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {results.columns.map((column, index) => (
                  <TableHead key={index} className="whitespace-nowrap font-medium">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.values.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex} className="max-w-[300px] truncate">
                      {cell === null ? <span className="text-muted-foreground italic">NULL</span> : String(cell)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
    </div>
  )
}

