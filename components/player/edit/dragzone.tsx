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
}

const Dropzone: React.FC<DropzoneProps> = ({ type, setValue, attribute }) => {
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
    [type, setValue, attribute]
  );

  const handleDelete = () => {
    setFileName("");
    setProgress(0);
    setImageSrc(null);
    setValue(attribute, null);
  };

  const accept: Accept = type === "image" ? { "image/*": [] } : {};
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border rounded-md text-center cursor-pointer transition-colors duration-300
          ${type === "file" ? "w-full" : "h-[300px] w-[300px]"} ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`}
      >
        <input {...getInputProps()} />
        {!imageSrc && !progress && (
          <div
            className={`flex flex-col justify-center items-center bg-[#8C8B86] rounded-md ${type === "file" ? "h-[100px] w-full" : "h-[300px] w-[300px]"}`}
          >
            <p>
              {isDragActive ? (
                type === "image" ? (
                  "Déposez l'image ici ..."
                ) : (
                  "Déposez le fichier ici ..."
                )
              ) : (
                <div className="flex flex-col justify-center items-center text-background">
                  {type === "image" ? (
                    <Camera size={48} />
                  ) : (
                    <Upload size={30} />
                  )}
                  <span className="text-background">
                    {type === "image"
                      ? "Click to add a picture"
                      : "Click to add a file"}
                  </span>
                </div>
              )}
            </p>
          </div>
        )}
        {imageSrc && type === "image" && (
          <>
            <div className="h-[300px] w-[300px] relative">
              <Image
                src={imageSrc}
                alt="Preview"
                fill
                className="object-cover rounded-md"
              />
            </div>
          </>
        )}
      </div>
      {type === "file" && progress > 0 && (
        <>
          <div className="mt-4 h-fit w-full space-x-2 flex justify-center items-center rounded-md bg-background">
            <FileText size={48} className="text-primary" />
            <div className="w-full flex flex-col space-y-2">
              <div className="w-full flex justify-between items-center">
                <span>{fileName}</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-md"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.2 }}
                ></motion.div>
              </div>
            </div>
          </div>
          {progress === 100 && (
            <div className="w-full flex justify-between items-center space-x-2 mt-4">
              <Button
                className="bg-background border text-primary hover:text-white px-2 py-2 text-sm h-7"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dropzone;
