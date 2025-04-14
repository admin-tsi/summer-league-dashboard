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
import { getAllCompetitions } from "@/lib/api/competitions/competitions";
import { Seasons } from "@/lib/types/competitions/competitions";
import * as React from "react";

interface SeasonSelectorProps {
  handleSeasonFilter: (seasonId: string) => void;
}

export function Season({ handleSeasonFilter }: SeasonSelectorProps) {
  const [seasons, setSeasons] = React.useState<Seasons>([]);
  const [selectedSeason, setSelectedSeason] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const token = useCurrentToken();

  React.useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const data = await getAllCompetitions(token);
        setSeasons(data);

        if (data.length > 0) {
          const lastSeason = data[data.length - 1];
          setSelectedSeason(lastSeason._id);
          handleSeasonFilter(lastSeason._id);
        }
      } catch (error) {
        setError("Failed to load seasons");
        console.error("Failed to load seasons", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompetitions();
  }, [token, handleSeasonFilter]);

  const handleChange = (value: string) => {
    setSelectedSeason(value);
    handleSeasonFilter(value);
  };

  return (
    <Select value={selectedSeason} onValueChange={handleChange}>
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Filter by season" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Summer League Season</SelectLabel>
          {loading ? (
            <SelectItem value="loading" disabled>
              Loading...
            </SelectItem>
          ) : error ? (
            <SelectItem value="error" disabled>
              {error}
            </SelectItem>
          ) : seasons.length === 0 ? (
            <SelectItem value="empty" disabled>
              No seasons available
            </SelectItem>
          ) : (
            seasons.map((season) => (
              <SelectItem
                key={season._id}
                value={season._id}
                className="cursor-pointer p-2 hover:bg-gray-200 rounded bg-secondary border mb-2"
              >
                {season.name}
              </SelectItem>
            ))
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
