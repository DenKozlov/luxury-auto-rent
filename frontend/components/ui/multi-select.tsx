import { X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useMemo, useState, useRef } from "react";

interface BaseOptions {
  options: { value: string; count?: number }[];
}

export function MultiSelect<T extends BaseOptions>({
  options,
  selected,
  onChange,
}: {
  options?: T[];
  selected: string[];
  onChange: (val: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const selectMessage = useMemo(() => {
    const sl = selected.length;
    let message = "";
    switch (sl) {
      case 0:
        message = "Select";
        break;
      case 1:
        message = selected[0];
        break;

      default:
        message = `${selected[0]} + ${sl - 1}`;
    }
    return message;
  }, [selected]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-auto min-h-10 cursor-pointer hover:bg-white aria-expanded:bg-white"
        >
          <div className="flex flex-1 justify-between">
            <div>{selectMessage}</div>
            {isOpen ? <ChevronDown /> : <ChevronUp />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <div className="relative flex items-center border-b">
            <CommandInput
              ref={inputRef}
              value={search}
              onValueChange={(val) => setSearch(val)}
              placeholder="Search..."
            />
            {search && (
              <X
                className="absolute right-3 top-3 h-4 w-4 cursor-pointer opacity-50"
                onClick={() => {
                  inputRef.current?.focus();
                }}
              />
            )}
          </div>
          <CommandList>
            <CommandEmpty>Nothing found</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => {
                    onChange(
                      selected.includes(option.value)
                        ? selected.filter((i) => i !== option.value)
                        : [...selected, option.value],
                    );
                  }}
                >
                  <div
                    className={cn(
                      "mr-2 h-4 w-4 border flex items-center justify-center",
                      selected.includes(option.value) &&
                        "bg-primary border-primary",
                    )}
                  >
                    {selected.includes(option.value) && (
                      <span className="text-white">✓</span>
                    )}
                  </div>
                  {option.value}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
