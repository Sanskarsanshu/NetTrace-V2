import type { Lesson } from '../../types';

const tcpHandshakeLesson: Lesson = {
  id: 'tcp-handshake',
  moduleId: 'transport',
  title: 'TCP 3-Way Handshake',
  summary:
    'SYN, SYN-ACK, ACK — how two strangers agree on sequence numbers before sending a single byte of HTTP.',
  minutes: 9,
  level: 'Beginner',
  metrics: [
    { id: 'state', label: 'TCP STATE' },
    { id: 'rtt', label: 'ELAPSED RTT' },
    { id: 'cseq', label: 'CLIENT SEQ' },
    { id: 'sseq', label: 'SERVER SEQ' },
  ],
  legend: [
    { kind: 'tcp', label: 'SYN / ACK' },
    { kind: 'res', label: 'SYN-ACK' },
    { kind: 'http', label: 'HTTP Data' },
  ],
  goals: [
    { text: 'Why TCP needs a handshake before sending data', step: 1 },
    { text: 'What SYN, SYN-ACK, and ACK each synchronize', step: 4 },
    { text: 'Why the handshake costs 1 full round-trip (RTT)', step: 5 },
  ],
  steps: [
    {
      short: 'Closed',
      chapter: 'problem',
      title: 'Two strangers on an unreliable network',
      body: [
        'Before your browser can send an HTTP request over TCP, both sides must agree on starting <span class="term">sequence numbers</span> so they can detect missing or reordered packets.',
        'Right now, the server is waiting in <code>LISTEN</code> on port 443, and your browser has an unopened socket.',
      ],
      callout: {
        kind: 'insight',
        title: 'KEY IDEA',
        text: 'Sequence numbers are chosen <b>randomly</b> (ISN), not starting at 0, to prevent spoofing and old-packet collisions.',
      },
      metrics: {
        state: { value: 'CLOSED / LISTEN', level: 'neutral' },
        rtt: { value: 0, suffix: ' ms', level: 'neutral' },
        cseq: { value: '—', level: 'neutral' },
        sseq: { value: '—', level: 'neutral' },
      },
      scene: {
        entities: [
          { id: 'client', kind: 'laptop', x: -5.2, y: 2.2, label: 'Client (:51422)', tags: [{ text: 'CLOSED', tone: 'neutral' }] },
          { id: 'srv', kind: 'server', x: 5.2, y: -2.2, label: 'Server (:443)', tone: 'blue', tags: [{ text: 'LISTEN', tone: 'blue' }] },
        ],
        links: [{ id: 'cs', from: 'client', to: 'srv', style: 'off', arrow: 'none' }],
        flows: [],
      },
    },
    {
      short: '1. SYN',
      chapter: 'technique',
      title: 'Step 1: Client sends SYN (Seq = 1000)',
      body: [
        'Your browser picks a random Initial Sequence Number (say <code>1000</code>) and sends a <span class="term">SYN</span> (Synchronize) packet to port 443.',
        'Its socket moves to <code>SYN-SENT</code>: "Hey, I want to talk, and my bytes start at 1000."',
      ],
      changes: ['+ Client → Server: SYN (seq=1000)', '~ Client state: CLOSED → SYN-SENT'],
      metrics: {
        state: { value: 'SYN-SENT', level: 'warn' },
        rtt: { value: 15, suffix: ' ms', level: 'neutral' },
        cseq: { value: 1000, level: 'good' },
        sseq: { value: '—', level: 'neutral' },
      },
      scene: {
        entities: [
          { id: 'client', kind: 'laptop', x: -5.2, y: 2.2, label: 'Client (:51422)', highlight: true, tags: [{ text: 'SYN-SENT', tone: 'warn' }] },
          { id: 'srv', kind: 'server', x: 5.2, y: -2.2, label: 'Server (:443)', tone: 'blue', tags: [{ text: 'LISTEN', tone: 'blue' }] },
        ],
        links: [{ id: 'cs', from: 'client', to: 'srv', label: 'SYN · seq=1000' }],
        flows: [{ linkId: 'cs', kind: 'tcp', rate: 2 }],
      },
    },
    {
      short: '2. SYN-ACK',
      chapter: 'technique',
      title: 'Step 2: Server replies SYN-ACK',
      body: [
        'The server receives your SYN, picks its own random sequence number (<code>5000</code>), and replies with <span class="term">SYN-ACK</span>: <code>seq=5000, ack=1001</code>.',
        'That single packet does two jobs: acknowledges your <code>1000</code> (by asking for <code>1001</code> next) and announces its own starting number.',
      ],
      changes: ['+ Server → Client: SYN-ACK (seq=5000, ack=1001)', '~ Server state: LISTEN → SYN-RECEIVED'],
      metrics: {
        state: { value: 'SYN-RECEIVED', level: 'warn' },
        rtt: { value: 30, suffix: ' ms', level: 'neutral' },
        cseq: { value: 1001, level: 'good' },
        sseq: { value: 5000, level: 'good' },
      },
      scene: {
        entities: [
          { id: 'client', kind: 'laptop', x: -5.2, y: 2.2, label: 'Client (:51422)', tags: [{ text: 'SYN-SENT', tone: 'warn' }] },
          { id: 'srv', kind: 'server', x: 5.2, y: -2.2, label: 'Server (:443)', tone: 'blue', highlight: true, tags: [{ text: 'SYN-RECEIVED', tone: 'warn' }] },
        ],
        links: [{ id: 'cs', from: 'client', to: 'srv', arrow: 'both', label: 'SYN-ACK · ack=1001' }],
        flows: [{ linkId: 'cs', kind: 'res', rate: 2, reverse: true }],
      },
    },
    {
      short: '3. ACK',
      chapter: 'solution',
      title: 'Step 3: Client sends ACK — Established!',
      body: [
        'Your browser acknowledges the server’s sequence number with <span class="term">ACK</span> (<code>ack=5001</code>) and immediately enters <code>ESTABLISHED</code>.',
        'Both directions are now proven reachable and synchronized — your browser can piggyback the very first TLS / HTTP bytes right away!',
      ],
      changes: ['+ Client → Server: ACK (ack=5001)', '~ Both sides: ESTABLISHED'],
      metrics: {
        state: { value: 'ESTABLISHED', level: 'good' },
        rtt: { value: 30, suffix: ' ms', level: 'good' },
        cseq: { value: 1001, level: 'good' },
        sseq: { value: 5001, level: 'good' },
      },
      scene: {
        entities: [
          { id: 'client', kind: 'laptop', x: -5.2, y: 2.2, label: 'Client (:51422)', highlight: true, tags: [{ text: '✓ ESTABLISHED', tone: 'good' }] },
          { id: 'srv', kind: 'server', x: 5.2, y: -2.2, label: 'Server (:443)', tone: 'blue', highlight: true, tags: [{ text: '✓ ESTABLISHED', tone: 'good' }] },
        ],
        links: [{ id: 'cs', from: 'client', to: 'srv', arrow: 'both', label: 'ACK · ack=5001' }],
        flows: [{ linkId: 'cs', kind: 'tcp', rate: 2 }],
      },
    },
    {
      short: 'Recap',
      chapter: 'recap',
      title: '1 RTT spent, full-duplex stream ready',
      body: [
        'Three packets, one full round-trip of latency before application data starts flowing. That’s why HTTP/3 (QUIC) combines transport + TLS handshakes to shave off round trips.',
      ],
      takeaways: [
        '<b>SYN</b>: Client proposes its initial sequence number.',
        '<b>SYN-ACK</b>: Server confirms client’s seq (+1) and proposes its own.',
        '<b>ACK</b>: Client confirms server’s seq (+1); connection is <code>ESTABLISHED</code>.',
        'Cost: <b>1 full RTT</b> before the first HTTP request can be sent.',
      ],
      metrics: {
        state: { value: 'ESTABLISHED', level: 'good' },
        rtt: { value: 30, suffix: ' ms', level: 'good' },
        cseq: { value: 1001, level: 'good' },
        sseq: { value: 5001, level: 'good' },
      },
      scene: {
        entities: [
          { id: 'client', kind: 'laptop', x: -5.2, y: 2.2, label: 'Client (:51422)', tags: [{ text: '✓ Streaming HTTP', tone: 'good' }] },
          { id: 'srv', kind: 'server', x: 5.2, y: -2.2, label: 'Server (:443)', tone: 'blue', tags: [{ text: '✓ 200 OK', tone: 'good' }] },
        ],
        links: [{ id: 'cs', from: 'client', to: 'srv', arrow: 'both', label: 'Full-Duplex Stream' }],
        flows: [
          { linkId: 'cs', kind: 'http', rate: 2 },
          { linkId: 'cs', kind: 'res', rate: 2, reverse: true },
        ],
      },
    },
  ],
};

export default tcpHandshakeLesson;
