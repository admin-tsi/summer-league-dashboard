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
};
