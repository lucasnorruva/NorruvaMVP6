
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Api } from "lucide-react"

export default function ApiReferenceIntro() {
    return (
        <Alert>
          <Api className="h-4 w-4" />
          <AlertTitle>API Reference</AlertTitle>
          <AlertDescription>
            Comprehensive documentation for the Norruva platform API.
          </AlertDescription>
        </Alert>
      )
}

    