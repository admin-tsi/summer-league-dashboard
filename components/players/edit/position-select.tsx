import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { positions } from "@/constants/player/player-position";

export function PositionSelect({
  position,
  setValue,
  errors,
}: {
  position: any;
  setValue: any;
  errors: any;
}) {
  return (
    <div className="w-full flex flex-col space-y-2">
      <label htmlFor="position" className="text-sm font-medium text-gray-700">
        Position
      </label>
      <Select
        onValueChange={(value) => setValue("position", value)}
        value={position}
      >
        <SelectTrigger className="">
          <SelectValue placeholder="Select a position for this player" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {positions.map((pos) => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {errors.position && (
        <span className="text-red-600 text-sm">{errors.position.message}</span>
      )}
    </div>
  );
}
