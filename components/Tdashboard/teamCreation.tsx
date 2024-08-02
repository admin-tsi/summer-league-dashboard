import React, { useState } from "react";
import { Button } from "../ui/button";
import TeamCreationForm from "./teamCreationForm";

type Props = {};

function TeamCreation({}: Props) {
  const [start, setStart] = useState(false);
  return (
    <>
      {start ? (
        <TeamCreationForm />
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

export default TeamCreation;
