import { buildProxyLinks } from './usersPage.helpers';

const username = 'alice';

function assertDeepEqual(actual: unknown, expected: unknown) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);
  if (actualJson !== expectedJson) {
    throw new Error(`Expected ${expectedJson}, got ${actualJson}`);
  }
}

const tlsLinks = buildProxyLinks(
  {
    tls: [
      'tg://proxy?server=edge.example&port=443&secret=tls-default',
      'tg://proxy?server=edge.example&port=443&secret=tls-mask',
    ],
    tls_domains: [
      {
        domain: 'cdn.example',
        link: 'tg://proxy?server=edge.example&port=443&secret=tls-mask',
      },
    ],
  },
  username,
);

assertDeepEqual(
  tlsLinks.map((link) => ({
    label: link.label,
    domain: link.domain,
    isDefault: link.isDefault,
    url: link.url,
  })),
  [
    {
      label: 'TLS',
      domain: 'edge.example',
      isDefault: true,
      url: 'tg://proxy?server=edge.example&port=443&secret=tls-default&comment=alice',
    },
    {
      label: 'TLS',
      domain: 'cdn.example',
      isDefault: false,
      url: 'tg://proxy?server=edge.example&port=443&secret=tls-mask&comment=alice',
    },
  ],
);

assertDeepEqual(
  buildProxyLinks(
    {
      secure: ['tg://proxy?server=secure.example&port=443&secret=secure-secret'],
    },
    username,
  ).map((link) => [link.label, link.domain, link.isDefault]),
  [['Secure', 'secure.example', true]],
);

assertDeepEqual(
  buildProxyLinks(
    {
      classic: ['tg://proxy?server=classic.example&port=443&secret=classic-secret'],
    },
    username,
  ).map((link) => [link.label, link.domain, link.isDefault]),
  [['Classic', 'classic.example', true]],
);
