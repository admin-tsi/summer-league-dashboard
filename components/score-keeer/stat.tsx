import React from "react";
import { Button } from "../ui/button";

type Props = {
  playerStats: string;
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

const Stat = ({ playerStats, value, onIncrement, onDecrement }: Props) => {
  return (
    <div className="w-full grid grid-cols-1 border border-3">
      <div className="w-full bg-black text-background p-2">
        <span className="font-medium">{playerStats}</span>
      </div>
      <div className="flex items-center">
        <div className="w-full text-3xl p-2">
          {value.toString().padStart(2, "0")}
        </div>
        <div className="flex">
          <Button
            variant="def"
            className="bg-primary-yellow rounded-none border border-black size-14"
            onClick={onIncrement}
          >
            +
          </Button>
          <Button
            variant="def"
            className="bg-primary-yellow rounded-none border border-black size-14"
            onClick={onDecrement}
          >
            -
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Stat;
