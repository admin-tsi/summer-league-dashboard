import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentToken } from "@/hooks/use-current-token";
import { Competition } from "@/lib/types/competitions/competitions";
import { getAllCompetitions } from "@/lib/api/competitions/competitions";

interface seasonSelectorProps {
  handleSeasonFilter: (playerId: string) => void;
}

export function Season({ handleSeasonFilter }: seasonSelectorProps) {
  const [competitions, setCompetitions] = React.useState<Competition[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const token = useCurrentToken();

  React.useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getAllCompetitions(token);
        setCompetitions(data);
        console.log(data);
      } catch (error) {
        setError("Failed to load competitions");
        console.error("Failed to load competitions", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [token]);

  return (
    <Select>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Filter by section" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Summer League Season</SelectLabel>
          {competitions.map((competition) => (
            <SelectItem
              key={competition._id}
              value={competition._id}
              onClick={() => {
                handleSeasonFilter(competition._id);
              }}
              className="cursor-pointer p-2 hover:bg-gray-200 rounded bg-secondary border mb-2"
            >
              {competition.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
