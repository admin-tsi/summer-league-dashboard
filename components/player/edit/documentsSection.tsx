import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Dropzone from "@/components/player/edit/dragzone";
import { Player } from "@/lib/types/players/players";

type PartialPlayer = Partial<Player>;

export function DocumentsSection({
  isEditing,
  defPlayerValue,
  setValue,
  errors,
}: {
  isEditing: boolean;
  defPlayerValue: PartialPlayer | undefined;
  setValue: any;
  errors: any;
}) {
  const [updateBirthCertificate, setUpdateBirthCertificate] = useState(false);
  const [updateCipCertificate, setUpdateCipCertificate] = useState(false);

  return (
    <div className="w-full flex flex-col">
      <div className="w-full md:w-1/2 gap-3">
        <span className="font-semibold">Documents</span>
        <p className="py-4 md:w-[80%]">
          Upload the secure birth certificate of the player to be registered on
          the platform. The validity of the birth certificate will be verified
          within 24 hours and will lead to the activation of the player&apos;s
          profile.
        </p>
      </div>
      <div className="w-full flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <span className="font-semibold">Birth certificate</span>

          {isEditing ? (
            <div className="flex flex-col gap-4">
              {!updateBirthCertificate ? (
                <>
                  <div className="flex items-center gap-2">
                    <FileText size={32} />
                    <Link
                      href={defPlayerValue?.birthCertificate || "#"}
                      className="font-bold"
                    >
                      {defPlayerValue?.firstName} {defPlayerValue?.lastName}{" "}
                      Birth Certificate
                    </Link>
                  </div>
                  <div className="w-full flex justify-end items-center">
                    <Button
                      type="button"
                      onClick={() => setUpdateBirthCertificate(true)}
                    >
                      Update Birth Certificate file
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Dropzone
                    type="file"
                    setValue={setValue}
                    attribute="birthCertificate"
                    title="update"
                  />
                  {errors.birthCertificate && (
                    <p className="text-red-500 text-sm">
                      {errors.birthCertificate.message}
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <Dropzone
                type="file"
                setValue={setValue}
                attribute="birthCertificate"
              />
              {errors.birthCertificate && (
                <p className="text-red-500 text-sm">
                  {errors.birthCertificate.message}
                </p>
              )}
            </>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col space-y-2">
          <span className="font-semibold">CIP certificate</span>
          {isEditing ? (
            <div className="flex flex-col gap-4">
              {!updateCipCertificate ? (
                <>
                  <div className="flex items-center gap-2">
                    <FileText size={32} />
                    <Link
                      href={defPlayerValue?.cipFile || "#"}
                      className="font-bold"
                    >
                      {defPlayerValue?.firstName} {defPlayerValue?.lastName} CIP
                      Certificate
                    </Link>
                  </div>
                  <div className="w-full flex justify-end items-center">
                    <Button
                      type="button"
                      onClick={() => setUpdateCipCertificate(true)}
                    >
                      Update CIP file
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Dropzone
                    type="file"
                    setValue={setValue}
                    attribute="cipFile"
                    title="update"
                  />
                  {errors.cipFile && (
                    <p className="text-red-500 text-sm">
                      {errors.cipFile.message}
                    </p>
                  )}
                </>
              )}
            </div>
          ) : (
            <>
              <Dropzone type="file" setValue={setValue} attribute="cipFile" />
              {errors.cipFile && (
                <p className="text-red-500 text-sm">{errors.cipFile.message}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
