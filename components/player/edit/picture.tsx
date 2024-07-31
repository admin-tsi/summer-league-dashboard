import React, { useCallback, useState } from "react";
import { useDropzone, Accept } from "react-dropzone";
import Image from "next/image";
import { Camera } from "lucide-react";

const ImageDropzone: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc(reader.result as string);
    };

    reader.readAsDataURL(file);
  }, []);

  const accept: Accept = {
    "image/*": [],
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div
      {...getRootProps()}
      className={`border rounded-md text-center cursor-pointer transition-colors duration-300 
        ${isDragActive ? "border-blue-500 bg-blue-100" : "border-gray-300 bg-white"}`}
    >
      <input {...getInputProps()} />
      {!imageSrc && (
        <div className="h-[300px] w-[300px] flex flex-col justify-center items-center bg-[#8C8B86] rounded-md">
          <p>
            {isDragActive ? (
              "Déposez l'image ici ..."
            ) : (
              <div className="flex flex-col justify-center items-center text-background">
                <Camera size={48} />
                <span className="text-background">Click to add a</span>
                <span>picture</span>
              </div>
            )}
          </p>
        </div>
      )}
      {imageSrc && (
        <div className="h-[300px] w-[300px] relative">
          <Image
            src={imageSrc}
            alt="Preview"
            fill
            className="object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
