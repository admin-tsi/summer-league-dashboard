// components/ArticleEdit/MediaTab.tsx
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
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const MediaTab = () => {
  const { control } = useFormContext();

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <FormField
          control={control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-primary">Featured Image URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://example.com/image.jpg"
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
              <FormLabel className="text-primary">
                Images Gallery URLs
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter image URLs, one per line"
                  className="resize-none bg-background text-foreground border-primary"
                  {...field}
                  value={field.value?.join("\n") || ""}
                  onChange={(e) => {
                    const urls = e.target.value
                      .split("\n")
                      .filter((url) => url.trim() !== "");
                    field.onChange(urls);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default MediaTab;
