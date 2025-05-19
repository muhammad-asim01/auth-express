// components/base/DropDownDialog.tsx
"use client"

import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BodyText } from "./typography/BodyText"
import { cn } from "@/lib/utils"

export interface DropDownItem {
  label: string
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
}

interface DropDownDialogProps {
  trigger: React.ReactNode
  items: DropDownItem[]
  className?: string // for DropdownMenuContent
  itemClassName?: string // for DropdownMenuItem
  align?: "start" | "center" | "end"
  sideOffset?: number
  widthClass?: string
}

export function DropDownDialog({
  trigger,
  items,
  className,
  itemClassName,
  align = "start",
  sideOffset = 8,
  widthClass = "w-64",
}: DropDownDialogProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align={align}
        sideOffset={sideOffset}
        className={cn(
          widthClass,
          "py-3 border border-font4/10 rounded-sm shadow-md bg-white",
          className
        )}
      >
        <DropdownMenuGroup>
          {items.map((item, index) => (
            <DropdownMenuItem
              key={index}
              disabled={item.disabled}
              onClick={item.onClick}
              className={cn(
                "gap-3 flex items-center cursor-pointer text-font1 hover:bg-font4/10",
                itemClassName
              )}
            >
              <span>{item.icon}</span>
              <BodyText variant="body3" className="font-normal group-hover:font-medium">
                {item.label}
              </BodyText>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
