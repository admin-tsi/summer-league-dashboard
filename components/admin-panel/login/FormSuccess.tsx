import { CheckCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface FormSuccessProps {
  message?: string;
}

export default function FormSuccess({ message }: FormSuccessProps) {
  if (!message) return null;
  return (
    <Alert variant="success">
      <CheckCircle className="h-4 w-4" />
      <AlertTitle className="font-semibold">Success</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
