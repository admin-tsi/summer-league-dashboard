type PlayerTeam = {
  _id: string;
  teamName: string;
  city: string;
};

export type Player = {
  __v: number;
  _id: string;
  birthdate: string;
  countryCode: string;
  dorseyNumber: number;
  firstName: string;
  height: number;
  lastName: string;
  nationality: string;
  phoneNumber: string;
  playerEmail: string;
  playerTeam: PlayerTeam;
  position: string;
  saison: string;
  weight: number;
  yearOfExperience: number;
};
