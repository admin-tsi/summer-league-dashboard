export interface Team {
  _id: string;
  teamName: string;
  city: string;
}

export interface Division {
  _id: string;
  divisionName: string;
  division_teams: Team[];
  competition: string;
  category: "boys" | "girls";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export type Divisions = Division[];
