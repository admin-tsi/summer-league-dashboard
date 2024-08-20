"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import LoadingSpinner from "@/components/loading-spinner";
import { columns } from "@/components/players/view/columns";
import { DataTable } from "@/components/players/view/data-table";
import DynamicBreadcrumbs from "@/components/share/breadcrumbPath";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getAllPlayers } from "@/lib/api/players/players";
import { Player } from "@/lib/types/players/players";
import { useEffect, useState } from "react";
import { Season } from "@/components/players/view/saisonSelector";
import { useCurrentToken } from "@/hooks/use-current-token";

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const currentUser: any = useCurrentUser();
  const token = useCurrentToken();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        if (!token) {
          setError(
            "Unable to get player list because your token is not provided. Please reload your page, and if the problem persists, don't hesitate to contact us."
          );
          return;
        }

        const { role, isManageTeam } = currentUser;
        console.log(token);

        if (role === "admin") {
          const data = await getAllPlayers(role, token);
          setPlayers(data);
          console.log(data);
        } else if (role === "team-manager") {
          if (isManageTeam) {
            const data = await getAllPlayers(role, token, isManageTeam);
            setPlayers(data);
          } else {
            setError(
              "You're not managing any team at the moment. Please create your team to be able to add, delete, or edit players."
            );
          }
        }
      } catch (error) {
        setError("Failed to load players");
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [currentUser, token]);

  const handleDelete = (id: string) => {
    setPlayers(players.filter((player) => player._id !== id));
  };

  const handleSeasonFilter = (id: string) => {
    setPlayers(players.filter((player) => player.saison !== id));
  };

  const breadcrumbPaths = [
    { label: "Management", href: "/players" },
    { label: "Players" },
  ];

  return (
    <ContentLayout title="Players">
      <div className="flex justify-between items-center">
        <DynamicBreadcrumbs paths={breadcrumbPaths} />
        <Season handleSeasonFilter={handleSeasonFilter} />
      </div>
      <div className="py-10">
        {loading ? (
          <div className="h-[500px] w-full flex justify-center items-center">
            <LoadingSpinner text="Loading..." />
          </div>
        ) : error ? (
          <div className="h-[500px] w-full flex justify-center items-center">
            <p className="w-[80%] md:w-1/2 lg:w-1/3">{error}</p>
          </div>
        ) : (
          <DataTable
            columns={columns({ handleDelete })}
            data={players}
            isAdmin={currentUser.role === "admin" ? true : false}
          />
        )}
      </div>
    </ContentLayout>
  );
}
