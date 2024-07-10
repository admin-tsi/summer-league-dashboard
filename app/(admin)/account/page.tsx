import Link from "next/link";
import PlaceholderContent from "@/components/demo/placeholder-content";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const colors = [
  { name: "Background", className: "bg-background" },
  { name: "Foreground", className: "bg-foreground" },
  { name: "Card", className: "bg-card" },
  { name: "Card Foreground", className: "bg-card-foreground" },
  { name: "Popover", className: "bg-popover" },
  { name: "Popover Foreground", className: "bg-popover-foreground" },
  { name: "Primary", className: "bg-primary" },
  { name: "Primary Foreground", className: "bg-primary-foreground" },
  { name: "Primary Green", className: "bg-primary-green" },
  {
    name: "Primary Foreground Green",
    className: "bg-primary-green-foreground",
  },
  {
    name: "Primary Yellow",
    className: "bg-primary-yellow",
  },
  {
    name: "Primary Foreground Yellow",
    className: "bg-primary-yellow-foreground",
  },
  { name: "Secondary", className: "bg-secondary" },
  { name: "Secondary Foreground", className: "bg-secondary-foreground" },
  { name: "Muted", className: "bg-muted" },
  { name: "Muted Foreground", className: "bg-muted-foreground" },
  { name: "Accent", className: "bg-accent" },
  { name: "Accent Foreground", className: "bg-accent-foreground" },
  { name: "Destructive", className: "bg-destructive" },
  { name: "Destructive Foreground", className: "bg-destructive-foreground" },
  { name: "Border", className: "bg-border" },
  { name: "Input", className: "bg-input" },
  { name: "Ring", className: "bg-ring" },
];

export default function AccountPage() {
  return (
    <ContentLayout title="Account">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid grid-cols-4 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="p-4 text-center">
            <div
              className={`h-20 w-full ${color.className} rounded-custom-radius`}
            ></div>
            <p className="mt-2">{color.name}</p>
          </div>
        ))}
      </div>
    </ContentLayout>
  );
}
