export interface TlsDomainLink {
  domain: string;
  link: string;
}

export interface UserLinks {
  classic?: string[];
  secure?: string[];
  tls?: string[];
  tls_domains?: TlsDomainLink[];
}

export interface ProxyLinkEntry {
  url: string;
  label: string;
  domain: string;
  isDefault: boolean;
}

function getServer(raw: string): string {
  try {
    return new URL(raw).searchParams.get('server') ?? '';
  } catch {
    return raw.match(/[?&]server=([^&]*)/)?.[1] ?? '';
  }
}

function appendComment(raw: string, username: string): string {
  try {
    const u = new URL(raw);
    u.searchParams.set('comment', username);
    return u.toString();
  } catch {
    const sep = raw.includes('?') ? '&' : '?';
    return raw + sep + 'comment=' + encodeURIComponent(username);
  }
}

export function buildProxyLinks(links: UserLinks | undefined, username: string): ProxyLinkEntry[] {
  if (!links) return [];

  const result: ProxyLinkEntry[] = [];
  const addLink = (rawUrl: string, label: string, domain: string, isDefault: boolean) => {
    result.push({
      url: appendComment(rawUrl, username),
      label,
      domain,
      isDefault,
    });
  };
  const addLinks = (urls: string[] | undefined, label: string) => {
    for (const url of urls ?? []) addLink(url, label, getServer(url), true);
  };

  if (links.tls?.length) {
    const maskByLink = new Map((links.tls_domains ?? []).map((d) => [d.link, d.domain]));
    for (const url of links.tls) addLink(url, 'TLS', maskByLink.get(url) ?? getServer(url), !maskByLink.has(url));
    result.sort((a, b) => Number(b.isDefault) - Number(a.isDefault));
  }
  addLinks(links.secure, 'Secure');
  addLinks(links.classic, 'Classic');

  return result;
}
