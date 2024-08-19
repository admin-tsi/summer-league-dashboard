import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PlayerStats } from "@/lib/types/players/players";
import { useState, useCallback } from "react";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/loading-spinner";
import { updateOtmScheduleStat } from "../../../lib/api/schedules-stats/schedules-stats";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";

type PlayerStat = {
  player: {
    _id: string;
    firstName: string;
    lastName: string;
    position: string;
    dorseyNumber: number;
    weight: number;
    playerImage: string;
  };
  threePoints: number;
  twoPoints: number;
  lancerFranc: number;
  assists: number;
  blocks: number;
  fouls: number;
  turnOver: number;
  steal: number;
  rebonds: number;
};

type EditStatsModalProps = {
  scheduleStatId: string;
  isOpen: boolean;
  onClose: () => void;
  team: PlayerStats;
  onSave: (updatedStats: { players: PlayerStat[] }) => void;
};

const statFields: (keyof Omit<PlayerStat, "player">)[] = [
  "threePoints",
  "twoPoints",
  "lancerFranc",
  "assists",
  "blocks",
  "fouls",
  "turnOver",
  "steal",
  "rebonds",
];

const statLabels: Record<keyof Omit<PlayerStat, "player">, string> = {
  threePoints: "3 Points",
  twoPoints: "2 Points",
  lancerFranc: "Lancer Franc",
  assists: "Assists",
  blocks: "Blocks",
  fouls: "Fouls",
  turnOver: "Turn Over",
  steal: "Steal",
  rebonds: "Rebonds",
};

export function EditStatsModal({
  isOpen,
  onClose,
  team,
  onSave,
  scheduleStatId,
}: EditStatsModalProps) {
  const currentUser = useCurrentUser();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editedStats, setEditedStats] = useState<PlayerStat[]>(() =>
    team.players.map((player) => ({
      player: player.player,
      threePoints: player.threePoints,
      twoPoints: player.twoPoints,
      lancerFranc: player.lancerFranc,
      assists: player.assists,
      blocks: player.blocks,
      fouls: player.fouls,
      turnOver: player.turnOver,
      steal: player.steal,
      rebonds: player.rebonds,
    }))
  );

  const handleInputChange = useCallback(
    (
      playerIndex: number,
      field: keyof Omit<PlayerStat, "player">,
      value: string
    ) => {
      setEditedStats((prevStats) =>
        prevStats.map((stat, index) =>
          index === playerIndex
            ? { ...stat, [field]: value === "" ? 0 : parseInt(value, 10) }
            : stat
        )
      );
    },
    []
  );

  const handleSave = useCallback(async () => {
    setIsLoading(true);
    try {
      const competitionId = localStorage.getItem("selectedCompetitionId");
      if (!competitionId || !currentUser?.accessToken) {
        throw new Error("Competition ID or access token not found");
      }

      const updatedPlayers: PlayerStat[] = team.players.map(
        (playerData, index) => ({
          player: playerData.player,
          threePoints: editedStats[index].threePoints,
          twoPoints: editedStats[index].twoPoints,
          lancerFranc: editedStats[index].lancerFranc,
          assists: editedStats[index].assists,
          blocks: editedStats[index].blocks,
          fouls: editedStats[index].fouls,
          turnOver: editedStats[index].turnOver,
          steal: editedStats[index].steal,
          rebonds: editedStats[index].rebonds,
        })
      );

      const newTeam = {
        ...team,
        players: updatedPlayers,
      };

      await updateOtmScheduleStat(
        competitionId,
        scheduleStatId,
        currentUser.accessToken,
        { players: newTeam.players }
      );

      toast.success("Schedule Stat updated");
      onSave(newTeam);
      onClose();
    } catch (error) {
      toast.error("Failed to update Schedule Stat");
    } finally {
      setIsLoading(false);
    }
  }, [editedStats, scheduleStatId, onSave, onClose, currentUser, team]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80%] h-[80vh] md:h-fit md:max-h-[80%] overflow-y-auto flex flex-col justify-center rounded-md">
        <div className="flex flex-col justify-center gap-2">
          <DialogTitle className="font-semibold">Edit Team Stats</DialogTitle>
          <span>
            Update the statistics for each player. Click save when you&apos;re
            done.
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 overflow-auto">
          {team.players.map((player, index) => (
            <div
              key={player.player._id}
              className="w-full grid grid-cols-1 gap-3"
            >
              <span className="font-semibold">{`${player.player.firstName} ${player.player.lastName}`}</span>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {statFields.map((field) => (
                  <div key={field} className="flex flex-col gap-2">
                    <Label
                      htmlFor={`${player.player._id}-${field}`}
                      className="mb-1"
                    >
                      {statLabels[field]}
                    </Label>
                    <Input
                      id={`${player.player._id}-${field}`}
                      type="number"
                      min={0}
                      value={editedStats[index][field] || ""}
                      onChange={(e) =>
                        handleInputChange(index, field, e.target.value)
                      }
                      onFocus={(e) => {
                        if (e.target.value === "0") {
                          e.target.value = "";
                        }
                      }}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          handleInputChange(index, field, "0");
                        }
                      }}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? <LoadingSpinner text="Saving..." /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
