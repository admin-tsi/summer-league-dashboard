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
    comment: string;
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

export type PlayerStats = {
  _id: string;
  schedule: string;
  scoreboardOfficiel: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    countryCode: string;
  };
  team: {
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
  competition: string;
  players: {
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
  __v: number;
};

export type PlayerTableData = {
  teamName: string;
  teamId: string;
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

export type PlayerStatsRow = {
  player: {
    firstName: string;
    dorseyNumber: number;
    position: string;
  };
  threePoints: number;
  twoPoints: number;
  lancerFranc: number;
  turnOver: number;
  assists: number;
  rebonds: number;
  blocks: number;
  fouls: number;
  steal: number;
};
