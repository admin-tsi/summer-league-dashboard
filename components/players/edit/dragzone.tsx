"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, FileText, Upload } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { Accept, useDropzone } from "react-dropzone";
import { UseFormSetValue } from "react-hook-form";

interface DropzoneProps {
  type: "image" | "file";
  setValue: UseFormSetValue<any>;
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
  const [progress, setProgress] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      console.log("Selected file:", file);

      setValue(attribute, file);

      setFileName(file.name);

      const reader = new FileReader();

      reader.onload = () => {
        setImageSrc(reader.result as string);
        setProgress(0);
      };

      if (type === "file") {
        const uploadSimulation = setInterval(() => {
          setProgress((prevProgress) => {
            if (prevProgress >= 100) {
              clearInterval(uploadSimulation);
              return 100;
            }
            return prevProgress + 2;
          });
        }, 100);
      } else {
        reader.readAsDataURL(file);
      }
    },
    [type, setValue, attribute],
  );

  const handleDelete = () => {
    setFileName("");
    setProgress(0);
    setImageSrc(null);
    setValue(attribute, null);
  };

  const accept: Accept = {
    "image/*": [".jpeg", ".png", ".jpg", ".gif"],
    "application/*": [".pdf"],
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-custom-radius text-center cursor-pointer transition-all duration-300 ${
          type === "file" ? "w-full p-8" : "h-[300px] w-[300px]"
        } ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted"
        }`}
      >
        <input {...getInputProps()} />
        {!imageSrc && !progress && (
          <div
            className={`flex flex-col justify-center items-center relative ${
              type === "file" ? "h-[100px] w-full" : "h-[300px] w-[300px]"
            }`}
          >
            {playerImage ? (
              <Image
                src={playerImage as string}
                alt="Player Image"
                fill
                objectFit="cover"
                className="rounded-custom-radius"
              />
            ) : (
              <div className="text-muted-foreground">
                {isDragActive ? (
                  <p className="text-primary font-medium">
                    {type === "image"
                      ? "Déposez l'image ici ..."
                      : "Déposez le fichier ici ..."}
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
        )}
        {imageSrc && type === "image" && (
          <div className="h-[300px] w-[300px] relative">
            <Image
              src={imageSrc}
              alt="Preview"
              layout="fill"
              className="object-cover rounded-custom-radius"
            />
          </div>
        )}
      </div>
      {type === "file" && progress > 0 && (
        <div className="mt-4 p-4 rounded-custom-radius bg-card">
          <div className="flex items-center space-x-4">
            <FileText className="h-8 w-8 text-primary" />
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-sm">{fileName}</span>
                <span className="text-sm text-muted-foreground">
                  {progress}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
              </div>
            </div>
          </div>
        </div>
      )}
      {progress === 100 && (
        <div className="w-full flex justify-end mt-4">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            className="px-4 py-2 text-sm"
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dropzone;
