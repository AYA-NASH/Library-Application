import React, { useState } from "react";
import { FieldPath, FieldValues, useFormContext, useController } from "react-hook-form";
import { Check, ChevronsUpDown, Trash, X } from "lucide-react";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface OptionItem {
  [key: string]: any;
}

interface FormMultiSelectFieldProps<
  TFieldValues extends FieldValues,
  TOption extends OptionItem = OptionItem
> {
  name: FieldPath<TFieldValues>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: TOption[];
  valueKey?: keyof TOption;
  labelKey?: keyof TOption;
  isLoading?: boolean;
}

export function FormMultiSelectField<
  TFieldValues extends FieldValues,
  TOption extends OptionItem = OptionItem
>({
  name,
  label,
  required,
  placeholder = "Select options...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  options = [],
  valueKey = "id" as keyof TOption,
  labelKey = "name" as keyof TOption,
  isLoading = false,
}: FormMultiSelectFieldProps<TFieldValues, TOption>) {
  const { control } = useFormContext<TFieldValues>();
  const [open, setOpen] = useState(false);

  const {
    field: { onChange, value },
    fieldState: { invalid, error },
  } = useController({ name, control });

  const selectedValues = (value ?? []) as Array<string | number>;

  const handleSelect = (optionValue: string | number) => {
    const nextValues = selectedValues.includes(optionValue)
      ? selectedValues.filter((v) => v !== optionValue)
      : [...selectedValues, optionValue];

    onChange(nextValues);
  };

  const handleRemove = (
    optionValue: string | number,
    e: React.MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    onChange(selectedValues.filter((v) => v !== optionValue));
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    onChange([]);
  };

  return (
    <Field data-invalid={invalid}>
      {label && (
        <FieldLabel>
          {label} {required && <span className="text-destructive">*</span>}
        </FieldLabel>
      )}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="h-auto w-full justify-between px-3 py-2 focus:border-ring transition-colors"
          >
            <div className="flex flex-wrap gap-1.5 items-center text-left">
              {selectedValues.length === 0 && (
                <span className="text-muted-foreground font-normal">
                  {isLoading ? "Loading..." : placeholder}
                </span>
              )}

              {selectedValues.map((val) => {
                const option = options.find((opt) => opt[valueKey] === val);
                const displayLabel = option ? String(option[labelKey]) : String(val);

                return (
                  <Badge
                    key={String(val)}
                    variant="secondary"
                    className="rounded-sm px-2 py-0.5 text-xs font-normal bg-primary-foreground/10"
                  >
                    {displayLabel}

                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={(e) => handleRemove(val, e)}
                      className="rounded-sm text-muted-foreground hover:bg-primary/20"
                    >
                      <X className="h-3 w-3 " />
                    </button>
                  </Badge>
                );
              })}
            </div>

            <div className="flex items-center">
              {selectedValues.length > 0 && (
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Clear all selections"
                  onClick={handleClearAll}
                  className="rounded-full shrink-0 text-destructive hover:bg-primary-foreground/10 p-1 transition-colors cursor-pointer"
                >
                  <Trash className="h-2 w-2" />
                </span>
              )}
              <ChevronsUpDown className="h-4 w-4 shrink-0 ml-2" />
            </div>
          </Button>
        }>

        </PopoverTrigger>

        <PopoverContent
          className="p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />

            <CommandList className="max-h-60 overflow-y-auto">
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const optValue = option[valueKey];
                  const optLabel = String(option[labelKey]);
                  const isSelected = selectedValues.includes(optValue);

                  return (
                    <CommandItem
                      key={String(optValue)}
                      value={optLabel}
                      onSelect={() => handleSelect(optValue)}
                      className="flex items-center justify-between cursor-pointer"
                    >
                      <span>{optLabel}</span>
                      {isSelected && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {invalid && error && <FieldError errors={[error]} />}
    </Field>
  );
}