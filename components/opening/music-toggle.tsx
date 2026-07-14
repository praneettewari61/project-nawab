"use client";

import { Music2, VolumeX } from "lucide-react";
import { cn } from "@/lib/utils";

interface MusicToggleProps {
  isEnabled: boolean;
  onToggle: () => void;
  /** Extra classes (size/colour) so it fits both the curtain and the nav. */
  className?: string;
  iconSize?: number;
}

/** Accessible play/pause control for the background music. */
export function MusicToggle({ isEnabled, onToggle, className, iconSize = 18 }: MusicToggleProps) {
  const label = isEnabled ? "Turn background music off" : "Turn background music on";
  const Icon = isEnabled ? Music2 : VolumeX;

  return (
    <button
      aria-label={label}
      aria-pressed={isEnabled}
      className={cn(
        "grid size-11 place-items-center rounded-full border border-current/30 text-current transition-colors duration-300 hover:bg-current/10 motion-reduce:transition-none",
        className,
      )}
      onClick={onToggle}
      type="button"
    >
      <Icon aria-hidden="true" size={iconSize} strokeWidth={1.5} />
    </button>
  );
}
