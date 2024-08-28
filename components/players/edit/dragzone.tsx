import React, { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Camera, Upload, X } from "lucide-react";
import DefaultImage from "@/public/img.png";

interface DropzoneProps {
  type: "image" | "file";
  setValue: (file: any) => void;
  attribute: string;
  playerImage?: string | File;
  title?: string;
}

const Dropzone: React.FC<DropzoneProps> = ({
  type,
  setValue,
  attribute,
  playerImage,
  title,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (playerImage && typeof playerImage === "string") {
      setImageSrc(playerImage);
    } else if (!playerImage) {
      setImageSrc(DefaultImage.src);
    }
  }, [playerImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setValue(file);
      setFileName(file.name);
      setIsLoading(true);

      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    },
    [setValue],
  );

  const handleDelete = () => {
    setFileName("");
    setImageSrc(DefaultImage.src);
    setValue(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".png", ".jpg", ".gif"],
      "application/*": [".pdf"],
    },
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg overflow-hidden
          transition-all duration-300 ease-in-out
          ${type === "file" ? "w-full p-8" : "h-[300px] w-[300px]"}
          ${
            isDragActive
              ? "border-primary bg-primary/10"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted"
          }
        `}
      >
        <input {...getInputProps()} />
        <div
          className={`
            flex flex-col justify-center items-center relative
            ${type === "file" ? "h-[100px] w-full" : "h-[300px] w-[300px]"}
          `}
        >
          {isLoading ? (
            <div className="flex flex-col items-center space-y-2">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          ) : imageSrc ? (
            <div className="relative w-full h-full group">
              <Image
                src={imageSrc}
                alt="Player Image"
                fill
                objectFit="cover"
                className="rounded-lg"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-sm">Click to change image</p>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">
              {isDragActive ? (
                <p className="text-primary font-medium">
                  {type === "image"
                    ? "Drop the image here ..."
                    : "Drop the file here ..."}
                </p>
              ) : (
                <div className="flex flex-col items-center space-y-2">
                  {type === "image" ? (
                    <Camera className="h-12 w-12 text-primary" />
                  ) : (
                    <Upload className="h-12 w-12 text-primary" />
                  )}
                  <span className="font-medium">
                    {type === "image"
                      ? "Click to add a picture"
                      : title
                        ? "Click to update this file"
                        : "Click to add a file"}
                  </span>
                  <p className="text-sm">or drag and drop</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {(imageSrc !== DefaultImage.src || fileName) && (
        <div className="w-full flex justify-between items-center mt-4">
          <p className="text-sm text-muted-foreground truncate max-w-[70%]">
            {fileName || "Current image"}
          </p>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="px-4 py-2 text-sm"
          >
            <X className="w-4 h-4 mr-2" /> Remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
