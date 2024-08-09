"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { useCurrentToken } from "@/hooks/use-current-token";
import LoadingSpinner from "@/components/loading-spinner";
import { Competition } from "@/lib/types/competitions/competitions";
import { getAllCompetitions } from "@/lib/api/competitions/competitions";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@radix-ui/react-popover";

const CompetitionSelector: React.FC = () => {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [selectedCompetition, setSelectedCompetition] =
    useState<Competition | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useCurrentToken();

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getAllCompetitions(token);

        setCompetitions(data);
        if (data.length > 0) {
          setSelectedCompetition(data[0]);
        }
      } catch (error) {
        setError("Failed to load competitions");
        console.error("Failed to load competitions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [token]);

  useEffect(() => {
    if (selectedCompetition) {
      localStorage.setItem("selectedCompetitionId", selectedCompetition._id);
    }
  }, [selectedCompetition]);

  const handleSelectCompetition = (competition: Competition) => {
    setSelectedCompetition(competition);
  };

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4">
        <LoadingSpinner text="Loading..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 right-0">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center p-2 bg-primary-yellow text-primary-foreground w-full md:w-auto">
            <span className="truncate">
              {selectedCompetition
                ? selectedCompetition.name
                : "Select a competition"}
            </span>
            <ChevronDown className="ml-2 h-4 w-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-2 max-h-80 overflow-y-auto w-64 md:w-80">
          {competitions.map((competition) => (
            <div
              key={competition._id}
              onClick={() => handleSelectCompetition(competition)}
              className="cursor-pointer p-2 hover:bg-gray-200 rounded bg-secondary border mb-2"
            >
              {competition.name}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CompetitionSelector;
