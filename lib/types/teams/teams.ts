export type Teams = {
  _id: "any";
  teamName: "string";
  city: "string";
  teamHistory: "string";
  teamLogo: "string";
  divisionName: "string";
  teamGender: "string";
};

export type GameStats = {
  totalGame: number;
  wins: number;
  losses: number;
  rating: number;
};
