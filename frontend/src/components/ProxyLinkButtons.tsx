import { useState } from 'react';
import { CopyButton } from '@/components/CopyButton';

export interface ProxyLink {
  url: string;     // full tg://proxy link, with the `comment` already appended
  label: string;   // proxy mode label: TLS, Secure, or Classic
  domain: string;  // display label: masking domain, or the real server for the default
  isDefault: boolean;
}

// Two copy buttons (tg:// and https://t.me) acting on a single selectable link.
// When several links exist (a primary plus faketls masking domains) a <select>
// underneath picks which one the buttons copy — keeping the cell compact no
// matter how many domains a user has.
export function ProxyLinkButtons({ links }: { links: ProxyLink[] }) {
  const [idx, setIdx] = useState(0);
  if (links.length === 0) {
    return <span className="text-text-secondary text-xs">No links</span>;
  }
  const selected = links[Math.min(idx, links.length - 1)];
  return (
    <div className="flex flex-col items-start gap-1.5">
      <div className="flex items-center gap-1">
        <CopyButton text={selected.url} label={selected.label} />
        <CopyButton text={selected.url.replace('tg://proxy', 'https://t.me/proxy')} label="t.me" />
      </div>
      {links.length > 1 && (
        <select
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
          aria-label="Select proxy domain"
          className="max-w-[200px] min-w-0 truncate rounded-md border border-border bg-background px-2 py-1 font-mono text-xs text-text-primary focus:border-accent focus:outline-none"
        >
          {links.map((l, i) => (
            <option key={i} value={i}>
              {l.isDefault ? `${l.domain} (default)` : l.domain}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
