"use client"

import * as React from "react"
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { DayButton, DayPicker, getDefaultClassNames } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

// ----------------- Calendar Component -----------------
function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("flex gap-4 flex-col md:flex-row relative", defaultClassNames.months),
        month: cn("flex flex-col w-full gap-4", defaultClassNames.month),
        nav: cn("flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between", defaultClassNames.nav),
        button_previous: cn(buttonVariants({ variant: buttonVariant }), "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none", defaultClassNames.button_previous),
        button_next: cn(buttonVariants({ variant: buttonVariant }), "size-(--cell-size) aria-disabled:opacity-50 p-0 select-none", defaultClassNames.button_next),
        month_caption: cn("flex items-center justify-center h-(--cell-size) w-full px-(--cell-size)", defaultClassNames.month_caption),
        table: "w-full border-collapse",
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn("text-muted-foreground rounded-md flex-1 font-normal text-[0.8rem] select-none", defaultClassNames.weekday),
        week: cn("flex w-full mt-2", defaultClassNames.week),
        day: cn("relative w-full h-full p-0 text-center group/day aspect-square select-none", defaultClassNames.day),
        range_start: cn("rounded-l-md bg-primary", defaultClassNames.range_start),
        range_middle: cn("rounded-none bg-accent/10 text-accent-foreground", defaultClassNames.range_middle),
        range_end: cn("rounded-r-md bg-primary", defaultClassNames.range_end),
        today: cn("bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none", defaultClassNames.today),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => (
          <div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />
        ),
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") return <ChevronLeftIcon className={cn("size-4", className)} {...props} />
          if (orientation === "right") return <ChevronRightIcon className={cn("size-4", className)} {...props} />
          return <ChevronDownIcon className={cn("size-4", className)} {...props} />
        },
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

// ----------------- CalendarDayButton Component -----------------
function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)

  // Ensure focus works correctly in live mode
  React.useEffect(() => {
    if (modifiers.selected) {
      ref.current?.focus()
    }
  }, [modifiers.selected])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={modifiers.selected && !modifiers.range_start && !modifiers.range_end && !modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
        modifiers.hovered && !modifiers.range_end && !modifiers.range_start ? "bg-accent/10 text-accent-foreground" : "",
        modifiers.range_middle && !modifiers.hovered ? "bg-accent/30 text-accent-foreground" : "",
        "data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground",
        "data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground",
        "flex aspect-square w-full min-w-(--cell-size) flex-col gap-1 leading-none font-normal",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
