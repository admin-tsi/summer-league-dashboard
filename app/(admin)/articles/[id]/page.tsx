"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import LoadingSpinner from "@/components/loading-spinner";
import { getArticleById, updateArticleById } from "@/lib/api/articles/articles";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { ArticleSchema } from "@/lib/schemas/articles/articles";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import MediaTab from "@/components/articles/edit/media-tab";
import ContentTab from "@/components/articles/edit/content-tab";
import debounce from "lodash/debounce";
import StatusSwitch from "@/components/articles/edit/status-switch";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ArticleFormData = z.infer<typeof ArticleSchema>;

export default function ArticleEditPage({
  params,
}: {
  params: { id: string };
}) {
  const token = useCurrentToken();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("content");

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

  const { setValue, watch } = form;

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

  const debouncedSave = useCallback(
    debounce(async (data: ArticleFormData) => {
      try {
        const { status, ...dataWithoutStatus } = data;
        await updateArticleById(params.id, dataWithoutStatus, token);
        toast.success("Article updated successfully");
      } catch (error) {
        toast.error("Failed to update article");
        console.error("Failed to update article", error);
      }
    }, 2000),
    [params.id, token],
  );

  useEffect(() => {
    const subscription = watch((data, { name }) => {
      if (name !== "status") {
        debouncedSave(data as ArticleFormData);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, debouncedSave]);

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  const breadcrumbPaths = [
    { label: "Articles", href: "/articles" },
    { label: "Edit", href: `/articles/${params.id}/edit` },
  ];

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <div className="px-4 sm:px-6 lg:px-8 py-24 bg-background">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <DynamicBreadcrumbs paths={breadcrumbPaths} />
                <StatusSwitch articleId={params.id} />
              </div>
            </CardContent>
          </Card>

          <Alert className="mb-6 bg-primary-yellow/90 text-black">
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Auto-save Enabled</AlertTitle>
            <AlertDescription>
              Your changes are automatically saved as you type, except for the
              status field. No need to manually save.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-primary">
                Edit Article
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger
                    value="content"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Content
                  </TabsTrigger>
                  <TabsTrigger
                    value="media"
                    className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Media
                  </TabsTrigger>
                </TabsList>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="min-h-[600px]"
                  >
                    <TabsContent value="content" className="h-full">
                      <ContentTab
                        onUpdate={() => debouncedSave(form.getValues())}
                      />
                    </TabsContent>
                    <TabsContent value="media">
                      <MediaTab />
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </Form>
    </FormProvider>
  );
}
