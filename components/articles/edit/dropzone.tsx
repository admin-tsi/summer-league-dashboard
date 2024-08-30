import React, { useCallback } from "react";
import { useDropzone, Accept } from "react-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload } from "lucide-react";

interface DropzoneProps {
  onFilesDrop: (files: File[]) => void;
  accept?: Accept;
  maxFiles?: number;
}

const Dropzone: React.FC<DropzoneProps> = ({
  onFilesDrop,
  accept,
  maxFiles = 1,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesDrop(acceptedFiles);
    },
    [onFilesDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
  });

  return (
    <Card
      {...getRootProps()}
      className={`cursor-pointer ${
        isDragActive
          ? "border-primary"
          : "border-dashed border-2 border-gray-300"
      }`}
    >
      <CardContent className="flex flex-col items-center justify-center p-6">
        <input {...getInputProps()} />
        <CloudUpload className="w-12 h-12 text-gray-400 mb-4" />
        {isDragActive ? (
          <p className="text-primary">Drop the files here ...</p>
        ) : (
          <p className="text-gray-500">
            Drag n drop some files here, or click to select files
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Dropzone;
