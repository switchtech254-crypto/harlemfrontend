"use client";

import { useEffect, useState } from "react";

import { WhatsAppIcon } from "@/app/components/icons/BrandIcons";
import { WHATSAPP_GREETING, whatsappUrl } from "@/app/lib/social";

/**
 * Floating "chat on WhatsApp" button, fixed to the bottom-right corner. Renders nothing without a number.
 * It fades out while the footer is on screen: the footer already has a WhatsApp icon, and the
 * button would otherwise sit on top of the footer's "Back to top" button and links.
 */
export function WhatsAppFloat({ number }: { number: string | null | undefined }) {
  const [overFooter, setOverFooter] = useState(false);

  useEffect(() => {
    const footer = document.querySelector(".store-footer");
    if (!footer || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(([entry]) => setOverFooter(Boolean(entry?.isIntersecting)));
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const href = whatsappUrl(number, WHATSAPP_GREETING);
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp (opens in a new tab)"
      title="Chat with us on WhatsApp"
      aria-hidden={overFooter || undefined}
      tabIndex={overFooter ? -1 : undefined}
      // env(safe-area-inset-bottom) keeps it clear of the iPhone home bar
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-lg ring-1 ring-black/10 transition-[opacity,transform] duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E] motion-reduce:transition-none md:bottom-6 md:right-6 md:h-16 md:w-16 ${
        overFooter ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
    </a>
  );
}
