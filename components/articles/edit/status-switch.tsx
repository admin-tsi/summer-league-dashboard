import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useFormContext } from "react-hook-form";
import { Eye, EyeOff, Archive } from "lucide-react";
import { useCurrentToken } from "@/hooks/use-current-token";
import {
  updateArticleStatus,
  updateCurrentUserArticleStatus,
} from "@/lib/api/articles/articles";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSwitchProps {
  articleId: string;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({ articleId }) => {
  const { watch, setValue } = useFormContext();
  const status = watch("status");
  const [isUpdating, setIsUpdating] = useState(false);
  const token = useCurrentToken();
  const currentUser = useCurrentUser();

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      if (currentUser?.role === "web-redactor") {
        await updateCurrentUserArticleStatus(
          articleId,
          { status: newStatus },
          token,
        );
      } else {
        await updateArticleStatus(articleId, newStatus, false, token);
      }
      setValue("status", newStatus, { shouldValidate: true });
      toast.success(`Article status updated to ${newStatus}`);
    } catch (error) {
      toast.error("Failed to update article status");
      console.error("Error updating article status:", error);
      setValue("status", status, { shouldValidate: true });
    } finally {
      setIsUpdating(false);
    }
  };

  if (currentUser?.role === "web-redactor") {
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="status-switch"
          checked={status === "pending"}
          onCheckedChange={(checked) =>
            handleStatusChange(checked ? "pending" : "draft")
          }
          disabled={isUpdating}
          className="data-[state=checked]:bg-primary-green"
        />
        <Label
          htmlFor="status-switch"
          className="flex items-center space-x-2 text-primary"
        >
          {status === "pending" ? (
            <>
              <Eye className="h-4 w-4 text-primary-green" />
              <span className="text-primary-green">Pending</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Draft</span>
            </>
          )}
        </Label>
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-2">
        <Select
          value={status}
          onValueChange={handleStatusChange}
          disabled={isUpdating}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">
              <div className="flex items-center">
                <EyeOff className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Draft</span>
              </div>
            </SelectItem>
            <SelectItem value="pending">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2 text-primary-green" />
                <span>Pending</span>
              </div>
            </SelectItem>
            <SelectItem value="published">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2 text-primary-blue" />
                <span>Published</span>
              </div>
            </SelectItem>
            <SelectItem value="archived">
              <div className="flex items-center">
                <Archive className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>Archived</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  }
};

export default StatusSwitch;
