interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

const OSI_QUIZ: QuizQuestion[] = [
  {
    q: 'You click a link in Chrome and it creates "GET /cart HTTP/1.1". Which OSI layer is this?',
    options: ['Layer 4 — Transport', 'Layer 7 — Application', 'Layer 6 — Presentation', 'Layer 3 — Network'],
    answer: 1,
    explain: 'HTTP is an Application Layer (L7) protocol. That is always the first stage when a user sends a web request.',
  },
  {
    q: 'Which OSI layer is the ONLY one that adds both a header at the front and a trailer (FCS) at the end?',
    options: ['Layer 1 — Physical', 'Layer 2 — Data Link', 'Layer 3 — Network', 'Layer 4 — Transport'],
    answer: 1,
    explain: 'Ethernet (Layer 2) adds a 14-byte header (MACs + EtherType) and a 4-byte FCS (CRC-32) trailer to detect bit errors.',
  },
  {
    q: 'A packet passes through a home Router on its way to shop.example. What changes at the router?',
    options: [
      'Both Source IP and Source MAC stay identical',
      'Destination IP changes; MAC addresses stay the same',
      'Layer-2 MAC header is replaced for the next hop; IP TTL decrements by 1',
      'The router decrypts TLS and rewrites HTTP headers',
    ],
    answer: 2,
    explain: 'Routers operate at Layer 3: they strip the old L2 frame, decrement IP TTL, and wrap a new L2 frame for the next link.',
  },
  {
    q: 'What is the PDU (Protocol Data Unit) name at Layer 4 (TCP) and Layer 3 (IP)?',
    options: ['Frame and Bit', 'Segment and Packet', 'Packet and Frame', 'Data and Segment'],
    answer: 1,
    explain: 'L7–L5 = Data, L4 = Segment (TCP) / Datagram (UDP), L3 = Packet, L2 = Frame, L1 = Bits.',
  },
  {
    q: 'A Layer-2 Ethernet switch receives a frame. What does it inspect to decide which port to forward it out of?',
    options: ['Destination IP address', 'Destination TCP port', 'Destination MAC address', 'HTTP Host header'],
    answer: 2,
    explain: 'Switches only climb up to Layer 2 and forward frames using their MAC address table.',
  },
];

