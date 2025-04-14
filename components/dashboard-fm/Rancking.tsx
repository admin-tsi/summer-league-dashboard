import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useRef, useEffect, memo } from "react";

// Définition du type de données d'équipe avec des propriétés typées correctement
interface Team {
  equipe: string;
  position: number;
  threePT: string;
  twoPT: string;
  STL: number;
  TT: number;
  RANK: string;
}

// Typage correct des props (vide mais défini pour clarté)
interface RankingProps {}

// Constante TEAMS déplacée en dehors du composant pour éviter les re-créations inutiles
const TEAMS: Team[] = [
  {
    equipe: "ORI DESTINI",
    position: 1,
    threePT: "42.5%",
    twoPT: "56.8%",
    STL: 8.2,
    TT: 86,
    RANK: "A+",
  },
  {
    equipe: "THUNDER HAWKS",
    position: 2,
    threePT: "38.9%",
    twoPT: "54.3%",
    STL: 7.5,
    TT: 82,
    RANK: "A",
  },
  {
    equipe: "CITY BLAZERS",
    position: 3,
    threePT: "40.2%",
    twoPT: "51.7%",
    STL: 6.8,
    TT: 79,
    RANK: "A-",
  },
  {
    equipe: "ROYAL KNIGHTS",
    position: 4,
    threePT: "36.4%",
    twoPT: "53.2%",
    STL: 6.5,
    TT: 77,
    RANK: "B+",
  },
  {
    equipe: "PHOENIX SUNS",
    position: 5,
    threePT: "35.8%",
    twoPT: "52.6%",
    STL: 5.9,
    TT: 75,
    RANK: "B",
  },
  {
    equipe: "COSMIC BULLS",
    position: 6,
    threePT: "33.7%",
    twoPT: "50.1%",
    STL: 5.2,
    TT: 72,
    RANK: "B-",
  },
  {
    equipe: "METRO WARRIORS",
    position: 7,
    threePT: "32.5%",
    twoPT: "49.3%",
    STL: 4.8,
    TT: 68,
    RANK: "C+",
  },
];

// Création d'un composant séparé pour les en-têtes de tableau
const TableHeaderRow = memo(() => (
  <TableRow className="border-b transition-colors data-[state=selected]:bg-muted">
    <TableHead className="h-12 px-4 text-left align-middle font-medium text-background w-[10%]">
      Pos
    </TableHead>
    <TableHead className="h-12 px-4 text-left align-middle font-medium text-background w-[40%]">
      Équipe
    </TableHead>
    <TableHead className="h-12 px-4 text-left align-middle font-medium text-background w-[10%]">
      3PT
    </TableHead>
    <TableHead className="h-12 px-4 text-left align-middle font-medium text-background w-[10%]">
      2PT
    </TableHead>
    <TableHead className="h-12 px-4 text-left align-middle font-medium text-background w-[10%]">
      STL
    </TableHead>
    <TableHead className="h-12 px-4 text-left align-middle font-medium text-background w-[10%]">
      TT
    </TableHead>
    <TableHead className="h-12 px-4 text-left align-middle font-medium text-background w-[10%]">
      RANK
    </TableHead>
  </TableRow>
));

TableHeaderRow.displayName = "TableHeaderRow";

// Composant de ligne d'équipe memoizé pour éviter des rendus inutiles
const TeamRow = memo(({ team, index }: { team: Team; index: number }) => {
  // Style de bordure basé sur l'index/position
  const getBorderClass = () => {
    if (index === 0) return "border-l-4 border-l-primary";
    if (index === 1) return "border-l-4 border-l-primary-yellow";
    if (index === 2) return "border-l-4 border-l-primary-green";
    return "";
  };

  return (
    <TableRow
      className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted mt-1 ${getBorderClass()}`}
    >
      <TableCell className="p-4 align-middle w-[10%]">
        {team.position}
      </TableCell>
      <TableCell className="p-4 align-middle font-medium w-[40%]">
        {team.equipe}
      </TableCell>
      <TableCell className="p-4 align-middle text-center w-[10%]">
        {team.threePT}
      </TableCell>
      <TableCell className="p-4 align-middle text-center w-[10%]">
        {team.twoPT}
      </TableCell>
      <TableCell className="p-4 align-middle text-center w-[10%]">
        {team.STL}
      </TableCell>
      <TableCell className="p-4 align-middle text-center w-[10%]">
        {team.TT}
      </TableCell>
      <TableCell className="p-4 align-middle text-center w-[10%]">
        {team.RANK}
      </TableCell>
    </TableRow>
  );
});

TeamRow.displayName = "TeamRow";

const Ranking = (props: RankingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Hook d'effet optimisé
  useEffect(() => {
    const container = containerRef.current;
    const header = headerRef.current;

    if (!container || !header) return;

    // Fonction pour synchroniser le défilement
    const handleScroll = () => {
      if (header) {
        header.scrollLeft = container.scrollLeft;
      }
    };

    // Ajouter l'écouteur d'événement
    container.addEventListener("scroll", handleScroll);

    // Nettoyer l'écouteur lors du démontage
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Card className="border-b-8 border-primary shadow-sm h-[50vh] flex flex-col">
      <CardHeader className="pb-4 z-10">
        <CardTitle className="text-primary">Tournament Ranking</CardTitle>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col overflow-hidden p-0">
        {/* En-tête avec scroll synchronisé */}
        <div
          ref={headerRef}
          className="w-full overflow-x-hidden px-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="min-w-[650px]">
            <Table>
              <TableHeader className="bg-primary text-sm">
                <TableHeaderRow />
              </TableHeader>
            </Table>
          </div>
        </div>

        {/* Corps du tableau avec défilement */}
        <div
          ref={containerRef}
          className="flex-grow overflow-y-auto overflow-x-auto px-4 pb-4"
        >
          <div className="min-w-[650px]">
            <Table>
              <TableBody className="text-sm">
                {TEAMS.map((team, index) => (
                  <TeamRow key={team.equipe} team={team} index={index} />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Ranking;
