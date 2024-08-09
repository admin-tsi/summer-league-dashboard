export type Player = {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  college: string;
  playerEmail: string;
  birthdate: string;
  height: number;
  yearOfExperience: number;
  dorseyNumber: number;
  weight: number;
  nationality: string;
  countryCode: string;
  phoneNumber: string;
  playerImage: string;
  cipFile: string;
  birthCertificate: string;
  saison: string;
  playerStatus: {
    status: boolean;
    comment:string;
  };
  playerTeam: {
    _id: string;
    teamName: string;
    city: string;
    teamManager: string;
    divisionName: string;
    teamGender: string;
    saison: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
};
