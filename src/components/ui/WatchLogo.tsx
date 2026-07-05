import Image from "next/image";
import { LOGO_PATH, SITE_NAME } from "@/lib/brand";

export default function WatchLogo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <span className={`relative inline-block shrink-0 ${className}`}>
      <Image
        src={LOGO_PATH}
        alt={`${SITE_NAME} logo`}
        fill
        className="object-contain"
        sizes="128px"
        priority
      />
    </span>
  );
}