export function renderPracticeView(root: HTMLElement) {
  let idx = 0;
  let score = 0;
  let answered = false;

  const paint = () => {
    const done = idx >= OSI_QUIZ.length;
    if (done) {
      root.innerHTML = `
        <div class="subview__inner">
          <div class="card quiz-card" style="max-width:640px;margin:20px auto;text-align:center;">
            <span class="chapter chapter--solution">QUIZ COMPLETE</span>
            <h2 class="subview__title" style="margin-top:12px;">You scored ${score} / ${OSI_QUIZ.length}</h2>
            <p class="subview__sub" style="margin-top:8px;">
              ${score === OSI_QUIZ.length ? 'Flawless! You’ve mastered OSI encapsulation and routing.' : 'Great run — review the OSI 7-Layer lesson and try again for a perfect score.'}
            </p>
            <button id="quiz-retry" class="btn-pop" style="margin-top:18px;padding:10px 22px;">Try Again</button>
          </div>
        </div>`;
      root.querySelector('#quiz-retry')?.addEventListener('click', () => {
        idx = 0;
        score = 0;
        answered = false;
        paint();
      });
      return;
    }

    const item = OSI_QUIZ[idx];
    root.innerHTML = `
      <div class="subview__inner">
        <div class="subview__head">
          <div>
            <h1 class="subview__title">Practice: OSI 7-Layer Check</h1>
            <p class="subview__sub">Test your intuition on encapsulation, switches, routers, and PDUs.</p>
          </div>
          <span class="tag tag--mint">Score: ${score} / ${OSI_QUIZ.length}</span>
        </div>
        <div class="quiz-grid">
          <div class="card quiz-card">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="eyebrow">Question ${idx + 1} of ${OSI_QUIZ.length}</span>
              <span class="chapter chapter--technique">OSI MODEL</span>
            </div>
            <h2 style="font-size:17px;margin-top:12px;line-height:1.4;">${item.q}</h2>
            <div class="quiz-options">
              ${item.options
                .map(
                  (opt, i) => `
                <button class="quiz-opt" data-opt="${i}">
                  <span class="timeline__dot" style="width:24px;height:24px;flex:none;">${String.fromCharCode(65 + i)}</span>
                  <span>${opt}</span>
                </button>`
                )
                .join('')}
            </div>
            <div id="quiz-feedback" style="margin-top:16px;"></div>
          </div>
          <div class="card quiz-card" style="background:var(--paper-2);">
            <span class="eyebrow">Quick Mnemonic</span>
            <p style="margin-top:10px;color:var(--ink-2);font-size:12.5px;line-height:1.6;">
              <b>Top → Bottom (7 → 1):</b><br/>
              <b>A</b>ll <b>P</b>eople <b>S</b>eem <b>T</b>o <b>N</b>eed <b>D</b>ata <b>P</b>rocessing
            </p>
            <p style="margin-top:12px;color:var(--muted);font-size:12px;line-height:1.55;">
              L7 Application · L6 Presentation · L5 Session · L4 Transport · L3 Network · L2 Data Link · L1 Physical
            </p>
          </div>
        </div>
      </div>`;

    root.querySelectorAll<HTMLButtonElement>('.quiz-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (answered) return;
        answered = true;
        const pick = Number(btn.dataset.opt);
        const correct = pick === item.answer;
        if (correct) score++;
        root.querySelectorAll<HTMLButtonElement>('.quiz-opt').forEach((b, i) => {
          b.disabled = true;
          if (i === item.answer) b.classList.add('is-correct');
          else if (i === pick) b.classList.add('is-wrong');
        });
        const fb = root.querySelector('#quiz-feedback')!;
        fb.innerHTML = `
          <div class="callout ${correct ? 'callout--tip' : 'callout--warn'}">
            <div>
              <div class="callout__title">${correct ? 'CORRECT' : 'NOT QUITE'}</div>
              <p>${item.explain}</p>
            </div>
          </div>
          <button id="quiz-next" class="btn-pop" style="margin-top:12px;padding:9px 18px;">
            ${idx + 1 < OSI_QUIZ.length ? 'Next Question →' : 'See Results →'}
          </button>`;
        fb.querySelector('#quiz-next')?.addEventListener('click', () => {
          idx++;
          answered = false;
          paint();
        });
      });
    });
  };

  paint();
}

