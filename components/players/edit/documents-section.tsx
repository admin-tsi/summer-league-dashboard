import { Button } from "@/components/ui/button";
import { FileText, TriangleAlert, Upload } from "lucide-react";
import { useState } from "react";
import Dropzone from "@/components/players/edit/dragzone";
import { Player } from "@/lib/types/players/players";
import { DialogDemo } from "./file-reader";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormSetValue, FieldErrors } from "react-hook-form";

type PartialPlayer = Partial<Player>;

interface DocumentCardProps {
  title: string;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
  fileAttribute: keyof PartialPlayer;
  fileName: string;
  defPlayerValue: PartialPlayer | undefined;
  setValue: UseFormSetValue<PartialPlayer>;
  errors: FieldErrors<PartialPlayer>;
}

const DocumentCard: React.FC<DocumentCardProps> = ({
  title,
  isUpdating,
  setIsUpdating,
  fileAttribute,
  fileName,
  defPlayerValue,
  setValue,
  errors,
}) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle className="text-lg font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {defPlayerValue && !isUpdating ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-6 w-6 text-primary" />
            <span className="font-medium">{fileName}</span>
          </div>
          <div className="flex justify-end items-center gap-2">
            <DialogDemo
              link={defPlayerValue[fileAttribute] as string | undefined}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsUpdating(true)}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Update file
            </Button>
          </div>
        </>
      ) : (
        <>
          <Dropzone
            type="file"
            setValue={setValue}
            attribute={fileAttribute}
            title={defPlayerValue ? "update" : undefined}
          />
          {errors[fileAttribute] && (
            <p className="text-destructive text-sm mt-2">
              {errors[fileAttribute]?.message}
            </p>
          )}
        </>
      )}
    </CardContent>
  </Card>
);

interface DocumentsSectionProps {
  isEditing: boolean;
  defPlayerValue: PartialPlayer | undefined;
  setValue: UseFormSetValue<PartialPlayer>;
  errors: FieldErrors<PartialPlayer>;
}

export function DocumentsSection({
  defPlayerValue,
  setValue,
  errors,
}: DocumentsSectionProps) {
  const [updateBirthCertificate, setUpdateBirthCertificate] = useState(false);
  const [updateCipCertificate, setUpdateCipCertificate] = useState(false);

  return (
    <div className="w-full space-y-6">
      <Alert variant="destructive" className="mb-6">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Documents</AlertTitle>
        <AlertDescription>
          Upload the secure birth certificate of the player to be registered on
          the platform. The validity of the birth certificate will be verified
          within 24 hours and will lead to the activation of the player&apos;s
          profile.
        </AlertDescription>
      </Alert>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DocumentCard
          title="Birth Certificate"
          isUpdating={updateBirthCertificate}
          setIsUpdating={setUpdateBirthCertificate}
          fileAttribute="birthCertificate"
          fileName={`${defPlayerValue?.firstName} ${defPlayerValue?.lastName} Birth Certificate`}
          defPlayerValue={defPlayerValue}
          setValue={setValue}
          errors={errors}
        />
        <DocumentCard
          title="CIP Certificate"
          isUpdating={updateCipCertificate}
          setIsUpdating={setUpdateCipCertificate}
          fileAttribute="cipFile"
          fileName={`${defPlayerValue?.firstName} ${defPlayerValue?.lastName} CIP Certificate`}
          defPlayerValue={defPlayerValue}
          setValue={setValue}
          errors={errors}
        />
      </div>
    </div>
  );
}
