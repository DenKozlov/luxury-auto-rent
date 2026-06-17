import { X, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
  value: string;
  count?: number;
}

interface MultiSelectProps<T extends BaseOptions> {
  options: T[];
  selected: string[];
  onChange: (val: string[]) => void;
  withSearch?: boolean;
  placeholder?: string;
  isLoading?: boolean;
  withSelectAll?: boolean;
}

export function MultiSelect<T extends BaseOptions>({
  options,
  selected,
  onChange,
  withSearch,
  placeholder,
  isLoading,
  withSelectAll,
}: MultiSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const hasOptions = options.length !== 0;
  const selectMessage = useMemo(() => {
    if (!hasOptions) {
      return "Nothing to select";
    }
    const sl = selected.length;
    let message = "";
    switch (sl) {
      case 0:
        message = placeholder ? placeholder : "Select";
        break;
      case 1:
        message = selected[0];
        break;

      default:
        message = `${selected[0]} + ${sl - 1}`;
    }
    return message;
  }, [hasOptions, placeholder, selected]);

  if (isLoading) {
    return <Skeleton className="w-full h-10" />;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between h-auto min-h-10 cursor-pointer hover:bg-white aria-expanded:bg-white"
          disabled={!hasOptions}
        >
          <div className="flex flex-1 justify-between">
            <div>{selectMessage}</div>
            {isOpen ? <ChevronDown /> : <ChevronUp />}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-(--radix-popover-trigger-width)">
        <Command>
          {withSearch && (
            <div className="relative flex items-center border-b pb-2.5 w-full">
              <CommandInput
                ref={inputRef}
                value={search}
                onValueChange={(val) => setSearch(val)}
                placeholder="Search..."
                className=""
              />
              {search && (
                <X
                  className="absolute right-3 top-3 h-4 w-4 cursor-pointer opacity-50"
                  onClick={() => {
                    setSearch("");
                  }}
                />
              )}
            </div>
          )}
          <CommandList>
            <CommandEmpty>Nothing found</CommandEmpty>
            <CommandGroup className="h-auto!">
              <>
                {withSelectAll && (
                  <CommandItem
                    className="aria-selected:bg-transparent aria-selected:hover:bg-accent cursor-pointer"
                    onSelect={() => {
                      onChange(
                        selected.length === options.length
                          ? []
                          : options.map((o) => o.value),
                      );
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 h-4 w-4 border flex items-center justify-center",
                        selected.length > 0 && "bg-primary border-primary",
                      )}
                    >
                      {selected.length === options.length && (
                        <span className="text-white">✓</span>
                      )}
                      {selected.length > 0 &&
                        selected.length < options.length && (
                          <span className="text-white">—</span>
                        )}
                    </div>
                    Select All
                  </CommandItem>
                )}
                {options?.map((option) => (
                  <CommandItem
                    className="aria-selected:bg-transparent aria-selected:hover:bg-accent cursor-pointer"
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
              </>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
