import Link from "next/link";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.svg";
import React from "react";

interface NavProps {
  isCollapsed: boolean;
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant: "default" | "ghost";
    href: string;
  }[];
}

export function Nav({ links, isCollapsed }: NavProps) {
  const pathName = usePathname();

  const isLinkActive = (linkHref: string) => {
    if (linkHref === "/" && pathName === "/") {
      return true;
    }

    return (
      pathName !== "/" &&
      pathName.startsWith(linkHref) &&
      (pathName.charAt(linkHref.length) === "/" ||
        pathName.length === linkHref.length)
    );
  };

  return (
    <TooltipProvider>
      <div className="group flex flex-col data-[collapsed=true]:py-2">
        <nav className="grid gap-6 m-auto group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
          <Link href="/" className="block h-full w-8 mr-4">
            <Image
              src={logo}
              alt="AWSP Logo"
              layout="responsive"
              width={72}
              height={64}
            />
          </Link>
          {links.map((link, index) => (
            <Tooltip key={index} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    buttonVariants({
                      variant: isLinkActive(link.href) ? "default" : "ghost",
                      size: "icon",
                    }),
                    "h-9 w-9",
                    link.variant === "default" &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                  )}
                >
                  <link.icon />
                  <span className="sr-only">{link.title}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {link.title}
                {link.label && (
                  <span className="ml-auto text-muted-foreground">
                    {link.label}
                  </span>
                )}
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
}
