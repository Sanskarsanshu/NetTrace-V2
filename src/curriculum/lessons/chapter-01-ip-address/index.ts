import type { Lesson } from '../../../types';

const ipAddressStructureLesson: Lesson = {
  id: 'ip-address-structure',
  moduleId: 'ch1-ip-fundamentals',
  title: 'IP Fundamental',
  summary:
    'From domain request to 32-bit IPv4 octet breakdown: follow DNS resolution, 4 octets (0–255), and binary conversion.',
  minutes: 10,
  level: 'Beginner',
  metrics: [
    { id: 'dns', label: 'DNS' },
    { id: 'ip', label: 'IP' },
    { id: 'octets', label: 'OCTETS' },
    { id: 'bits', label: 'BITS' },
    { id: 'total', label: 'TOTAL' },
  ],
  legend: [
    { kind: 'http', label: 'domain query' },
    { kind: 'res', label: 'IP response' },
    { kind: 'tcp', label: 'octet / binary' },
  ],
  goals: [
    { text: 'How a human domain translates into a numeric IP via DNS', step: 2 },
    { text: 'Why IPv4 addresses are split into 4 octets (0–255)', step: 3 },
    { text: 'Converting decimal octets into 8-bit binary numbers', step: 3 },
    { text: 'Why every IPv4 address is exactly 32 bits (4 bytes)', step: 4 },
  ],
  steps: [
    {
      short: 'Client Laptop',
      chapter: 'problem',
      title: 'Your Laptop wants to visit https://Example.com',
      body: [
        'Initially, only your laptop sits on the isometric surface with a security key station.',
        'Your browser wants to connect to a human-readable domain name like <code>https://Example.com</code>, but the physical internet cannot route packets by name alone. Click <b>Next</b> to summon the DNS Resolver Server from above.',
      ],
      callout: {
        kind: 'insight',
        title: 'EVERY JOURNEY STARTS WITH A NAME',
        text: 'Humans remember domain names (Example.com), but network switches and routers only understand numeric IP addresses.',
      },
      metrics: {
        dns: { value: '—', level: 'neutral' },
        ip: { value: '—', level: 'neutral' },
        octets: { value: '0 / 4', level: 'neutral' },
        bits: { value: '—', level: 'neutral' },
        total: { value: '—', level: 'neutral' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: 0,
            y: 0,
            label: 'you',
            tone: 'slate',
            tags: [{ text: 'https://Example.com', tone: 'neutral', pos: 'top', icon: 'globe' }],
          },
        ],
        links: [],
        flows: [],
        cards: [],
      },
    },
    {
      short: 'DNS Resolver',
      chapter: 'technique',
      title: 'DNS Server descends & Red/Green lookup begins',
      body: [
        'The DNS Resolver Server rack descends from the sky and locks into position on the isometric plane.',
        'Your laptop establishes a connection: red request packets stream outward asking "Where is example.com?", and the resolver responds with green packets delivering the resolved IP address <code>192.128.168.43</code>.',
      ],
      callout: {
        kind: 'tip',
        title: 'BIDIRECTIONAL PACKET LOOP',
        text: 'UDP port 53 handles rapid DNS lookups. Responses include a Time-To-Live (TTL) so subsequent lookups are resolved from local cache.',
      },
      changes: [
        '+ DNS Resolver Server (Port 53)',
        '+ Query: where is example.com?',
        '+ Response: 192.128.168.43',
      ],
      metrics: {
        dns: { value: '20 ms', level: 'good' },
        ip: { value: '192.128.168.43', level: 'good' },
        octets: { value: '0 / 4', level: 'neutral' },
        bits: { value: '—', level: 'neutral' },
        total: { value: '20 ms', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: 0,
            y: 0,
            label: 'you',
            tone: 'slate',
            tags: [{ text: 'https://Example.com', tone: 'neutral', pos: 'top', icon: 'globe' }],
          },
          {
            id: 'dns',
            kind: 'server',
            x: 0,
            y: -6,
            label: 'DNS',
            sublabel: 'resolver',
            tone: 'gold',
            icon: 'globe',
            highlight: true,
            tags: [{ text: '→ 192.128.168.43', tone: 'warn', pos: 'top' }],
          },
        ],
        links: [
          {
            id: 'c-dns',
            from: 'client',
            to: 'dns',
            arrow: 'both',
            label: 'where is example.com?',
          },
        ],
        flows: [
          {
            linkId: 'c-dns',
            kind: 'http',
            rate: 1,
            bounce: true,
          },
        ],
        cards: [],
      },
    },
    {
      short: '4 IPv4 Octets',
      chapter: 'technique',
      title: 'Surface pans & reveals all 4 IPv4 Octet Cuboids one by one',
      body: [
        'The camera pans across the surface as four color-coded isometric cuboids drop into place.',
        'Arrows flow from the resolved IP into each cuboid, decoding each decimal value (0–255) into its fundamental 8-bit binary octet: <code>192</code> (11000000), <code>128</code> (10000000), <code>168</code> (10101000), and <code>43</code> (00101011).',
      ],
      callout: {
        kind: 'insight',
        title: 'WHY 0 TO 255?',
        text: 'An octet is exactly 8 bits. With 8 binary digits (2^8 = 256 states), the minimum decimal value is 0 (00000000) and the maximum is 255 (11111111).',
      },
      changes: [
        '+ 1st Octet: 192 → 11000000',
        '+ 2nd Octet: 128 → 10000000',
        '+ 3rd Octet: 168 → 10101000',
        '+ 4th Octet: 43 → 00101011',
      ],
      metrics: {
        dns: { value: 'Cached', level: 'good' },
        ip: { value: '192.128.168.43', level: 'good' },
        octets: { value: '4 / 4', level: 'good' },
        bits: { value: '8 bits × 4', level: 'good' },
        total: { value: '4 Octets', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: 0,
            y: 0,
            label: 'you',
            tone: 'slate',
            tags: [{ text: 'https://Example.com', tone: 'neutral', pos: 'top', icon: 'globe' }],
          },
          {
            id: 'dns',
            kind: 'server',
            x: 0,
            y: -6,
            label: 'DNS',
            sublabel: 'resolver',
            tone: 'gold',
            icon: 'globe',
            tags: [{ text: '192.128.168.43', tone: 'neutral', pos: 'top' }],
          },
        ],
        links: [],
        flows: [],
        cards: [],
      },
    },
    {
      short: '32-Bit Total',
      chapter: 'recap',
      title: 'Combining all 4 Octets into 32 Bits (4 Bytes = IPv4)',
      body: [
        'A curly brace gathers all four 8-bit binary octets together into the full 32-bit dotted binary string: <code>11000000.10000000.10101000.00101011</code>.',
        'Every IPv4 address on Earth is exactly 32 bits (4 bytes). Use the interactive converter in the stage below to convert any IPv4 address into binary or back in real time!',
      ],
      callout: {
        kind: 'tip',
        title: 'THE 4.3 BILLION ADDRESS LIMIT',
        text: '32 bits yields 2^32 = 4,294,967,296 total addresses. This address exhaustion led to CIDR, NAT, and ultimately IPv6.',
      },
      changes: [
        '+ Curly brace aggregation',
        '+ 32-bit binary representation card',
        '+ Total bits calculation (4 × 8 = 32 Bits = 4 Bytes = IPv4)',
        '+ Live IPv4 ↔ Binary converter',
      ],
      takeaways: [
        'DNS translates human hostnames into routable 32-bit IPv4 addresses.',
        'An IPv4 address consists of 4 decimal octets separated by dots (e.g. 192.128.168.43).',
        'Each octet holds 8 bits ranging from 0 to 255.',
        'Total size: 4 octets × 8 bits = 32 bits = 4 bytes.',
      ],
      metrics: {
        dns: { value: 'Resolved', level: 'good' },
        ip: { value: '192.128.168.43', level: 'good' },
        octets: { value: '4 / 4', level: 'good' },
        bits: { value: '32 Bits', level: 'good' },
        total: { value: '4 Bytes', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: 0,
            y: 0,
            label: 'you',
            tone: 'slate',
            tags: [{ text: 'https://Example.com', tone: 'neutral', pos: 'top', icon: 'globe' }],
          },
          {
            id: 'dns',
            kind: 'server',
            x: 0,
            y: -6,
            label: 'DNS',
            sublabel: 'resolver',
            tone: 'gold',
            icon: 'globe',
            tags: [{ text: '192.128.168.43', tone: 'neutral', pos: 'top' }],
          },
        ],
        links: [],
        flows: [],
        cards: [],
      },
    },
  ],
};

export default ipAddressStructureLesson;
