import React from "react";
import { useFormContext } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import Tiptap from "@/components/tiptap";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContentTab = ({ onUpdate }: { onUpdate: () => void }) => {
  const { control } = useFormContext();

  return (
    <div className="space-y-6">
      <FormField
        control={control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-lg font-semibold text-primary">
              Title
            </FormLabel>
            <FormControl>
              <input
                {...field}
                className="w-full p-2 text-2xl font-bold border-b-2 border-primary focus:outline-none focus:border-primary-green transition-colors bg-background text-foreground"
                placeholder="Enter article title"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-primary">Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background text-foreground border-primary">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-background text-foreground">
                <SelectItem value="News">News</SelectItem>
                <SelectItem value="Feature">Feature</SelectItem>
                <SelectItem value="Opinion">Opinion</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="content"
        render={({ field }) => (
          <FormItem className="h-[calc(100vh-300px)] min-h-[500px]">
            <FormLabel className="text-lg font-semibold text-primary">
              Content
            </FormLabel>
            <FormControl>
              <Tiptap
                content={field.value}
                onChange={(html) => field.onChange(html)}
                onUpdate={onUpdate}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ContentTab;
