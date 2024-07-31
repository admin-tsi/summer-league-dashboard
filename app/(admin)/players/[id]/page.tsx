"use client";
import Editinput from "@/components/player/edit/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ImageDropzone from "@/components/player/edit/picture";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Page({
  params,
}: {
  params: { id: string; token: string };
}) {
  // const token = useCurrentToken();

  const breadcrumbPaths = [
    { label: "Home", href: "/" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Players", href: "/players" },
    { label: params.id === "New" ? "New Player" : `${params.id}` },
  ];

  return (
    <div className="pt-10 px-5 flex flex-col space-y-6 container mx-auto">
      <DynamicBreadcrumbs paths={breadcrumbPaths} />
      <div className=" flex flex-col space-y-3">
        <div className="w-full flex flex-col justify-center items-center md:flex md:flex-row md:justify-normal gap-3">
          <ImageDropzone />
          <div className="w-full flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="w-fit py-3 px-6">
                Player Status
              </Badge>
              <Button variant="tableDispositionBtn" className="border shadow">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-user-pen"
                >
                  <path d="M11.5 15H7a4 4 0 0 0-4 4v2" />
                  <path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" />
                  <circle cx="10" cy="7" r="4" />
                </svg>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Editinput id="firstName" label="First Name" required />
              <Editinput id="lastName" label="Last Name" required />
              <Editinput id="dorseyNumber" label="Dorsey Number" required />
              <Editinput id="college" label="College" required />
              <Editinput id="nationality" label="Nationality" required />
              <Editinput id="email" label="Email" required />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Editinput id="fullNumber" label="Full Number" required />
          <Editinput
            id="yearsOfExperience"
            label="Years of Experience"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Editinput id="position" label="Position" required />
          <Editinput id="height" label="height" required />
          <Editinput id="weight" label="weight" required />
        </div>
      </div>
      <div className="w-full flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 gap-3">
          <span className="font-semibold">Documents</span>
          <p className="py-4 md:w-[80%]">
            Upload the secure birth certificate of the player to be registered
            on the platform. The validity of the birth certificate will be
            verified within 24 hours and will lead to the activation of the
            player&apos;s profile.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Birth certificate</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Personal identification card</AccordionTrigger>
              <AccordionContent>
                Yes. It adheres to the WAI-ARIA design pattern.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
