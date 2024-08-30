import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArticleFormData } from "@/lib/schemas/articles/articles";
import Dropzone from "@/components/articles/edit/dropzone";

const MediaTab: React.FC = () => {
  const { control, setValue, watch } = useFormContext<ArticleFormData>();

  const handleFeaturedImageDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setValue("featuredImage", acceptedFiles[0].name);
      toast.success("Featured image uploaded successfully");
    }
  };

  const handleGalleryImagesDrop = (acceptedFiles: File[]) => {
    const currentGallery = watch("imagesGallery") || [];
    const newGallery = [
      ...currentGallery,
      ...acceptedFiles.map((file) => file.name),
    ];
    setValue("imagesGallery", newGallery);
    toast.success(`${acceptedFiles.length} image(s) added to gallery`);
  };

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <FormField
          control={control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Featured Image</FormLabel>
              <FormControl>
                <Dropzone
                  onFilesDrop={handleFeaturedImageDrop}
                  accept={{ "image/*": [".jpeg", ".png", ".jpg", ".gif"] }}
                  maxFiles={1}
                />
              </FormControl>
              {field.value && (
                <p className="text-sm text-gray-500 mt-2">
                  Current image: {field.value}
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="highlightsVideo"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">
                Highlights Video URL
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/video.mp4"
                  {...field}
                  className="bg-background text-foreground border-primary"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name="imagesGallery"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Images Gallery</FormLabel>
              <FormControl>
                <Dropzone
                  onFilesDrop={handleGalleryImagesDrop}
                  accept={{ "image/*": [".jpeg", ".png", ".jpg", ".gif"] }}
                  maxFiles={5}
                />
              </FormControl>
              {field.value && field.value.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Current gallery images:
                  </p>
                  <ul className="list-disc pl-5">
                    {field.value.map((image, index) => (
                      <li key={index} className="text-sm text-gray-500">
                        {image}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default MediaTab;
