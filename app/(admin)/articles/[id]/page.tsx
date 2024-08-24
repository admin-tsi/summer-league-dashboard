"use client";

import React, { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/loading-spinner";
import { getArticleById } from "@/lib/api/articles/articles";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Plate } from "@udecode/plate-common";
import { Editor } from "@/components/plate-ui/editor";

const ArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  category: z.string().min(1, "Category is required"),
  status: z.enum(["draft", "published", "pending", "archived"]),
  featuredImage: z.string().optional(),
  excerpt: z.string().optional(),
});

type ArticleFormData = z.infer<typeof ArticleSchema>;

export default function ArticleEditPage({
  params,
}: {
  params: { id: string };
}) {
  const token = useCurrentToken();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [article, setArticle] = useState<any | null>(null);

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      status: "draft",
      featuredImage: "",
      excerpt: "",
    },
  });

  const { setValue, handleSubmit, control } = form;

  useEffect(() => {
    setIsLoading(true);
    getArticleById(params.id, token)
      .then((data) => {
        setArticle(data);
        Object.keys(data).forEach((key) => {
          setValue(key as keyof ArticleFormData, data[key]);
        });
      })
      .catch((error) => {
        toast.error("Failed to fetch article");
        console.error("Failed to fetch article", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [params.id, token, setValue]);

  const onSubmit = async (data: ArticleFormData) => {
    setIsSaving(true);
    try {
      // Implement updateArticle function
      // await updateArticle(params.id, data, token);
      toast.success("Article updated successfully");
    } catch (error) {
      toast.error("Failed to update article");
      console.error("Failed to update article", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  const breadcrumbPaths = [
    { label: "Articles", href: "/articles" },
    { label: article?.title || "Edit Article" },
  ];

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-12">
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
        <div className="grid grid-cols-1 gap-4">
          {article && (
            <>
              <FormField
                name="title"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="title">Title</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="title"
                        placeholder="Article Title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="content"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="content">Content</FormLabel>
                    <FormControl>
                      <Plate
                        onChange={field.onChange}
                        initialValue={[
                          { type: "p", children: [{ text: field.value }] },
                        ]}
                      >
                        <Editor placeholder="Type here..." />
                      </Plate>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="category"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="category">Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* Add category options here */}
                        <SelectItem value="news">News</SelectItem>
                        <SelectItem value="feature">Feature</SelectItem>
                        {/* Add more categories as needed */}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="status">Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="featuredImage"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="featuredImage">
                      Featured Image URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="featuredImage"
                        placeholder="Featured Image URL"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="excerpt"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="excerpt">Excerpt</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="excerpt"
                        placeholder="Article Excerpt"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-center">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isSaving}
                  size="lg"
                >
                  {isSaving ? <LoadingSpinner text="Saving..." /> : "Save"}
                </Button>
              </div>
            </>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
