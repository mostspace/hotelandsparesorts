"use client"

import * as React from "react"
import { DayPicker, DayButton, getDefaultClassNames } from "react-day-picker"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ----------------- CalendarDayButton -----------------
interface CalendarDayButtonProps extends React.ComponentProps<typeof DayButton> {}

function CalendarDayButton({ className, day, modifiers, ...props }: CalendarDayButtonProps) {
  const defaultClassNames = getDefaultClassNames()
  const ref = React.useRef<HTMLButtonElement>(null)
  const hasFocused = React.useRef(false)

  // Focus once after mount to mimic DevTools behavior
  React.useEffect(() => {
    if (!hasFocused.current) {
      const id = setTimeout(() => {
        ref.current?.focus()
        hasFocused.current = true
      }, 5)
      return () => clearTimeout(id)
    }
  }, [])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "group/day aspect-square flex w-full min-w-[--cell-size] flex-col gap-1 leading-none font-normal",
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground",
        modifiers.hovered && !modifiers.range_end && !modifiers.range_start
          ? "bg-accent/10 text-accent-foreground"
          : "",
        modifiers.range_middle && !modifiers.hovered
          ? "bg-accent/30 text-accent-foreground"
          : "",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

// ----------------- Calendar -----------------
type CalendarProps = {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
} & React.ComponentProps<typeof DayPicker>


function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label", // ✅ only valid types
  buttonVariant = "ghost",
  components,
  formatters,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("bg-background p-3", className)}
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
        nav: cn("flex items-center gap-1 w-full justify-between", defaultClassNames.nav),
        button_previous: cn(buttonVariants({ variant: buttonVariant }), "p-0", defaultClassNames.button_previous),
        button_next: cn(buttonVariants({ variant: buttonVariant }), "p-0", defaultClassNames.button_next),
        day: cn("relative w-full h-full p-0 text-center", defaultClassNames.day),
        ...classNames,
      }}
      components={{
        DayButton: CalendarDayButton,
        ...components,
      }}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
