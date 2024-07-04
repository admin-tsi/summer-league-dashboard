"use client";
import React from "react";
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

const CustomBreadcrumb = () => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);

  return (
    <BreadcrumbRoot className="pb-6 pt-2 text-2xl font-semibold">
      <BreadcrumbList>
        {pathParts.map((part, index) => (
          <React.Fragment key={index}>
            <BreadcrumbItem>
              {index === pathParts.length - 1 ? (
                <BreadcrumbPage>
                  {part.charAt(0).toUpperCase() + part.slice(1)}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={`/${pathParts.slice(0, index + 1).join("/")}`}>
                    {part.charAt(0).toUpperCase() + part.slice(1)}
                  </Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {index < pathParts.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Edit</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </BreadcrumbRoot>
  );
};

export default CustomBreadcrumb;
