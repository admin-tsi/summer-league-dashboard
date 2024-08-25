"use client";

import React, { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { ArticleSchema } from "@/lib/schemas/articles/articles";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";

type ArticleFormData = z.infer<typeof ArticleSchema>;

export default function ArticleEditPage({
  params,
}: {
  params: { id: string };
}) {
  const token = useCurrentToken();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(ArticleSchema),
    defaultValues: {
      title: "",
      content: "",
      category: "",
      status: "draft",
      featuredImage: "",
      excerpt: "",
      highlightsVideo: "",
      imagesGallery: [],
    },
  });

  const { setValue, handleSubmit, control } = form;

  useEffect(() => {
    setIsLoading(true);
    getArticleById(params.id, token)
      .then((data) => {
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

  const breadcrumbPaths = [{ label: "Management", href: "/articles" }];

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="px-12 py-6">
          <DynamicBreadcrumbs paths={breadcrumbPaths} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-12">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="general">
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <FormField
                        control={control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                              <Input placeholder="Article title" {...field} />
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
                            <FormLabel>Category</FormLabel>
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
                                <SelectItem value="news">News</SelectItem>
                                <SelectItem value="feature">Feature</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
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
                                <SelectItem value="published">
                                  Published
                                </SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="archived">
                                  Archived
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name="excerpt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Excerpt</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Brief excerpt of the article"
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="content">
                  <Card>
                    <CardContent className="pt-6">
                      <FormField
                        control={control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>OKa</FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="media">
                  <Card>
                    <CardContent className="space-y-4 pt-6">
                      <FormField
                        control={control}
                        name="featuredImage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Featured Image URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/image.jpg"
                                {...field}
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
                            <FormLabel>Highlights Video URL</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/video.mp4"
                                {...field}
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
                            <FormLabel>Images Gallery URLs</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter image URLs, one per line"
                                className="resize-none"
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
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center"
          >
            <Button type="submit" disabled={isSaving} size="lg">
              {isSaving ? <LoadingSpinner text="Saving..." /> : "Save Article"}
            </Button>
          </motion.div>
        </form>
      </Form>
    </FormProvider>
  );
}
