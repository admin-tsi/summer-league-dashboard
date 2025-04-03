import { useCurrentUser } from "@/hooks/use-current-user";
import { useState } from "react";
import { Button } from "../ui/button";
import TeamCreationForm from "./teamCreationForm";

type Props = {};

function AboutTeam({}: Props) {
  const currentUserData = useCurrentUser();
  const [start, setStart] = useState(false);

  const handleSuccess = async (id: string) => {
    if (currentUserData?.updateUser) {
      await currentUserData.updateUser({ isManageTeam: id });
    }
  };

  return (
    <>
      {start ? (
        <TeamCreationForm onSuccess={handleSuccess} />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[70vh]">
          <Button
            className="w-1/2 md:w-1/4 bg-primary-yellow text-primary hover:text-white"
            onClick={() => setStart(true)}
          >
            Create your team
          </Button>
        </div>
      )}
    </>
  );
}

export default AboutTeam;
