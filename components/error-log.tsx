import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ErrorLogProps {
  error: string | null
}

export function ErrorLog({ error }: ErrorLogProps) {
  if (!error) {
    return <div className="text-center py-8 text-muted-foreground">No errors to display</div>
  }

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="mt-2 whitespace-pre-wrap font-mono text-sm">{error}</AlertDescription>
    </Alert>
  )
}

