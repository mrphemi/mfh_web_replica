import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectInputProps = React.ComponentProps<typeof Select> & {
  data: { value: string; label: string }[];
};

export function SelectInput({ data, onValueChange, value }: SelectInputProps) {
  return (
    <div className="w-full">
      <Select onValueChange={onValueChange} value={value}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select an Event" />
        </SelectTrigger>
        <SelectContent>
          {data.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