export function renderNetLabView(root: HTMLElement) {
  let payloadBytes = 180;
  let useTls = true;
  let transport: 'tcp' | 'udp' = 'tcp';
  let ipVer: 'v4' | 'v6' = 'v4';
  let useEth = true;

  const paint = () => {
    const tlsBytes = useTls ? 29 : 0;
    const l4Bytes = transport === 'tcp' ? 20 : 8;
    const l3Bytes = ipVer === 'v4' ? 20 : 40;
    const l2Bytes = useEth ? 18 : 0;
    const overhead = tlsBytes + l4Bytes + l3Bytes + l2Bytes;
    const total = payloadBytes + overhead;
    const pct = ((overhead / total) * 100).toFixed(1);

    root.innerHTML = `
      <div class="subview__inner">
        <div class="subview__head">
          <div>
            <h1 class="subview__title">Net Lab: Live Packet Encapsulation</h1>
            <p class="subview__sub">Toggle protocols and payload size to see how headers wrap around an HTTP request in real time.</p>
          </div>
          <span class="tag tag--violet">Total Frame: ${total} B (${pct}% headers)</span>
        </div>

        <div class="lab-grid">
          <div class="card lab-panel">
            <span class="eyebrow">Configure Stack</span>
            <div style="margin-top:14px;display:grid;gap:14px;">
              <label style="display:grid;gap:5px;font-size:12px;font-weight:700;">
                L7 HTTP Payload: ${payloadBytes} bytes
                <input id="lab-size" type="range" min="40" max="1400" step="20" value="${payloadBytes}" />
              </label>
              <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;cursor:pointer;">
                <input id="lab-tls" type="checkbox" ${useTls ? 'checked' : ''} />
                L6 TLS 1.3 Encryption (+29 B)
              </label>
              <div style="display:grid;gap:6px;font-size:12px;font-weight:700;">
                L4 Transport Protocol
                <div style="display:flex;gap:8px;">
                  <button class="tool ${transport === 'tcp' ? 'is-on' : ''}" data-tr="tcp">TCP (20 B)</button>
                  <button class="tool ${transport === 'udp' ? 'is-on' : ''}" data-tr="udp">UDP (8 B)</button>
                </div>
              </div>
              <div style="display:grid;gap:6px;font-size:12px;font-weight:700;">
                L3 Network Protocol
                <div style="display:flex;gap:8px;">
                  <button class="tool ${ipVer === 'v4' ? 'is-on' : ''}" data-ip="v4">IPv4 (20 B)</button>
                  <button class="tool ${ipVer === 'v6' ? 'is-on' : ''}" data-ip="v6">IPv6 (40 B)</button>
                </div>
              </div>
              <label style="display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;cursor:pointer;">
                <input id="lab-eth" type="checkbox" ${useEth ? 'checked' : ''} />
                L2 Ethernet Frame + FCS (+18 B)
              </label>
            </div>
          </div>

          <div class="card lab-panel">
            <span class="eyebrow">Wire-Level Encapsulated Frame (${total * 8} bits)</span>
            <div class="packet-bar">
              ${useEth ? `<div class="packet-seg" style="background:#cde5bc;"><b>L2 ETH</b><span>14 B · MAC</span></div>` : ''}
              <div class="packet-seg" style="background:#f9e1a3;"><b>L3 IP${ipVer}</b><span>${l3Bytes} B · IP</span></div>
              <div class="packet-seg" style="background:#cfe0f5;"><b>L4 ${transport.toUpperCase()}</b><span>${l4Bytes} B · Port</span></div>
              ${useTls ? `<div class="packet-seg" style="background:#dfd3f4;"><b>L6 TLS</b><span>29 B · Enc</span></div>` : ''}
              <div class="packet-seg" style="background:#fbd3ad;flex:1;"><b>L7 HTTP PAYLOAD</b><span>${payloadBytes} B · GET /cart</span></div>
              ${useEth ? `<div class="packet-seg" style="background:#cde5bc;"><b>FCS</b><span>4 B · CRC</span></div>` : ''}
            </div>

            <div class="lab-stack">
              <div class="lab-layer" style="background:#fbd3ad;"><span><b>L7 Application</b> — HTTP GET /cart</span><span>${payloadBytes} B</span></div>
              <div class="lab-layer ${useTls ? '' : 'is-off'}" style="background:#dfd3f4;"><span><b>L6 Presentation</b> — TLS 1.3 Record + Auth Tag</span><span>+${tlsBytes} B</span></div>
              <div class="lab-layer" style="background:#cfe0f5;"><span><b>L4 Transport</b> — ${transport.toUpperCase()} Header (Ports, ${transport === 'tcp' ? 'Seq/Ack' : 'Length'})</span><span>+${l4Bytes} B</span></div>
              <div class="lab-layer" style="background:#f9e1a3;"><span><b>L3 Network</b> — IP${ipVer} Header (Src/Dst IP, TTL)</span><span>+${l3Bytes} B</span></div>
              <div class="lab-layer ${useEth ? '' : 'is-off'}" style="background:#cde5bc;"><span><b>L2 Data Link</b> — Ethernet Header (14 B) + FCS Trailer (4 B)</span><span>+${l2Bytes} B</span></div>
              <div class="lab-layer" style="background:#dcd8d2;"><span><b>L1 Physical</b> — Raw Bits on Wire (Ethernet MTU: 1,500 B)</span><span>${total * 8} bits</span></div>
            </div>
          </div>
        </div>
      </div>`;

    root.querySelector<HTMLInputElement>('#lab-size')?.addEventListener('input', (e) => {
      payloadBytes = Number((e.target as HTMLInputElement).value);
      paint();
    });
    root.querySelector<HTMLInputElement>('#lab-tls')?.addEventListener('change', (e) => {
      useTls = (e.target as HTMLInputElement).checked;
      paint();
    });
    root.querySelector<HTMLInputElement>('#lab-eth')?.addEventListener('change', (e) => {
      useEth = (e.target as HTMLInputElement).checked;
      paint();
    });
    root.querySelectorAll<HTMLButtonElement>('[data-tr]').forEach((b) =>
      b.addEventListener('click', () => {
        transport = b.dataset.tr as 'tcp' | 'udp';
        paint();
      })
    );
    root.querySelectorAll<HTMLButtonElement>('[data-ip]').forEach((b) =>
      b.addEventListener('click', () => {
        ipVer = b.dataset.ip as 'v4' | 'v6';
        paint();
      })
    );
  };

  paint();
}

