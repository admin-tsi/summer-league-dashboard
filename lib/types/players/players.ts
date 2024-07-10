export type Player = {
  dorseyNumber: number;
  player_status: boolean;
  _id: string;
  player_name: string;
  position: string;
  date_of_birth: Date;
  height: number;
  weight: number;
  nationality: string;
  phone_number: string;
  player_image: string;
  player_stats: {
    three_points: number;
    two_points: number;
    lancer_franc: number;
    assists: number;
    rebonds: number;
    turn_over: number;
    blocks: number;
    steal: number;
    fouls: number;
    _id: string;
  };
  saison: string;
  player_team: string;
};
