import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./PopOver";
import { Command, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty } from "./Command";
import { Button } from "./Button";
import { cn } from "./lib/utils";

interface ComboBoxOption {
  value: string;
  label: string;
}

interface ComboBoxProps {
  placeHolder: string;
  className?: string;
  options: ComboBoxOption[];
  onChange: (option: ComboBoxOption) => void;
  selectedOption?: string;
  noResultsText?: string;
}

export const ComboBox = ({
  className,
  options,
  onChange,
  selectedOption,
  placeHolder,
  noResultsText,
}: ComboBoxProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={options.length === 0}
          variant="outline"
          aria-expanded={open}
          className={cn("justify-between max-w-full", className)}
        >
          <span className="truncate">
            {selectedOption ? options.find((option) => option.value === selectedOption)?.label : placeHolder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder={placeHolder} />
          <CommandList>
            <CommandEmpty>{noResultsText ?? "No results found"}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn("mr-2 h-4 w-4", selectedOption?.value === option.value ? "opacity-100" : "opacity-0")}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
