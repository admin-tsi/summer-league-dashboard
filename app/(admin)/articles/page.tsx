"use client";

import React, { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/loading-spinner";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { DataTable } from "@/components/articles/view/data-table";
import { columns } from "@/components/articles/view/columns";
import {
  getAllArticles,
  createArticle,
  deleteArticle,
  getCurrentUserArticles,
} from "@/lib/api/articles/articles";
import { Article } from "@/lib/types/articles/articles";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useCurrentUser } from "@/hooks/use-current-user";
import { AlertCircle } from "lucide-react";

const newArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  content: z.string().min(1, "Content is required"),
  status: z.enum(["draft", "pending", "published", "archived"]),
  category: z.enum(["News", "Feature", "Opinion", "Review"]),
});

type NewArticleFormData = z.infer<typeof newArticleSchema>;

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const token = useCurrentToken();
  const currentUser = useCurrentUser();
  const router = useRouter();

  const form = useForm<NewArticleFormData>({
    resolver: zodResolver(newArticleSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      status: "draft",
      category: "News",
    },
  });

  const { setValue, watch } = form;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", generateSlug(value.title || ""));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, setValue]);

  const handleView = (id: string) => {
    router.push(`/articles/${id}`);
  };

  const handleEdit = (id: string) => {
    router.push(`/articles/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (currentUser?.role !== "admin") {
      toast.error("Only admins can delete articles");
      return;
    }

    try {
      await deleteArticle(token, id);
      setArticles(articles.filter((article) => article._id !== id));
      toast.success("Article deleted successfully");
    } catch (error) {
      toast.error("Failed to delete article");
      console.error("Error deleting article:", error);
    }
  };

  const handleCreate = async (data: NewArticleFormData) => {
    setCreating(true);
    try {
      const competitionId: string | null = localStorage.getItem(
        "selectedCompetitionId",
      );
      if (!competitionId) {
        throw new Error("Competition ID not found in localStorage");
      }
      const createdArticle = await createArticle(data, token, competitionId);
      setArticles((prevArticles) => [createdArticle, ...prevArticles]);
      toast.success("New article created successfully");
      setIsModalOpen(false);
      router.push(`/articles/${createdArticle._id}`);
    } catch (error) {
      toast.error("Failed to create new article");
      console.error("Error creating article:", error);
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        let articlesData;
        if (currentUser?.role === "web-redactor") {
          // @ts-ignore
          articlesData = await getCurrentUserArticles(token, currentUser.id);
        } else {
          articlesData = await getAllArticles(token);
        }
        setArticles(articlesData);
      } catch (error) {
        setError("Failed to load articles");
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [currentUser, token]);

  const handleModalOpen = (open: boolean) => {
    setIsModalOpen(open);
    if (open) {
      console.log("fetching teams");
    } else {
      form.reset();
    }
  };

  const breadcrumbPaths = [
    { label: "Settings", href: "/articles" },
    { label: "Articles" },
  ];

  return (
    <ContentLayout title="Articles">
      <div className="flex justify-between items-center">
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
        <Dialog open={isModalOpen} onOpenChange={handleModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" /> Create Article
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Article</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreate)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter article title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter article content"
                          {...field}
                          rows={5}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                          <SelectItem value="pending">Pending</SelectItem>
                          {currentUser?.role === "admin" && (
                            <>
                              <SelectItem value="published">
                                Published
                              </SelectItem>
                              <SelectItem value="archived">Archived</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={creating}>
                  {creating ? <LoadingSpinner text="Creating..." /> : "Create"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="py-10">
        {loading ? (
          <div className="h-[500px] w-full flex justify-center items-center">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : error ? (
          <div className="h-[500px] w-full flex justify-center items-center">
            <p className="w-[80%] md:w-1/2 lg:w-1/3">{error}</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px]">
            <AlertCircle className="h-16 w-16 text-gray-500 mb-4" />
            <p className="text-lg text-gray-500">
              No articles available. Please create a new article to get started.
            </p>
          </div>
        ) : (
          <DataTable
            columns={columns(
              handleView,
              handleEdit,
              handleDelete,
              currentUser?.role || "",
            )}
            data={articles}
          />
        )}
      </div>
    </ContentLayout>
  );
}
