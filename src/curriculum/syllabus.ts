import type { Lesson, SyllabusModule } from '../types';

export const SYLLABUS: SyllabusModule[] = [
  {
    id: 'ch1-ip-fundamentals',
    num: '01',
    title: 'Ch 1: IP Addressing',
    tone: 'teal',
    lessons: [
      {
        id: 'ip-address-structure',
        title: 'How a Request Travels',
        summary:
          'Follow one page load hop by hop — and find out where the time really goes.',
        minutes: 10,
        level: 'Beginner',
        ready: true,
      },
    ],
  },
  {
    id: 'foundations',
    num: '02',
    title: 'Foundations',
    tone: 'sand',
    lessons: [
      {
        id: 'osi-7-layers',
        title: 'The OSI Model: All 7 Layers',
        summary: 'Follow one HTTP request down all 7 layers of encapsulation, across a switch and router, and back up.',
        minutes: 14,
        level: 'Beginner',
        ready: true,
      },
      {
        id: 'url-lifecycle',
        title: 'What Happens When You Type a URL',
        summary: 'From pressing Enter to pixels on screen — DNS, TCP, TLS, HTTP and rendering.',
        ready: false,
      },
      {
        id: 'latency-bandwidth',
        title: 'Latency, Bandwidth & Throughput',
        summary: 'Why a wider pipe does not make a single packet travel faster.',
        ready: false,
      },
      {
        id: 'mtu-fragmentation',
        title: 'Packets, Frames & MTU',
        summary: 'Why the internet chops big data into 1,500-byte chunks.',
        ready: false,
      },
    ],
  },
  {
    id: 'link',
    num: '02',
    title: 'Physical & Link',
    tone: 'green',
    lessons: [
      { id: 'bits-signals', title: 'Bits on Copper, Fiber & Wi-Fi', summary: 'Encoding 1s and 0s into voltage, light pulses, and radio waves.', ready: false },
      { id: 'ethernet-mac', title: 'Ethernet & MAC Addresses', summary: 'Hardware addresses, framing, and CRC error detection.', ready: false },
      { id: 'switches', title: 'Switches & MAC Learning', summary: 'How a Layer-2 switch learns who lives on each port.', ready: false },
      { id: 'arp', title: 'ARP: IP to MAC Resolution', summary: 'Shouting on the LAN to discover a neighbor’s hardware address.', ready: false },
      { id: 'vlans-wifi', title: 'VLANs & Wi-Fi (CSMA/CA)', summary: 'Virtual LAN segmentation and sharing the wireless airwaves.', ready: false },
    ],
  },
  {
    id: 'network',
    num: '03',
    title: 'Network',
    tone: 'violet',
    lessons: [
      { id: 'ipv4-cidr', title: 'IPv4 Addressing & CIDR', summary: 'Network prefixes, host bits, and why classful IPs died.', ready: false },
      { id: 'subnetting', title: 'Subnetting Visually', summary: 'Carving one IP block into clean subnets without guesswork.', ready: false },
      { id: 'routers-forwarding', title: 'Routers & Longest-Prefix Match', summary: 'How a router picks the next hop in nanoseconds.', ready: false },
      { id: 'nat', title: 'NAT & Private Networks', summary: 'How one public IP serves an entire home or office.', ready: false },
      { id: 'icmp-traceroute', title: 'ICMP, Ping & Traceroute', summary: 'Using TTL expiry to map every router between two hosts.', ready: false },
      { id: 'ipv6', title: 'IPv6 & Dual Stack', summary: '128-bit addresses, SLAAC, and why NAT is no longer needed.', ready: false },
    ],
  },
  {
    id: 'routing',
    num: '04',
    title: 'Routing',
    tone: 'orange',
    lessons: [
      { id: 'static-dynamic', title: 'Static vs Dynamic Routing', summary: 'When hand-written routes break and routers must talk.', ready: false },
      { id: 'rip', title: 'Distance-Vector (RIP)', summary: 'Routing by rumor — and the count-to-infinity trap.', ready: false },
      { id: 'ospf', title: 'Link-State (OSPF & Dijkstra)', summary: 'Sharing the whole map and computing shortest paths.', ready: false },
      { id: 'bgp', title: 'BGP & How the Internet Connects', summary: 'Autonomous systems, peering, and why BGP leaks break the web.', ready: false },
    ],
  },
  {
    id: 'transport',
    num: '05',
    title: 'Transport',
    tone: 'blue',
    lessons: [
      {
        id: 'tcp-handshake',
        title: 'TCP 3-Way Handshake',
        summary: 'SYN, SYN-ACK, ACK — how two strangers agree on sequence numbers before sending a single byte.',
        minutes: 9,
        level: 'Beginner',
        ready: true,
      },
      { id: 'udp-vs-tcp', title: 'UDP vs TCP', summary: 'Fire-and-forget datagrams vs reliable byte streams.', ready: false },
      { id: 'flow-control', title: 'Sliding Window & Flow Control', summary: 'Keeping a fast sender from drowning a slow receiver.', ready: false },
      { id: 'congestion-control', title: 'Congestion Control (Slow Start & AIMD)', summary: 'How TCP probes the network without causing collapse.', ready: false },
      { id: 'retransmission', title: 'Retransmissions, RTO & Fast Recovery', summary: 'Handling dropped, delayed, and out-of-order packets.', ready: false },
    ],
  },
  {
    id: 'application',
    num: '06',
    title: 'Application',
    tone: 'teal',
    lessons: [
      { id: 'dns', title: 'DNS Resolution End-to-End', summary: 'Stub resolver → recursive → root → TLD → authoritative.', ready: false },
      { id: 'dhcp', title: 'DHCP: DORA Lease Flow', summary: 'Discover, Offer, Request, Acknowledge — plugging in and getting an IP.', ready: false },
      { id: 'http-evolution', title: 'HTTP/1.1 → HTTP/2 → HTTP/3 (QUIC)', summary: 'Head-of-line blocking, multiplexing, and moving to UDP.', ready: false },
      { id: 'websockets', title: 'WebSockets & Real-Time Streams', summary: 'Upgrading an HTTP connection to full-duplex messaging.', ready: false },
      { id: 'cdn-anycast', title: 'CDNs & Anycast Routing', summary: 'Serving users from the closest edge server on Earth.', ready: false },
    ],
  },
  {
    id: 'security',
    num: '07',
    title: 'Security',
    tone: 'rose',
    lessons: [
      { id: 'tls-handshake', title: 'TLS 1.3 Handshake', summary: 'Key exchange, forward secrecy, and 1-RTT encryption.', ready: false },
      { id: 'pki-certs', title: 'Certificates & PKI Trust Chains', summary: 'How your browser knows shop.example is really shop.example.', ready: false },
      { id: 'firewalls', title: 'Firewalls & Stateful Inspection', summary: 'Allowing replies while blocking unsolicited probes.', ready: false },
      { id: 'vpn-ddos', title: 'VPNs, WireGuard & DDoS Mitigation', summary: 'Encrypted tunnels and surviving volumetric floods.', ready: false },
    ],
  },
  {
    id: 'wireless',
    num: '08',
    title: 'Wireless & Cloud',
    tone: 'olive',
    lessons: [
      { id: 'cellular-5g', title: 'Cellular Networks (4G/5G) & Handoff', summary: 'Cell towers, packet core, and staying connected while moving.', ready: false },
      { id: 'cloud-vpc', title: 'Cloud VPCs, Subnets & Gateways', summary: 'Virtual networking inside AWS, GCP, and Azure.', ready: false },
    ],
  },
  {
    id: 'realworld',
    num: '09',
    title: 'Real-World',
    tone: 'slate',
    lessons: [
      { id: 'home-network', title: 'Home Network End-to-End', summary: 'Wi-Fi AP, NAT router, ISP fiber, and peering exchange.', ready: false },
      { id: 'spine-leaf', title: 'Data Center Spine-Leaf Fabric', summary: 'ECMP, east-west traffic, and zero-bottleneck racks.', ready: false },
      { id: 'debug-slow', title: 'Case: "Why Is the Site Slow?"', summary: 'Diagnosing DNS, TCP loss, and TLS latency with real traces.', ready: false },
    ],
  },
];

/** Lazy-load each lesson module so the initial bundle stays tiny for lakhs of users */
const LOADERS: Record<string, () => Promise<{ default: Lesson }>> = {
  'ip-address-structure': () => import('./lessons/chapter-01-ip-address'),
  'osi-7-layers': () => import('./lessons/osi-7-layers'),
  'tcp-handshake': () => import('./lessons/tcp-handshake'),
};

const cache = new Map<string, Lesson>();

export async function loadLesson(id: string): Promise<Lesson | null> {
  if (cache.has(id)) return cache.get(id)!;
  const loader = LOADERS[id];
  if (!loader) return null;
  const mod = await loader();
  cache.set(id, mod.default);
  return mod.default;
}

export function totalLessonsCount(): number {
  return SYLLABUS.reduce((acc, m) => acc + m.lessons.length, 0);
}

export function findModuleForLesson(lessonId: string) {
  for (const mod of SYLLABUS) {
    const idx = mod.lessons.findIndex((l) => l.id === lessonId);
    if (idx !== -1) return { mod, index: idx + 1, total: mod.lessons.length };
  }
  return null;
}
