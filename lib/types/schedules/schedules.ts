export type MatchType = "division" | "conference" | "playoffs" | "final";

export type Schedule = {
  _id: string;
  homeTeam: string;
  awayTeam: string;
  stadiumLocation: string;
  match_type: MatchType;
  division: string;
  conference: string;
  date: Date;
  hour: string;
  homeScoreboardOfficier: string;
  awayScoreboardOfficier: string;
  notes?: string;
  startTime?: string;
  endTime?: string;
  status?: string;
};

export type ScheduleData = {
  schedule: {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    stadiumLocation: string;
  };
  otmStats: Array<{
    scoreboardOfficiel: {
      firstName: string;
      lastName: string;
      countryCode: string;
      phoneNumber: string;
    };
    team: {
      _id: string;
      teamName: string;
      teamGender: string;
    };
    players: Array<{
      player: {
        firstName: string;
        lastName: string;
        position: string;
        dorseyNumber: number;
        playerImage: string;
        height: number;
        weight: number;
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
    }>;
  }>;
};

export type Game = {
  _id: string;
  date: string;
  startTime: string;
  endTime: string;
  homeTeam: { teamName: string };
  awayTeam: { teamName: string };
  stadiumLocation: string;
};
