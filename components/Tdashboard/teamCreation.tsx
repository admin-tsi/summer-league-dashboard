import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import TeamCreationForm from "./teamCreationForm";
import TeamStats from "./teamStats";
import { useCurrentUser } from "@/hooks/use-current-user";

type Props = {};

function AboutTeam({}: Props) {
  const currentUser: any = useCurrentUser();
  const [start, setStart] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);
  const [teamId, setTeamId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && currentUser.isManageTeam) {
      setTeamId(currentUser.isManageTeam);
      setCreationSuccess(true);
    }
  }, [currentUser]);

  const handleSuccess = (id: string) => {
    setTeamId(id);
    setCreationSuccess(true);
  };

  return (
    <>
      {creationSuccess && teamId ? (
        <TeamStats teamId={teamId} />
      ) : start ? (
        <TeamCreationForm onSuccess={handleSuccess} />
      ) : (
        <Button
          className="w-1/2 md:w-1/4 bg-primary-yellow text-primary hover:text-white"
          onClick={() => setStart(true)}
        >
          Create your team
        </Button>
      )}
    </>
  );
}

export default AboutTeam;
