import type { Lesson } from '../../types';

const osiLesson: Lesson = {
  id: 'osi-7-layers',
  moduleId: 'foundations',
  title: 'The OSI Model: All 7 Layers',
  summary:
    'Follow a single HTTP request down all 7 layers of encapsulation, across a switch and router, and back up on the server.',
  minutes: 14,
  level: 'Beginner',
  metrics: [
    { id: 'layer', label: 'ACTIVE LAYER' },
    { id: 'pdu', label: 'PDU NAME' },
    { id: 'size', label: 'FRAME SIZE' },
    { id: 'overhead', label: 'HEADERS ADDED' },
  ],
  legend: [
    { kind: 'http', label: 'L7 HTTP' },
    { kind: 'tls', label: 'L6 TLS' },
    { kind: 'tcp', label: 'L4 TCP' },
    { kind: 'ip', label: 'L3 IP' },
    { kind: 'eth', label: 'L2 Frame' },
    { kind: 'bits', label: 'L1 Bits' },
    { kind: 'res', label: '200 OK' },
  ],
  goals: [
    { text: 'How an HTTP request starts at Layer 7 (Application)', step: 2 },
    { text: 'How Presentation (TLS) and Session prepare the data', step: 4 },
    { text: 'TCP ports (L4), IP addresses (L3) & MAC frames (L2)', step: 7 },
    { text: 'Why switches stop at L2 while routers inspect L3', step: 10 },
    { text: 'How the server decapsulates Layers 1 → 7 to reply', step: 11 },
  ],
  steps: [
    // STEP 1 — Overview
    {
      short: 'Overview',
      chapter: 'setup',
      title: 'One click, seven layers',
      body: [
        'You click <b>Checkout</b> on <code>https://shop.example/cart</code>. Somehow that click becomes electrical pulses on a cable, crosses multiple routers, and arrives intact at a server thousands of kilometers away.',
        'Instead of one giant tangled program, networking splits this job into <span class="term">7 independent layers</span> — the <b>OSI Model</b>. Each layer solves one problem and hands the result to the layer below it.',
      ],
      callout: {
        kind: 'insight',
        title: 'KEY IDEA',
        text: 'Going <b>down</b> the sender’s stack (L7 → L1) wraps headers around your data (<b>encapsulation</b>). Going <b>up</b> the receiver’s stack (L1 → L7) unwraps them (<b>decapsulation</b>).',
      },
      metrics: {
        layer: { value: 'L7 → L1', level: 'neutral' },
        pdu: { value: 'Ready', level: 'neutral' },
        size: { value: 180, suffix: ' B', level: 'neutral' },
        overhead: { value: 0, suffix: ' B', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.4,
            y: 2.2,
            label: 'Your Browser',
            tags: [{ text: 'GET /cart', tone: 'warn', pos: 'top' }],
            highlight: true,
          },
          {
            id: 'sw',
            kind: 'switch',
            x: -2.0,
            y: 0.0,
            label: 'Switch',
            sublabel: 'Layer 2',
            tone: 'green',
          },
          {
            id: 'rtr',
            kind: 'router',
            x: 2.0,
            y: -2.0,
            label: 'Router',
            sublabel: 'Layer 3',
            tone: 'gold',
          },
          {
            id: 'srv',
            kind: 'server',
            x: 6.2,
            y: -4.0,
            label: 'shop.example',
            sublabel: '93.184.216.34',
            tone: 'blue',
          },
        ],
        links: [
          { id: 'c-sw', from: 'client', to: 'sw', label: 'LAN' },
          { id: 'sw-rtr', from: 'sw', to: 'rtr' },
          { id: 'rtr-srv', from: 'rtr', to: 'srv', label: 'Internet' },
        ],
        flows: [
          { linkId: 'c-sw', kind: 'http', rate: 1.5 },
          { linkId: 'sw-rtr', kind: 'eth', rate: 1.5 },
          { linkId: 'rtr-srv', kind: 'ip', rate: 1.5 },
        ],
        cards: [
          {
            x: 605,
            y: 382,
            width: 295,
            title: 'THE 7-LAYER JOURNEY',
            lines: [
              { key: 'Sender (Encapsulate)', val: 'L7 → L6 → … → L1', tone: 'accent' },
              { key: 'Switch (LAN hop)', val: 'L1 → L2 only', tone: 'good' },
              { key: 'Router (Internet hop)', val: 'L1 → L2 → L3', tone: 'warn' },
              { key: 'Server (Decapsulate)', val: 'L1 → L2 → … → L7', tone: 'good' },
            ],
          },
        ],
      },
    },

    // STEP 2 — Layer 7: Application
    {
      short: 'L7 App',
      chapter: 'technique',
      title: 'Layer 7 — Application: Creating the HTTP request',
      body: [
        'Everything begins at the <span class="term">Application Layer (L7)</span> — the only layer your browser directly speaks. When you load the cart, Chrome writes a plain-text <b>HTTP/1.1</b> request.',
        'It specifies the method (<code>GET</code>), path (<code>/cart</code>), target host (<code>shop.example</code>), and your session cookie. At this stage, there are no IP addresses, no ports, and no cables — just pure application <b>Data</b> (180 bytes).',
      ],
      callout: {
        kind: 'tip',
        title: 'GOOD TO KNOW',
        text: 'Layer 7 is <b>not</b> Chrome itself — it’s the <b>protocol</b> Chrome speaks: HTTP, DNS, SMTP, SSH, or WebSockets.',
      },
      changes: [
        '+ Browser builds HTTP GET /cart (180 bytes)',
        '~ Active layer: L7 Application (PDU: Data)',
      ],
      metrics: {
        layer: { value: 'L7 Application', level: 'good' },
        pdu: { value: 'Data', level: 'neutral' },
        size: { value: 180, suffix: ' B', level: 'neutral' },
        overhead: { value: 0, suffix: ' B', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.2,
            y: 2.0,
            label: 'Chrome Browser',
            tags: [{ text: 'GET /cart HTTP/1.1', tone: 'warn', pos: 'top' }],
            highlight: true,
          },
          {
            id: 'c-osi',
            kind: 'osi-stack',
            x: -2.6,
            y: -0.2,
            label: 'Sender OSI Stack',
            activeLayer: 7,
            wrappedLayers: [7],
            direction: 'down',
          },
        ],
        links: [{ id: 'c-l7', from: 'client', to: 'c-osi', label: 'HTTP Data' }],
        flows: [{ linkId: 'c-l7', kind: 'http', rate: 2 }],
        cards: [
          {
            x: 590,
            y: 165,
            width: 316,
            title: 'L7 HTTP REQUEST PAYLOAD (180 B)',
            packetStack: [
              { label: 'HTTP DATA', sub: '180 B', color: '#fbd3ad', active: true },
            ],
            lines: [
              { key: 'Request Line', val: 'GET /cart HTTP/1.1', tone: 'accent' },
              { key: 'Host', val: 'shop.example' },
              { key: 'Cookie', val: 'sid=9f2a8c...' },
              { key: 'Accept-Encoding', val: 'gzip, br' },
            ],
          },
        ],
      },
    },

    // STEP 3 — Layer 6: Presentation
    {
      short: 'L6 Pres',
      chapter: 'technique',
      title: 'Layer 6 — Presentation: Encoding, compression & TLS',
      body: [
        'Raw HTTP text exposes your cookie to anyone on the same Wi-Fi. The <span class="term">Presentation Layer (L6)</span> acts as the translator and bodyguard.',
        'It ensures both sides agree on character encoding (<b>UTF-8</b>), optionally compresses the payload, and encrypts the HTTP message using <b>TLS 1.3</b> — turning readable text into authenticated ciphertext (+29 bytes of TLS record header & MAC tag).',
      ],
      callout: {
        kind: 'insight',
        title: 'KEY IDEA',
        text: 'Presentation handles <b>syntax</b>: encryption (TLS/SSL), compression (gzip/Brotli), and serialization (UTF-8, JSON, Protobuf).',
      },
      changes: [
        '+ UTF-8 encode + TLS 1.3 encrypt payload',
        '+ TLS record header + auth tag (+29 B)',
        '~ Plaintext HTTP is now unreadable ciphertext',
      ],
      metrics: {
        layer: { value: 'L6 Presentation', level: 'good' },
        pdu: { value: 'Encrypted Data', level: 'neutral' },
        size: { value: 209, suffix: ' B', level: 'neutral' },
        overhead: { value: 29, suffix: ' B', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.2,
            y: 2.0,
            label: 'Chrome Browser',
            tags: [{ text: '🔒 TLS 1.3 AES-GCM', tone: 'violet', pos: 'top' }],
          },
          {
            id: 'c-osi',
            kind: 'osi-stack',
            x: -2.6,
            y: -0.2,
            label: 'Sender OSI Stack',
            activeLayer: 6,
            wrappedLayers: [7, 6],
            direction: 'down',
          },
        ],
        links: [{ id: 'c-l6', from: 'client', to: 'c-osi', label: 'TLS Record' }],
        flows: [{ linkId: 'c-l6', kind: 'tls', rate: 2 }],
        cards: [
          {
            x: 590,
            y: 165,
            width: 316,
            title: 'L6 PRESENTATION WRAP (+29 B)',
            packetStack: [
              { label: 'TLS HDR', sub: '13 B', color: '#dfd3f4', active: true },
              { label: 'ENCRYPTED HTTP', sub: '180 B', color: '#fbd3ad' },
              { label: 'TAG', sub: '16 B', color: '#dfd3f4', active: true },
            ],
            lines: [
              { key: 'Cipher Suite', val: 'TLS_AES_128_GCM', tone: 'accent' },
              { key: 'Encoding', val: 'UTF-8' },
              { key: 'Plaintext visible?', val: 'NO (encrypted)', tone: 'good' },
            ],
          },
        ],
      },
    },

    // STEP 4 — Layer 5: Session
    {
      short: 'L5 Sess',
      chapter: 'technique',
      title: 'Layer 5 — Session: Managing the conversation',
      body: [
        'Opening a fresh encrypted channel for every single image on a page would be painfully slow. The <span class="term">Session Layer (L5)</span> establishes, maintains, and tears down the ongoing dialogue between two apps.',
        'It tracks which logical session this request belongs to — supporting <b>TLS session resumption</b>, HTTP keep-alive dialogues, and clean recovery if a connection pauses.',
      ],
      callout: {
        kind: 'tip',
        title: 'OSI vs TCP/IP IN REAL LIFE',
        text: 'In the practical <b>TCP/IP model</b>, Layers 7, 6, and 5 are merged into a single <b>Application Layer</b> — your browser + TLS library handle all three together.',
      },
      changes: [
        '~ Attached to active session #4091 (keep-alive)',
        '~ Ready to hand payload down to the OS kernel (L4)',
      ],
      metrics: {
        layer: { value: 'L5 Session', level: 'good' },
        pdu: { value: 'Session Data', level: 'neutral' },
        size: { value: 209, suffix: ' B', level: 'neutral' },
        overhead: { value: 29, suffix: ' B', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.2,
            y: 2.0,
            label: 'Chrome Browser',
            tags: [{ text: 'session #4091 · active', tone: 'good', pos: 'top' }],
          },
          {
            id: 'c-osi',
            kind: 'osi-stack',
            x: -2.6,
            y: -0.2,
            label: 'Sender OSI Stack',
            activeLayer: 5,
            wrappedLayers: [7, 6, 5],
            direction: 'down',
          },
        ],
        links: [{ id: 'c-l5', from: 'client', to: 'c-osi', label: 'Socket write()' }],
        flows: [{ linkId: 'c-l5', kind: 'tls', rate: 2 }],
        cards: [
          {
            x: 590,
            y: 165,
            width: 316,
            title: 'L5 SESSION STATE',
            packetStack: [
              { label: 'TLS', sub: '13 B', color: '#dfd3f4' },
              { label: 'ENCRYPTED HTTP', sub: '180 B', color: '#fbd3ad' },
              { label: 'TAG', sub: '16 B', color: '#dfd3f4' },
            ],
            lines: [
              { key: 'Session ID', val: '#4091 (Keep-Alive)', tone: 'good' },
              { key: 'Dialogue Mode', val: 'Full-Duplex' },
              { key: 'Kernel Boundary', val: 'User space → OS', tone: 'warn' },
            ],
          },
        ],
      },
    },

    // STEP 5 — Layer 4: Transport
    {
      short: 'L4 Trans',
      chapter: 'technique',
      title: 'Layer 4 — Transport: TCP segment & port numbers',
      body: [
        'Now the data enters your OS kernel’s <span class="term">Transport Layer (L4)</span>. A server might run web, mail, and SSH at the same time — so L4 stamps <b>port numbers</b> on the data so it reaches the exact right process.',
        '<b>TCP</b> adds a 20-byte header with <code>Src Port: 51422</code> (your tab), <code>Dst Port: 443</code> (HTTPS), a <b>Sequence Number</b> (so pieces reassemble in order), and a checksum. Your data is now a <b>Segment</b>.',
      ],
      callout: {
        kind: 'insight',
        title: 'KEY IDEA',
        text: '<b>IP</b> finds the machine; <b>Port</b> finds the app on that machine. TCP guarantees reliable, in-order delivery (unlike UDP, which trades reliability for speed).',
      },
      changes: [
        '+ 20-byte TCP header prepended',
        '+ Src Port 51422 → Dst Port 443 (HTTPS)',
        '~ PDU changes from Data → TCP Segment (229 B)',
      ],
      metrics: {
        layer: { value: 'L4 Transport', level: 'good' },
        pdu: { value: 'Segment', level: 'good' },
        size: { value: 229, suffix: ' B', level: 'neutral' },
        overhead: { value: 49, suffix: ' B', level: 'warn' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.2,
            y: 2.0,
            label: 'OS Kernel (TCP)',
            tags: [{ text: ':51422 → :443 (Seq 1001)', tone: 'blue', pos: 'top' }],
          },
          {
            id: 'c-osi',
            kind: 'osi-stack',
            x: -2.6,
            y: -0.2,
            label: 'Sender OSI Stack',
            activeLayer: 4,
            wrappedLayers: [7, 6, 5, 4],
            direction: 'down',
          },
        ],
        links: [{ id: 'c-l4', from: 'client', to: 'c-osi', label: 'TCP Segment' }],
        flows: [{ linkId: 'c-l4', kind: 'tcp', rate: 2 }],
        cards: [
          {
            x: 585,
            y: 165,
            width: 322,
            title: 'L4 TCP SEGMENT (+20 B HEADER)',
            packetStack: [
              { label: 'TCP', sub: '20 B', color: '#cfe0f5', active: true },
              { label: 'TLS+HTTP', sub: '209 B', color: '#fbd3ad' },
            ],
            lines: [
              { key: 'Src → Dst Port', val: '51422 → 443', tone: 'accent' },
              { key: 'Seq / Flags', val: '1001 · [PSH, ACK]' },
              { key: 'Window Size', val: '65,535 bytes' },
              { key: 'Checksum', val: '0x7c3a (valid)', tone: 'good' },
            ],
          },
        ],
      },
    },

    // STEP 6 — Layer 3: Network
    {
      short: 'L3 Net',
      chapter: 'technique',
      title: 'Layer 3 — Network: IP packet & global addresses',
      body: [
        'Ports tell the server which app to wake up, but routers on the internet need to know <b>which computer on Earth</b> to deliver to. Enter the <span class="term">Network Layer (L3)</span>.',
        'It wraps the TCP segment in a 20-byte <b>IPv4 Header</b> carrying your <code>Src IP (192.168.1.5)</code>, the server’s <code>Dst IP (93.184.216.34)</code>, and a <b>TTL (64)</b> so lost packets don’t loop forever. Now it’s an <b>IP Packet</b>.',
      ],
      callout: {
        kind: 'warn',
        title: 'WATCH OUT',
        text: 'IP is <b>best-effort</b>: it does not guarantee delivery or order. It only routes each packet hop-by-hop toward the destination IP — TCP above it handles reliability.',
      },
      changes: [
        '+ 20-byte IPv4 header prepended',
        '+ Src 192.168.1.5 → Dst 93.184.216.34 · TTL=64',
        '~ PDU changes from Segment → Packet (249 B)',
      ],
      metrics: {
        layer: { value: 'L3 Network', level: 'good' },
        pdu: { value: 'Packet', level: 'good' },
        size: { value: 249, suffix: ' B', level: 'neutral' },
        overhead: { value: 69, suffix: ' B', level: 'warn' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.2,
            y: 2.0,
            label: 'OS Kernel (IP)',
            tags: [{ text: '192.168.1.5 → 93.184.216.34', tone: 'warn', pos: 'top' }],
          },
          {
            id: 'c-osi',
            kind: 'osi-stack',
            x: -2.6,
            y: -0.2,
            label: 'Sender OSI Stack',
            activeLayer: 3,
            wrappedLayers: [7, 6, 5, 4, 3],
            direction: 'down',
          },
        ],
        links: [{ id: 'c-l3', from: 'client', to: 'c-osi', label: 'IP Packet' }],
        flows: [{ linkId: 'c-l3', kind: 'ip', rate: 2 }],
        cards: [
          {
            x: 585,
            y: 165,
            width: 322,
            title: 'L3 IPv4 PACKET (+20 B HEADER)',
            packetStack: [
              { label: 'IP', sub: '20 B', color: '#f9e1a3', active: true },
              { label: 'TCP', sub: '20 B', color: '#cfe0f5' },
              { label: 'TLS+HTTP', sub: '209 B', color: '#fbd3ad' },
            ],
            lines: [
              { key: 'Source IP', val: '192.168.1.5' },
              { key: 'Dest IP', val: '93.184.216.34', tone: 'accent' },
              { key: 'TTL / Proto', val: '64 hops · TCP (6)' },
              { key: 'Total Length', val: '249 bytes' },
            ],
          },
        ],
      },
    },

    // STEP 7 — Layer 2: Data Link
    {
      short: 'L2 Link',
      chapter: 'technique',
      title: 'Layer 2 — Data Link: Ethernet frame & MAC addresses',
      body: [
        'Your laptop isn’t wired directly to <code>shop.example</code> — it’s only connected to your local <b>router</b> on the LAN. Local network cards don’t read IPs; they read 48-bit hardware <span class="term">MAC addresses</span>.',
        'The <b>Data Link Layer (L2)</b> wraps the IP packet in a 14-byte <b>Ethernet Header</b> (<code>Src MAC: aa:11</code> → <code>Dst MAC: bb:22</code>, your router!) plus a 4-byte <b>FCS</b> checksum trailer at the tail. Now it’s a <b>Frame</b>.',
      ],
      callout: {
        kind: 'insight',
        title: 'KEY IDEA',
        text: 'Layer 2 is the <b>only layer</b> that adds both a <b>header</b> (front) and a <b>trailer</b> (back, FCS) to catch bit-flips on the wire.',
      },
      changes: [
        '+ 14-byte Ethernet header (Src/Dst MAC, EtherType 0x0800)',
        '+ 4-byte FCS (CRC-32) trailer appended at end',
        '~ PDU changes from Packet → Frame (267 B)',
      ],
      metrics: {
        layer: { value: 'L2 Data Link', level: 'good' },
        pdu: { value: 'Frame', level: 'good' },
        size: { value: 267, suffix: ' B', level: 'neutral' },
        overhead: { value: 87, suffix: ' B', level: 'warn' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.2,
            y: 2.0,
            label: 'NIC (Ethernet)',
            tags: [{ text: 'MAC aa:11 → bb:22 (Router)', tone: 'good', pos: 'top' }],
          },
          {
            id: 'c-osi',
            kind: 'osi-stack',
            x: -2.6,
            y: -0.2,
            label: 'Sender OSI Stack',
            activeLayer: 2,
            wrappedLayers: [7, 6, 5, 4, 3, 2],
            direction: 'down',
          },
        ],
        links: [{ id: 'c-l2', from: 'client', to: 'c-osi', label: 'Ethernet Frame' }],
        flows: [{ linkId: 'c-l2', kind: 'eth', rate: 2 }],
        cards: [
          {
            x: 575,
            y: 165,
            width: 332,
            title: 'L2 ETHERNET FRAME (+18 B WRAP)',
            packetStack: [
              { label: 'ETH', sub: '14 B', color: '#cde5bc', active: true },
              { label: 'IP', sub: '20 B', color: '#f9e1a3' },
              { label: 'TCP', sub: '20 B', color: '#cfe0f5' },
              { label: 'DATA', sub: '209 B', color: '#fbd3ad' },
              { label: 'FCS', sub: '4 B', color: '#cde5bc', active: true },
            ],
            lines: [
              { key: 'Src MAC (You)', val: 'aa:11:22:33:44:55' },
              { key: 'Dst MAC (Next Hop)', val: 'bb:22:33:44:55:66', tone: 'good' },
              { key: 'EtherType', val: '0x0800 (IPv4)' },
              { key: 'Frame Check (CRC)', val: '4 bytes · intact' },
            ],
          },
        ],
      },
    },

    // STEP 8 — Layer 1: Physical
    {
      short: 'L1 Phys',
      chapter: 'technique',
      title: 'Layer 1 — Physical: Turning the frame into bits',
      body: [
        'At the very bottom, the <span class="term">Physical Layer (L1)</span> doesn’t know what HTTP, TCP, or even Ethernet is. It sees 267 bytes = <b>2,136 bits</b> and blasts them onto the medium.',
        'Over Ethernet cable, those bits become voltage transitions; over fiber, pulses of laser light; over Wi-Fi, modulated 5 GHz radio waves — racing out of your laptop at roughly <b>200,000 km/s</b>.',
      ],
      callout: {
        kind: 'tip',
        title: 'GOOD TO KNOW',
        text: 'Layer 1 adds no logical header, just a tiny 8-byte <b>preamble</b> so the receiving NIC locks onto the clock signal.',
      },
      changes: [
        '~ 267-byte Frame serialized into 2,136 raw bits',
        '+ Encoded as voltage / light / RF waves on the wire',
      ],
      metrics: {
        layer: { value: 'L1 Physical', level: 'good' },
        pdu: { value: 'Bits (2,136)', level: 'good' },
        size: { value: 267, suffix: ' B', level: 'neutral' },
        overhead: { value: 87, suffix: ' B', level: 'warn' },
      },
      scene: {
        entities: [
          {
            id: 'c-osi',
            kind: 'osi-stack',
            x: -4.2,
            y: 1.4,
            label: 'Sender OSI Stack',
            activeLayer: 1,
            wrappedLayers: [7, 6, 5, 4, 3, 2, 1],
            direction: 'down',
          },
          {
            id: 'sw',
            kind: 'switch',
            x: 3.2,
            y: -1.4,
            label: 'LAN Switch',
            sublabel: 'Port 1 ← 1 Gbps',
            tone: 'green',
            tags: [{ text: '10101010 01101001…', tone: 'neutral', pos: 'top' }],
          },
        ],
        links: [{ id: 'osi-sw', from: 'c-osi', to: 'sw', label: 'Copper / Wi-Fi' }],
        flows: [{ linkId: 'osi-sw', kind: 'bits', rate: 3.5 }],
        cards: [
          {
            x: 540,
            y: 350,
            width: 355,
            title: 'L1 PHYSICAL SIGNAL',
            lines: [
              { key: 'Bit Stream', val: '10101010 01101001…', tone: 'accent' },
              { key: 'Total Bits', val: '2,136 bits (267 B)' },
              { key: 'Link Speed', val: '1,000 Mbps (1 Gbps)', tone: 'good' },
              { key: 'Serialization Time', val: '2.1 microseconds' },
            ],
          },
        ],
      },
    },

    // STEP 9 — Hop 1: L2 Switch
    {
      short: 'L2 Switch',
      chapter: 'insight',
      title: 'Hop 1: The Switch only climbs to Layer 2',
      body: [
        'Your bits arrive at the local <span class="term">Ethernet Switch</span>. It reads the bits (L1), verifies the FCS checksum, and peeks at the <b>Destination MAC (<code>bb:22</code>)</b> at Layer 2.',
        'Its MAC table says <code>bb:22</code> lives on <b>Port 4</b> (where the Router is plugged in), so it forwards the exact frame straight out Port 4. It never touches IP, TCP, or HTTP.',
      ],
      callout: {
        kind: 'insight',
        title: 'WHY LAYERING IS FAST',
        text: 'Because the switch stops at Layer 2, dedicated silicon (ASICs) can forward millions of frames per second in <b>microseconds</b>.',
      },
      changes: [
        '~ Switch inspects L2 Dst MAC: bb:22 → Port 4',
        '~ IP, TCP & HTTP headers remain untouched',
      ],
      metrics: {
        layer: { value: 'L1 → L2', level: 'good' },
        pdu: { value: 'Frame', level: 'good' },
        size: { value: 267, suffix: ' B', level: 'neutral' },
        overhead: { value: 87, suffix: ' B', level: 'neutral' },
      },
      scene: {
        entities: [
          { id: 'client', kind: 'laptop', x: -6.2, y: 3.2, label: 'Your Laptop', dim: true },
          {
            id: 'sw',
            kind: 'switch',
            x: -1.4,
            y: 1.0,
            label: 'LAN Switch',
            sublabel: 'MAC Table Lookup',
            tone: 'green',
            highlight: true,
            tags: [{ text: '✓ bb:22 → Port 4', tone: 'good', pos: 'top' }],
          },
          {
            id: 'rtr',
            kind: 'router',
            x: 3.6,
            y: -1.4,
            label: 'Router',
            sublabel: 'MAC bb:22',
            tone: 'gold',
          },
        ],
        links: [
          { id: 'c-sw', from: 'client', to: 'sw', style: 'dashed' },
          { id: 'sw-rtr', from: 'sw', to: 'rtr', label: 'Port 4' },
        ],
        flows: [{ linkId: 'sw-rtr', kind: 'eth', rate: 2.5 }],
        cards: [
          {
            x: 560,
            y: 350,
            width: 335,
            title: 'SWITCH MAC TABLE (L2 ONLY)',
            lines: [
              { key: 'aa:11:22:33:44:55', val: 'Port 1 (You)' },
              { key: 'bb:22:33:44:55:66', val: 'Port 4 (Router)', tone: 'good' },
              { key: 'Inspects IP / TCP?', val: 'NO — L2 only', tone: 'accent' },
            ],
          },
        ],
      },
    },

    // STEP 10 — Hop 2: L3 Router
    {
      short: 'L3 Router',
      chapter: 'insight',
      title: 'Hop 2: The Router strips L2 and routes on Layer 3',
      body: [
        'At the <span class="term">Router</span>, the frame climbs to <b>Layer 3</b>. The router throws away your old Ethernet frame, reads the <b>Destination IP (<code>93.184.216.34</code>)</b>, and checks its routing table.',
        'It decrements <code>TTL: 64 → 63</code>, wraps the IP packet in a <b>brand-new Layer-2 frame</b> addressed to the ISP’s next router, and sends it onto the internet. <b>MACs change at every hop; IPs stay end-to-end.</b>',
      ],
      callout: {
        kind: 'warn',
        title: 'THE GOLDEN RULE OF ROUTING',
        text: '<b>IP addresses</b> are like the final postal address on a letter. <b>MAC addresses</b> are like the local courier handing it to the next truck.',
      },
      changes: [
        '- Old LAN Ethernet header stripped',
        '~ IP TTL decremented: 64 → 63',
        '+ New WAN L2 frame wrapped for ISP next hop',
      ],
      metrics: {
        layer: { value: 'L1 → L3', level: 'warn' },
        pdu: { value: 'Packet', level: 'good' },
        size: { value: 267, suffix: ' B', level: 'neutral' },
        overhead: { value: 87, suffix: ' B', level: 'neutral' },
      },
      scene: {
        entities: [
          { id: 'sw', kind: 'switch', x: -5.8, y: 2.8, label: 'LAN Switch', tone: 'green', dim: true },
          {
            id: 'rtr',
            kind: 'router',
            x: -0.6,
            y: 0.4,
            label: 'Home Router',
            sublabel: 'Layer 3 Forwarding',
            tone: 'gold',
            highlight: true,
            tags: [{ text: 'TTL 64→63 · Next hop ISP', tone: 'warn', pos: 'top' }],
          },
          {
            id: 'srv',
            kind: 'server',
            x: 5.2,
            y: -2.4,
            label: 'shop.example',
            sublabel: '93.184.216.34',
            tone: 'blue',
          },
        ],
        links: [
          { id: 'sw-rtr', from: 'sw', to: 'rtr', style: 'dashed' },
          { id: 'rtr-srv', from: 'rtr', to: 'srv', label: 'New L2 Frame' },
        ],
        flows: [{ linkId: 'rtr-srv', kind: 'ip', rate: 2.5 }],
        cards: [
          {
            x: 545,
            y: 345,
            width: 350,
            title: 'ROUTER L3 DECISION',
            lines: [
              { key: 'Dst IP Match', val: '93.184.216.0/24', tone: 'accent' },
              { key: 'IP Header', val: 'Kept (TTL 64 → 63)', tone: 'warn' },
              { key: 'L2 MAC Header', val: 'Replaced for next hop', tone: 'good' },
              { key: 'Inspects HTTP?', val: 'NO (encrypted + L7)' },
            ],
          },
        ],
      },
    },

    // STEP 11 — Server Decapsulation (L1 → L7)
    {
      short: 'Decapsulate',
      chapter: 'solution',
      title: 'At the Server: Unwrapping Layers 1 → 7',
      body: [
        'Milliseconds later, the bits reach <code>shop.example</code>. Now the exact reverse happens — <span class="term">decapsulation</span> climbs bottom-to-top:',
        '<b>L1</b> reads the bits → <b>L2</b> verifies FCS & strips Ethernet → <b>L3</b> confirms IP matches & strips IP → <b>L4</b> checks TCP checksum & routes to <b>Port 443</b> → <b>L5/L6</b> decrypts TLS 1.3 → <b>L7</b> hands the clean <code>GET /cart</code> request to the web app!',
      ],
      callout: {
        kind: 'tip',
        title: 'SYMMETRY',
        text: 'Each layer on the server receives the <b>exact same bytes</b> that its peer layer on your laptop produced — as if they spoke directly.',
      },
      changes: [
        '- Stripped: ETH (18 B), IP (20 B), TCP (20 B), TLS (29 B)',
        '+ Clean HTTP GET /cart delivered to web server',
      ],
      metrics: {
        layer: { value: 'L1 → L7', level: 'good' },
        pdu: { value: 'HTTP Data', level: 'good' },
        size: { value: 180, suffix: ' B', level: 'good' },
        overhead: { value: 0, suffix: ' B', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 's-osi',
            kind: 'osi-stack',
            x: -1.8,
            y: 0.5,
            label: 'Server OSI Stack',
            activeLayer: 7,
            wrappedLayers: [1, 2, 3, 4, 5, 6, 7],
            direction: 'up',
            highlight: true,
          },
          {
            id: 'srv',
            kind: 'server',
            x: 4.8,
            y: -2.0,
            label: 'Web App (:443)',
            sublabel: 'shop.example',
            tone: 'blue',
            tags: [{ text: '✓ Received GET /cart', tone: 'good', pos: 'top' }],
          },
        ],
        links: [{ id: 'osi-srv', from: 's-osi', to: 'srv', label: 'GET /cart' }],
        flows: [{ linkId: 'osi-srv', kind: 'http', rate: 2.2 }],
        cards: [
          {
            x: 545,
            y: 345,
            width: 350,
            title: 'DECAPSULATION UNWRAP (L1 → L7)',
            lines: [
              { key: 'L2 ETH + L3 IP', val: 'Verified & stripped', tone: 'good' },
              { key: 'L4 TCP (:443)', val: 'Ordered & stripped', tone: 'good' },
              { key: 'L6 TLS 1.3', val: 'Decrypted & verified', tone: 'good' },
              { key: 'L7 App Receives', val: 'GET /cart (180 B)', tone: 'accent' },
            ],
          },
        ],
      },
    },

    // STEP 12 — Recap
    {
      short: 'Recap',
      chapter: 'recap',
      title: 'Full round-trip: 200 OK comes home',
      body: [
        'The web server builds <code>HTTP/1.1 200 OK</code> with your cart HTML, wraps it down <b>L7 → L1</b>, sends it back through the internet and your router, and your laptop unwraps <b>L1 → L7</b> to render the page — all in ~35 milliseconds.',
      ],
      takeaways: [
        '<b>L7 Application</b> creates the actual protocol payload (HTTP, DNS, SMTP).',
        '<b>L6 Presentation & L5 Session</b> handle encoding, compression, TLS encryption, and dialogue state.',
        '<b>L4 Transport</b> adds ports & reliability (TCP segments / UDP datagrams).',
        '<b>L3 Network</b> adds global end-to-end IP addresses so routers can forward across networks.',
        '<b>L2 Data Link</b> adds hop-by-hop MAC addresses & FCS error detection (Ethernet/Wi-Fi frames).',
        '<b>L1 Physical</b> turns frames into raw voltage, light, or radio bits on the medium.',
      ],
      metrics: {
        layer: { value: 'All 7 Layers', level: 'good' },
        pdu: { value: '200 OK', level: 'good' },
        size: { value: 1420, suffix: ' B', level: 'good' },
        overhead: { value: 87, suffix: ' B', level: 'good' },
      },
      scene: {
        entities: [
          {
            id: 'client',
            kind: 'laptop',
            x: -6.2,
            y: 3.4,
            label: 'Your Browser',
            tags: [{ text: '✓ 200 OK · Cart Loaded', tone: 'good', pos: 'top' }],
            highlight: true,
          },
          { id: 'sw', kind: 'switch', x: -1.8, y: 1.0, label: 'Switch', sublabel: 'L2', tone: 'green' },
          { id: 'rtr', kind: 'router', x: 2.2, y: -1.2, label: 'Router', sublabel: 'L3', tone: 'gold' },
          {
            id: 'srv',
            kind: 'server',
            x: 6.4,
            y: -3.2,
            label: 'shop.example',
            sublabel: '200 OK',
            tone: 'blue',
          },
        ],
        links: [
          { id: 'c-sw', from: 'client', to: 'sw', arrow: 'both' },
          { id: 'sw-rtr', from: 'sw', to: 'rtr', arrow: 'both' },
          { id: 'rtr-srv', from: 'rtr', to: 'srv', arrow: 'both', label: '35 ms RTT' },
        ],
        flows: [
          { linkId: 'rtr-srv', kind: 'res', rate: 2, reverse: true },
          { linkId: 'sw-rtr', kind: 'res', rate: 2, reverse: true },
          { linkId: 'c-sw', kind: 'res', rate: 2, reverse: true },
        ],
      },
    },
  ],
};

export default osiLesson;
