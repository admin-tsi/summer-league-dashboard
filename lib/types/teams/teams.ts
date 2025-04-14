export type GameStats = {
  totalGame: number;
  wins: number;
  losses: number;
  rating: number;
};

interface TeamManager {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
}

export type Teams = {
  _id: string;
  teamName: string;
  city: string;
  teamManager: TeamManager;
  divisionName: string;
  stepLevelId: string;
  teamGender: "girls" | "boys";
  saison: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
};
