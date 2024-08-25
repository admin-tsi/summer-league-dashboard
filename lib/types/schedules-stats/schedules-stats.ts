export type Player = {
  _id: string;
  firstName: string;
  lastName: string;
  position: string;
  dorseyNumber: number;
  weight: number;
  playerImage: string;
};

export type PlayerStat = {
  player: Player;
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

export type Team = {
  _id: string;
  team: {
    _id: string;
    teamName: string;
    teamGender: string;
  };
  players: PlayerStat[];
};
