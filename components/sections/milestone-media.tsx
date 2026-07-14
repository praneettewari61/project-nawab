import Image from "next/image";
import type { StoryMilestone } from "@/lib/config/story";

type MilestoneMediaProps = Pick<StoryMilestone, "image" | "video">;

/**
 * Renders a milestone's media inside a fixed 4:5 frame. Shows a playable video
 * when one is provided (poster falling back to the still), otherwise an
 * optimized image. Data-driven — the timeline never assumes which is present.
 */
export function MilestoneMedia({ image, video }: MilestoneMediaProps) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-sand/60 bg-warm-white shadow-soft">
      {video ? (
        <video
          className="size-full object-cover"
          controls
          playsInline
          poster={video.poster ?? image.src}
          preload="none"
        >
          <source src={video.src} type="video/mp4" />
        </video>
      ) : (
        <Image
          alt={image.alt}
          className="object-cover"
          fill
          sizes="(min-width: 768px) 24rem, 88vw"
          src={image.src}
        />
      )}
    </div>
  );
}
