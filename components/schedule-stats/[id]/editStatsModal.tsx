import React, { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/loading-spinner";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { updateOtmScheduleStat } from "@/lib/api/schedules-stats/schedules-stats";
import { Team, PlayerStat } from "@/lib/types/schedules-stats/schedules-stats";

type EditStatsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  team: Team | null;
  onSave: (updatedTeam: Team) => void;
  scheduleStatId: string | null;
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
  const [isLoading, setIsLoading] = useState(false);
  const [editedStats, setEditedStats] = useState<PlayerStat[]>([]);

  useEffect(() => {
    if (team) {
      setEditedStats(team.players);
    } else {
      setEditedStats([]);
    }
  }, [team]);

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
    if (!team || !scheduleStatId) {
      toast.error("Unable to update: missing team or schedule stat ID");
      return;
    }

    setIsLoading(true);
    try {
      const competitionId = localStorage.getItem("selectedCompetitionId");
      if (!competitionId || !currentUser?.accessToken) {
        throw new Error("Competition ID or access token not found");
      }

      const updatedTeam: Team = {
        ...team,
        players: editedStats,
      };

      await updateOtmScheduleStat(
        competitionId,
        scheduleStatId,
        currentUser.accessToken,
        { players: updatedTeam.players }
      );

      toast.success("Team stats updated successfully");
      onSave(updatedTeam);
      onClose();
    } catch (error) {
      toast.error("Failed to update team stats");
    } finally {
      setIsLoading(false);
    }
  }, [editedStats, scheduleStatId, onSave, onClose, currentUser, team]);

  if (!team) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[80%] h-[80vh] md:h-fit md:max-h-[80%] overflow-y-auto flex flex-col justify-center rounded-md">
        <DialogTitle className="font-semibold">
          Edit Team Stats: {team.team.teamName}
        </DialogTitle>

        <div className="grid grid-cols-1 gap-4 overflow-auto">
          {editedStats.map((player, playerIndex) => (
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
                      value={player[field] || ""}
                      onChange={(e) =>
                        handleInputChange(playerIndex, field, e.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="max-md:gap-2">
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