export function renderCheatsheetsView(root: HTMLElement) {
  let activeTab: 'ch1' | 'osi' = 'ch1';

  const rows = [
    ['7', 'Application', '#fbd3ad', 'Data', 'HTTP, HTTPS, DNS, SMTP, SSH, DHCP', 'Browser, Web Server, API Gateway', 'Creates user-facing protocol requests (e.g. GET /cart)'],
    ['6', 'Presentation', '#dfd3f4', 'Data', 'TLS 1.3, SSL, UTF-8, gzip, JSON', 'TLS Library, OS Crypto', 'Encryption, compression, character encoding'],
    ['5', 'Session', '#f4c7c3', 'Data', 'Sockets, TLS Resumption, NetBIOS', 'OS / App Runtime', 'Starts, tracks, and resumes ongoing dialogues'],
    ['4', 'Transport', '#cfe0f5', 'Segment / Datagram', 'TCP, UDP, QUIC', 'OS Kernel, L4 Load Balancer', 'Port numbers, reliability, flow & congestion control'],
    ['3', 'Network', '#f9e1a3', 'Packet', 'IPv4, IPv6, ICMP, OSPF, BGP', 'Router, L3 Switch', 'Logical IP addressing & global hop-by-hop routing'],
    ['2', 'Data Link', '#cde5bc', 'Frame', 'Ethernet (802.3), Wi-Fi (802.11), ARP', 'Switch, NIC, Wi-Fi AP', 'Local MAC addressing, framing & CRC error detection'],
    ['1', 'Physical', '#dcd8d2', 'Bits', '1000BASE-T, Fiber, RF Waves', 'Cables, Hubs, Repeaters, Transceivers', 'Raw electrical, optical, or radio signals on the wire'],
  ];

  const renderOsi = () => `
    <div class="subview__head">
      <div>
        <h1 class="subview__title">Cheatsheets: The OSI 7-Layer Reference</h1>
        <p class="subview__sub">Every layer, PDU, key protocol, hardware device, and responsibility at a glance.</p>
      </div>
      <span class="tag tag--sand">7 Layers · Top to Bottom</span>
    </div>
    <table class="osi-table">
      <thead>
        <tr>
          <th>Layer</th>
          <th>PDU</th>
          <th>Key Protocols</th>
          <th>Devices</th>
          <th>What It Does</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map(
            ([num, name, bg, pdu, protos, devs, desc]) => `
          <tr>
            <td><span class="layer-pill" style="background:${bg};">L${num} ${name}</span></td>
            <td><b>${pdu}</b></td>
            <td><code>${protos}</code></td>
            <td>${devs}</td>
            <td>${desc}</td>
          </tr>`
          )
          .join('')}
      </tbody>
    </table>
  `;

  const renderChapter1 = () => `
    <div class="subview__head">
      <div>
        <h1 class="subview__title">Chapter 1 Visual Mindmap: IP Address Structure & Octets</h1>
        <p class="subview__sub">Comprehensive visual cheatsheet breaking down dotted quad notation, 32-bit math, localhost, and octet binary conversions.</p>
      </div>
      <div style="display:flex;gap:6px;">
        <span class="tag tag--mint">IPv4 Fundamentals</span>
        <span class="tag tag--violet">32 Bits / 4 Bytes</span>
      </div>
    </div>

    <div class="cs-mindmap">
      <!-- Central Topic Badge -->
      <div class="cs-center-badge">
        <span class="cs-chapter-pill">Chapter 1</span>
        <h2 class="cs-center-title">Understanding IP Address Structure and Octets</h2>
      </div>

      <!-- Main Visual Mindmap Grid -->
      <div class="cs-grid">
        <!-- 1. Introduction to IP Address Structure -->
        <div class="cs-card cs-card--blue">
          <div class="cs-card__head">
            <span class="cs-num-badge">1</span>
            <h3>Introduction to IP Address Structure</h3>
          </div>
          <div class="cs-card__body">
            <ul class="cs-bullets">
              <li>This visual reference covers the foundational basics of IP Address Structure.</li>
              <li>
                <b>Key questions answered:</b>
                <div class="cs-sublist">
                  <span class="cs-q-pill"><span class="cs-mini-badge">1</span> What is an IP Address?</span>
                  <span class="cs-q-pill"><span class="cs-mini-badge">2</span> What is an Octet?</span>
                  <span class="cs-q-pill"><span class="cs-mini-badge">3</span> What is Dotted Quad Notation?</span>
                  <span class="cs-q-pill"><span class="cs-mini-badge">4</span> How do we represent an IP in Binary?</span>
                  <span class="cs-q-pill"><span class="cs-mini-badge">5</span> Why is an IPv4 Address exactly 32 bits long?</span>
                </div>
              </li>
              <li>Beginner-friendly and short visual guide.</li>
              <li>
                <b>Topics explored in upcoming lessons:</b>
                <div class="cs-pills-row" style="margin-top:6px;">
                  <span class="cs-pill cs-pill--blue">Subnet Masks</span>
                  <span class="cs-pill cs-pill--blue">Default Gateways</span>
                  <span class="cs-pill cs-pill--blue">MAC Addresses</span>
                  <span class="cs-pill cs-pill--blue">IP Routing</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <!-- 2. Understanding Internet Protocol and IP Addresses -->
        <div class="cs-card cs-card--green">
          <div class="cs-card__head">
            <span class="cs-num-badge">2</span>
            <h3>Understanding Internet Protocol & IP Addresses</h3>
          </div>
          <div class="cs-card__body">
            <div class="cs-subbox cs-subbox--green">
              <h4 class="cs-subbox__title">What is IP?</h4>
              <ul class="cs-bullets">
                <li><b>IP</b> stands for <b>Internet Protocol</b>.</li>
                <li>It is the fundamental protocol used for communication across computer networks and the global Internet.</li>
              </ul>
              <!-- Visual Mini Network Topology -->
              <div class="cs-topology-graphic">
                <svg viewBox="0 0 280 90" width="100%" height="90" style="display:block;">
                  <!-- Internet Globe in center -->
                  <circle cx="140" cy="45" r="24" fill="#d6e5f6" stroke="var(--ink)" stroke-width="1.8"/>
                  <ellipse cx="140" cy="45" rx="24" ry="10" fill="none" stroke="var(--ink)" stroke-width="1.3" opacity="0.6"/>
                  <ellipse cx="140" cy="45" rx="10" ry="24" fill="none" stroke="var(--ink)" stroke-width="1.3" opacity="0.6"/>
                  <line x1="140" y1="21" x2="140" y2="69" stroke="var(--ink)" stroke-width="1.3" opacity="0.6"/>
                  <text x="140" y="48" font-size="8.5" font-weight="800" text-anchor="middle" fill="var(--ink)">INTERNET</text>

                  <!-- Left Laptop -->
                  <rect x="18" y="28" width="36" height="24" rx="3" fill="#fdfaf6" stroke="var(--ink)" stroke-width="1.8"/>
                  <line x1="12" y1="52" x2="60" y2="52" stroke="var(--ink)" stroke-width="2.5" stroke-linecap="round"/>
                  <text x="36" y="66" font-size="8" font-weight="700" text-anchor="middle" fill="var(--muted)">Laptop</text>

                  <!-- Right Top Server -->
                  <rect x="226" y="12" width="38" height="22" rx="3" fill="#fdfaf6" stroke="var(--ink)" stroke-width="1.8"/>
                  <line x1="230" y1="19" x2="260" y2="19" stroke="var(--ink)" stroke-width="1" opacity="0.4"/>
                  <circle cx="258" cy="27" r="1.8" fill="#2a7a3d"/>
                  <text x="245" y="42" font-size="8" font-weight="700" text-anchor="middle" fill="var(--muted)">Server</text>

                  <!-- Right Bottom Phone -->
                  <rect x="234" y="52" width="22" height="32" rx="4" fill="#fdfaf6" stroke="var(--ink)" stroke-width="1.8"/>
                  <circle cx="245" cy="78" r="2" fill="var(--ink)"/>
                  <text x="245" y="94" font-size="7.5" font-weight="700" text-anchor="middle" fill="var(--muted)">Mobile</text>

                  <!-- Connecting Curved Lines -->
                  <path d="M58 40 C 90 40, 105 45, 116 45" fill="none" stroke="#2a7a3d" stroke-width="2" marker-end="url(#cs-arrow)"/>
                  <path d="M164 40 C 185 35, 205 25, 224 25" fill="none" stroke="#2a7a3d" stroke-width="2"/>
                  <path d="M164 50 C 185 60, 205 68, 232 68" fill="none" stroke="#2a7a3d" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <div class="cs-subbox cs-subbox--mint" style="margin-top:10px;">
              <h4 class="cs-subbox__title">What is Localhost?</h4>
              <ul class="cs-bullets">
                <li>Used to access your own computer.</li>
                <li>Common IPv4 address: <span class="cs-pill cs-pill--loopback">127.0.0.1</span></li>
                <li>Also called the <b>Loopback Address</b>.</li>
                <li>Requests to this address are routed back to your own machine.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 3. Understanding Dotted Quad Notation -->
        <div class="cs-card cs-card--amber">
          <div class="cs-card__head">
            <span class="cs-num-badge">3</span>
            <h3>Understanding Dotted Quad Notation</h3>
          </div>
          <div class="cs-card__body">
            <div class="cs-subbox cs-subbox--amber">
              <h4 class="cs-subbox__title">What is Dotted Quad Notation?</h4>
              <ul class="cs-bullets">
                <li>IPv4 addresses are written in the form <code><b>a.b.c.d</b></code></li>
                <li>Each part (a, b, c, d) is a numerical value separated by dots.</li>
                <li>This is called <b>Dotted Quad Notation</b>.</li>
              </ul>
            </div>

            <div class="cs-example-box" style="margin-top:10px;">
              <div class="cs-example-label">Example</div>
              <div class="cs-example-ip">192.168.14.1</div>

              <!-- 4 Colored Octet Badges -->
              <div class="cs-octets-grid">
                <div class="cs-octet-col cs-octet--blue">
                  <div class="cs-octet-val">192</div>
                  <div class="cs-octet-sub">First Octet</div>
                </div>
                <div class="cs-octet-col cs-octet--green">
                  <div class="cs-octet-val">168</div>
                  <div class="cs-octet-sub">Second Octet</div>
                </div>
                <div class="cs-octet-col cs-octet--orange">
                  <div class="cs-octet-val">14</div>
                  <div class="cs-octet-sub">Third Octet</div>
                </div>
                <div class="cs-octet-col cs-octet--purple">
                  <div class="cs-octet-val">1</div>
                  <div class="cs-octet-sub">Fourth Octet</div>
                </div>
              </div>
            </div>

            <div class="cs-subbox cs-subbox--key" style="margin-top:10px;">
              <h4 class="cs-subbox__title">Key Points</h4>
              <ul class="cs-bullets">
                <li>Each part is called an <b>Octet</b>.</li>
                <li>Each octet can have a value from <b>0 to 255</b>.</li>
                <li>We will understand why this range exists in the binary section.</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 4. Binary Representation of an IPv4 Address -->
        <div class="cs-card cs-card--violet">
          <div class="cs-card__head">
            <span class="cs-num-badge">4</span>
            <h3>Binary Representation of an IPv4 Address</h3>
          </div>
          <div class="cs-card__body">
            <div class="cs-example-box">
              <div class="cs-example-label">Example: 192.168.14.1</div>
              <p style="font-size:11.5px;color:var(--ink-2);margin:6px 0;">In binary, the same IP address is represented as:</p>
              <div class="cs-binary-pills">
                <span class="cs-bin-chip cs-bin--blue">11000000</span>
                <span class="cs-bin-dot">.</span>
                <span class="cs-bin-chip cs-bin--green">10101000</span>
                <span class="cs-bin-dot">.</span>
                <span class="cs-bin-chip cs-bin--orange">00001110</span>
                <span class="cs-bin-dot">.</span>
                <span class="cs-bin-chip cs-bin--purple">00000001</span>
              </div>
            </div>

            <!-- Breakdown Table -->
            <div style="margin-top:12px;">
              <div class="cs-subbox__title" style="margin-bottom:6px;">Breakdown of Each Octet</div>
              <table class="cs-table">
                <thead>
                  <tr>
                    <th>Octet</th>
                    <th>Decimal Value</th>
                    <th>Binary Representation</th>
                    <th>Bits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>1st</b></td>
                    <td>192</td>
                    <td><code>11000000</code></td>
                    <td>8 bits</td>
                  </tr>
                  <tr>
                    <td><b>2nd</b></td>
                    <td>168</td>
                    <td><code>10101000</code></td>
                    <td>8 bits</td>
                  </tr>
                  <tr>
                    <td><b>3rd</b></td>
                    <td>14</td>
                    <td><code>00001110</code></td>
                    <td>8 bits</td>
                  </tr>
                  <tr>
                    <td><b>4th</b></td>
                    <td>1</td>
                    <td><code>00000001</code></td>
                    <td>8 bits</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="cs-tip-callout" style="margin-top:10px;">
              <span class="cs-tip-icon">💡</span>
              <span>Each octet is represented using exactly <b>8 bits</b>.</span>
            </div>
          </div>
        </div>

        <!-- 5. Why Is IPv4 Exactly 32 Bits or 4 Bytes Long? -->
        <div class="cs-card cs-card--rose">
          <div class="cs-card__head">
            <span class="cs-num-badge">5</span>
            <h3>Why Is IPv4 Exactly 32 Bits or 4 Bytes Long?</h3>
          </div>
          <div class="cs-card__body">
            <div class="cs-split-row">
              <div class="cs-subbox" style="flex:1;">
                <h4 class="cs-subbox__title">Step-by-Step Explanation</h4>
                <div class="cs-steps-list">
                  <div class="cs-step-item"><span class="cs-mini-badge cs-mini--rose">1</span> An IPv4 address has 4 octets.</div>
                  <div class="cs-step-item"><span class="cs-mini-badge cs-mini--rose">2</span> Each octet consists of 8 bits.</div>
                  <div class="cs-step-item"><span class="cs-mini-badge cs-mini--rose">3</span> Total bits = 4 × 8 = <b>32 bits</b>.</div>
                  <div class="cs-step-item"><span class="cs-mini-badge cs-mini--rose">4</span> 8 bits = 1 byte.</div>
                  <div class="cs-step-item"><span class="cs-mini-badge cs-mini--rose">5</span> Therefore, 32 bits = <b>4 bytes</b>.</div>
                </div>
              </div>

              <div class="cs-formulas-col" style="flex:0.85;">
                <div class="cs-subbox__title">Key Formulas</div>
                <div class="cs-formula-pill cs-formula--blue">1 Octet = 8 bits</div>
                <div class="cs-formula-pill cs-formula--green">4 Octets = 4 × 8 = 32 bits</div>
                <div class="cs-formula-pill cs-formula--orange">32 bits = 4 bytes</div>
              </div>
            </div>

            <div class="cs-subbox cs-subbox--info" style="margin-top:10px;">
              <div style="display:flex;gap:8px;align-items:flex-start;">
                <span class="cs-info-icon">ℹ️</span>
                <div>
                  <h4 class="cs-subbox__title" style="margin:0;">Important Note</h4>
                  <p style="font-size:11.5px;color:var(--ink-2);margin:3px 0 0;line-height:1.45;">
                    This 32-bit structure applies only to <b>IPv4</b>. IPv6 uses <b>128 bits</b> to represent an address, which we will explore in a separate lesson.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 6. Final Summary -->
        <div class="cs-card cs-card--teal">
          <div class="cs-card__head">
            <span class="cs-num-badge">6</span>
            <h3>Final Summary</h3>
          </div>
          <div class="cs-card__body">
            <div class="cs-summary-list">
              <div class="cs-summary-item">
                <span class="cs-mini-badge cs-mini--teal">1</span>
                <div><b>IP:</b> Stands for Internet Protocol.</div>
              </div>
              <div class="cs-summary-item">
                <span class="cs-mini-badge cs-mini--teal">2</span>
                <div><b>Localhost:</b> <code>127.0.0.1</code> is the commonly used IPv4 loopback address.</div>
              </div>
              <div class="cs-summary-item">
                <span class="cs-mini-badge cs-mini--teal">3</span>
                <div><b>Dotted Quad Notation:</b> IPv4 addresses are represented using four numerical values separated by dots (<code>a.b.c.d</code>).</div>
              </div>
              <div class="cs-summary-item">
                <span class="cs-mini-badge cs-mini--teal">4</span>
                <div><b>Octet:</b> Each individual part of an IPv4 address is called an Octet.</div>
              </div>
              <div class="cs-summary-item">
                <span class="cs-mini-badge cs-mini--teal">5</span>
                <div><b>Binary Representation:</b> Each octet is represented using 8 bits.</div>
              </div>
              <div class="cs-summary-item">
                <span class="cs-mini-badge cs-mini--teal">6</span>
                <div><b>IPv4 Length:</b> Four octets multiplied by 8 bits gives us 32 bits.</div>
              </div>
              <div class="cs-summary-item">
                <span class="cs-mini-badge cs-mini--teal">7</span>
                <div><b>Total Size:</b> An IPv4 address is 32 bits or 4 bytes long.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Explore Banner -->
      <div class="cs-next-banner">
        <div class="cs-next-left">
          <span class="cs-target-emoji">🎯</span>
          <span><b>In upcoming lessons, we will learn about:</b></span>
        </div>
        <div class="cs-pills-row">
          <span class="cs-pill cs-pill--explore">Subnet Masks</span>
          <span class="cs-pill cs-pill--explore">Default Gateways</span>
          <span class="cs-pill cs-pill--explore">MAC Addresses</span>
          <span class="cs-pill cs-pill--explore">IP Routing</span>
        </div>
      </div>
    </div>
  `;

  const paint = () => {
    root.innerHTML = `
      <div class="subview__inner">
        <div class="cs-switcher-bar">
          <span class="eyebrow" style="margin-right:8px;">CHEATSHEETS</span>
          <div class="cs-switcher">
            <button class="cs-tab-btn ${activeTab === 'ch1' ? 'is-active' : ''}" data-sheet="ch1">
              Chapter 1: IP Address Structure & Octets
            </button>
            <button class="cs-tab-btn ${activeTab === 'osi' ? 'is-active' : ''}" data-sheet="osi">
              The OSI 7-Layer Reference
            </button>
          </div>
        </div>
        <div id="cs-content" style="margin-top:14px;">
          ${activeTab === 'ch1' ? renderChapter1() : renderOsi()}
        </div>
      </div>
    `;

    root.querySelectorAll<HTMLButtonElement>('.cs-tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeTab = btn.dataset.sheet as 'ch1' | 'osi';
        paint();
      });
    });
  };

  paint();
}

