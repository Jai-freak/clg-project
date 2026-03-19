        'use strict';

        /* ═══════════════════════════════════════
           STATE / BACKEND SIMULATION
        ═══════════════════════════════════════ */
        const State = {
            currentUser: null,
            currentView: 'dashboard',
            settings: {
                theme: 'cyan',
                animations: true,
                orgName: 'ACME Cyber Defense',
                defaultTLP: 'TLP:GREEN',
                refreshInterval: 15,
                notifications: {
                    critical: true,
                    cve: true,
                    feedFailure: true,
                    actor: false,
                    dailyDigest: true,
                    weekly: false
                }
            },
            users: [{
                id: 1,
                name: 'Admin User',
                username: 'admin',
                email: 'admin@threatpulse.io',
                password: 'admin123',
                role: 'Admin',
                tlp: 'TLP:AMBER',
                since: 'Jan 15, 2024',
                active: true,
                reports: 47,
                iocs: 1204,
                feeds: 8,
                days: 142
            }, {
                id: 2,
                name: 'Sarah Chen',
                username: 'analyst',
                email: 's.chen@threatpulse.io',
                password: 'analyst123',
                role: 'Analyst',
                tlp: 'TLP:GREEN',
                since: 'Mar 3, 2024',
                active: true,
                reports: 23,
                iocs: 567,
                feeds: 4,
                days: 89
            }, {
                id: 3,
                name: 'Marcus Webb',
                username: 'viewer',
                email: 'm.webb@threatpulse.io',
                password: 'viewer123',
                role: 'Viewer',
                tlp: 'TLP:WHITE',
                since: 'Jun 10, 2024',
                active: true,
                reports: 0,
                iocs: 0,
                feeds: 0,
                days: 31
            }, {
                id: 4,
                name: 'Priya Nair',
                username: 'p.nair',
                email: 'p.nair@threatpulse.io',
                password: 'pass1234',
                role: 'Analyst',
                tlp: 'TLP:AMBER',
                since: 'Feb 20, 2024',
                active: false,
                reports: 12,
                iocs: 234,
                feeds: 2,
                days: 60
            }, {
                id: 5,
                name: 'James Okoro',
                username: 'j.okoro',
                email: 'j.okoro@threatpulse.io',
                password: 'pass1234',
                role: 'Analyst',
                tlp: 'TLP:GREEN',
                since: 'Apr 5, 2024',
                active: true,
                reports: 18,
                iocs: 445,
                feeds: 3,
                days: 75
            }, {
                id: 6,
                name: 'Elena Vasquez',
                username: 'e.vasquez',
                email: 'e.vasquez@threatpulse.io',
                password: 'pass1234',
                role: 'Admin',
                tlp: 'TLP:RED',
                since: 'Dec 1, 2023',
                active: true,
                reports: 61,
                iocs: 2341,
                feeds: 12,
                days: 200
            }],
            threats: [],
            iocs: [],
            feeds: [],
            alerts: [],
            actors: [],
            apiKeys: [],
            nextUserId: 7
        };

        /* ═══════════════════════════════════════
           SEED DATA
        ═══════════════════════════════════════ */
        function seedData() {
            State.threats = [{
                indicator: '185.220.101.47',
                type: 'IP',
                severity: 'Critical',
                source: 'Abuse.ch',
                time: '2m ago',
                tags: ['tor', 'c2']
            }, {
                indicator: 'a4b23f91c8d72...',
                type: 'Hash',
                severity: 'Critical',
                source: 'VirusTotal',
                time: '7m ago',
                tags: ['ransomware', 'lockbit']
            }, {
                indicator: 'login-secure.ru',
                type: 'Domain',
                severity: 'High',
                source: 'OpenPhish',
                time: '12m ago',
                tags: ['phishing']
            }, {
                indicator: '45.142.212.100',
                type: 'IP',
                severity: 'High',
                source: 'Shodan',
                time: '18m ago',
                tags: ['botnet']
            }, {
                indicator: 'CVE-2024-12356',
                type: 'CVE',
                severity: 'Critical',
                source: 'NVD',
                time: '25m ago',
                tags: ['rce', 'citrix']
            }, {
                indicator: 'update-flash.net',
                type: 'Domain',
                severity: 'Medium',
                source: 'URLhaus',
                time: '31m ago',
                tags: ['malware-drop']
            }, {
                indicator: '192.168.0.0/24',
                type: 'CIDR',
                severity: 'Low',
                source: 'Internal',
                time: '45m ago',
                tags: ['internal']
            }, {
                indicator: 'invoice_2024.exe',
                type: 'Filename',
                severity: 'High',
                source: 'Hybrid Analysis',
                time: '52m ago',
                tags: ['dropper']
            }];

            const iocTypes = ['IP', 'Domain', 'Hash', 'URL', 'Email'];
            const sevs = ['Critical', 'High', 'High', 'Medium', 'Medium', 'Low'];
            const srcs = ['Abuse.ch', 'VirusTotal', 'Shodan', 'OpenPhish', 'URLhaus', 'OTX', 'MISP', 'ThreatFox'];
            const sampleVals = [
                '185.220.101.47', 'a4b23f91c8d72e...', 'phish-login.net', 'http://mal.ru/drop', 'admin@evil.com',
                '91.108.56.120', 'invoice2024.pdf.exe', 'update-driver.info', 'b3c7f92a1d4e5...', 'cdn-update.xyz',
                '37.120.238.98', 'secure-bank.pw', 'http://dl.bad/payload', 'support@scam.io', 'dd14a9a...bd72',
                '194.165.16.78', 'vpn-login.net', 'doc_scan.zip', 'noreply@phish.co', '5.182.207.45'
            ];

            for (let i = 0; i < 50; i++) {
                State.iocs.push({
                    value: sampleVals[i % sampleVals.length] + (i > sampleVals.length ? i : ''),
                    type: iocTypes[i % iocTypes.length],
                    severity: sevs[i % sevs.length],
                    confidence: Math.floor(Math.random() * 40) + 60,
                    firstSeen: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2,'0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2,'0')}`,
                    lastSeen: `2025-03-0${Math.floor(Math.random() * 6) + 1}`,
                    source: srcs[i % srcs.length],
                    tags: ['malware', 'phishing', 'c2', 'botnet', 'ransomware'].slice(0, Math.floor(Math.random() * 2) + 1)
                });
            }

            State.feeds = [{
                id: 1,
                name: 'Abuse.ch Feodo Tracker',
                type: 'JSON',
                status: 'online',
                iocs: 4821,
                lastUpdate: '2m ago',
                source: 'abuse.ch'
            }, {
                id: 2,
                name: 'AlienVault OTX',
                type: 'API',
                status: 'online',
                iocs: 23441,
                lastUpdate: '5m ago',
                source: 'otx.alienvault.com'
            }, {
                id: 3,
                name: 'URLhaus',
                type: 'CSV',
                status: 'online',
                iocs: 8932,
                lastUpdate: '8m ago',
                source: 'urlhaus.abuse.ch'
            }, {
                id: 4,
                name: 'OpenPhish',
                type: 'CSV',
                status: 'online',
                iocs: 1204,
                lastUpdate: '15m ago',
                source: 'openphish.com'
            }, {
                id: 5,
                name: 'Shodan InternetDB',
                type: 'API',
                status: 'degraded',
                iocs: 3422,
                lastUpdate: '1h ago',
                source: 'internetdb.shodan.io'
            }, {
                id: 6,
                name: 'VirusTotal Intel',
                type: 'API',
                status: 'online',
                iocs: 15002,
                lastUpdate: '3m ago',
                source: 'virustotal.com'
            }, {
                id: 7,
                name: 'ThreatFox',
                type: 'STIX',
                status: 'online',
                iocs: 5641,
                lastUpdate: '11m ago',
                source: 'threatfox.abuse.ch'
            }, {
                id: 8,
                name: 'Hybrid Analysis',
                type: 'API',
                status: 'online',
                iocs: 2341,
                lastUpdate: '7m ago',
                source: 'hybrid-analysis.com'
            }, {
                id: 9,
                name: 'Cisco Talos',
                type: 'STIX',
                status: 'offline',
                iocs: 0,
                lastUpdate: '3h ago',
                source: 'talosintelligence.com'
            }, {
                id: 10,
                name: 'CISA KEV',
                type: 'JSON',
                status: 'online',
                iocs: 1042,
                lastUpdate: '1d ago',
                source: 'cisa.gov'
            }, {
                id: 11,
                name: 'MITRE ATT&CK',
                type: 'STIX',
                status: 'online',
                iocs: 8200,
                lastUpdate: '2d ago',
                source: 'attack.mitre.org'
            }, {
                id: 12,
                name: 'EmergingThreats',
                type: 'CSV',
                status: 'online',
                iocs: 12500,
                lastUpdate: '6m ago',
                source: 'rules.emergingthreats.net'
            }];

            State.alerts = [{
                id: 1,
                icon: '🔴',
                title: 'CRITICAL: New Ransomware Campaign Detected',
                body: 'LockBit 4.0 variant identified in 3 IOC feeds. 47 matching hashes flagged. Immediate review recommended.',
                time: '2 minutes ago',
                unread: true,
                severity: 'critical'
            }, {
                id: 2,
                icon: '🟠',
                title: 'HIGH: Phishing Campaign Targeting Finance',
                body: 'OpenPhish reports new phishing infrastructure. 12 domains mimicking banking portals added to blocklist.',
                time: '18 minutes ago',
                unread: true,
                severity: 'high'
            }, {
                id: 3,
                icon: '💥',
                title: 'CVE-2024-12356 — CVSS 9.8 (Citrix Bleed 2)',
                body: 'Critical RCE vulnerability in Citrix NetScaler. Active exploitation observed in the wild. Patch immediately.',
                time: '45 minutes ago',
                unread: true,
                severity: 'critical'
            }, {
                id: 4,
                icon: '📡',
                title: 'Feed Alert: Cisco Talos Connection Lost',
                body: 'Cisco Talos STIX feed has been offline for 3+ hours. Last successful sync: 3h ago. Check connectivity.',
                time: '3 hours ago',
                unread: true,
                severity: 'warning'
            }, {
                id: 5,
                icon: '👤',
                title: 'Threat Actor Activity: APT29 (Cozy Bear)',
                body: 'New C2 infrastructure attributed to APT29 identified. 8 new IPs added to block list from European IP space.',
                time: '5 hours ago',
                unread: true,
                severity: 'high'
            }, {
                id: 6,
                icon: '✅',
                title: 'Weekly Report Generated Successfully',
                body: 'Your weekly threat intelligence report for 24 Feb – 02 Mar 2025 is ready for review.',
                time: '1 day ago',
                unread: false,
                severity: 'info'
            }, {
                id: 7,
                icon: '🔵',
                title: 'Feed Sync Completed: All 23 Active Feeds',
                body: 'Scheduled sync completed. 342 new IOCs ingested across all active threat intelligence sources.',
                time: '2 days ago',
                unread: false,
                severity: 'info'
            }];

            State.actors = [{
                name: 'APT29 (Cozy Bear)',
                origin: 'Russia',
                targets: 'Government, Defense',
                activity: 'High',
                ttps: ['Spearphishing', 'C2 Infrastructure', 'Living off the Land'],
                iocs: 284,
                color: 'var(--accent-red)'
            }, {
                name: 'APT41 (Winnti)',
                origin: 'China',
                targets: 'Tech, Healthcare',
                activity: 'High',
                ttps: ['Supply Chain', 'Ransomware', 'Espionage'],
                iocs: 412,
                color: 'var(--accent-orange)'
            }, {
                name: 'Lazarus Group',
                origin: 'North Korea',
                targets: 'Finance, Crypto',
                activity: 'Very High',
                ttps: ['Financial Theft', 'Backdoors', 'SWIFT Attacks'],
                iocs: 678,
                color: 'var(--accent-yellow)'
            }, {
                name: 'Sandworm',
                origin: 'Russia',
                targets: 'Critical Infrastructure',
                activity: 'Medium',
                ttps: ['ICS/SCADA', 'Wipers', 'Grid Attacks'],
                iocs: 193,
                color: 'var(--accent-cyan)'
            }, {
                name: 'FIN7',
                origin: 'Eastern Europe',
                targets: 'Retail, Hospitality',
                activity: 'Medium',
                ttps: ['POS Malware', 'Spearphishing', 'SQL Injection'],
                iocs: 341,
                color: 'var(--accent-purple)'
            }, {
                name: 'REvil / Sodinokibi',
                origin: 'Russia',
                targets: 'All Sectors',
                activity: 'Low',
                ttps: ['Ransomware-as-a-Service', 'Double Extortion'],
                iocs: 89,
                color: 'var(--accent-green)'
            }];

            State.apiKeys = [{
                id: 'key_01',
                name: 'Production Integration',
                key: 'tp_live_••••••••••••••••••••••••',
                created: '2024-01-15',
                lastUsed: '2m ago'
            }, {
                id: 'key_02',
                name: 'SIEM Connector',
                key: 'tp_live_••••••••••••••••••••••••',
                created: '2024-03-01',
                lastUsed: '1h ago'
            }];
        }

        /* ═══════════════════════════════════════
           AUTH FUNCTIONS
        ═══════════════════════════════════════ */
        function handleLogin() {
            const u = document.getElementById('login-username').value.trim();
            const p = document.getElementById('login-password').value;
            const err = document.getElementById('login-error');

            const user = State.users.find(x => (x.username === u || x.email === u) && x.password === p);
            if (!user) {
                err.classList.add('show');
                return;
            }
            err.classList.remove('show');
            State.currentUser = user;
            initApp();
            showPage('app-page');
        }

        function handleRegister() {
            const name = document.getElementById('reg-name').value.trim();
            const email = document.getElementById('reg-email').value.trim();
            const username = document.getElementById('reg-username').value.trim();
            const password = document.getElementById('reg-password').value;
            const role = document.getElementById('reg-role').value;

            if (!name || !email || !username || !password) {
                showToast('All fields are required.', 'error');
                return;
            }
            if (State.users.find(u => u.username === username)) {
                showToast('Username already exists.', 'error');
                return;
            }

            const newUser = {
                id: State.nextUserId++,
                name,
                username,
                email,
                password,
                role,
                tlp: 'TLP:GREEN',
                since: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                active: true,
                reports: 0,
                iocs: 0,
                feeds: 0,
                days: 0
            };
            State.users.push(newUser);
            showToast(`Account created for ${name}. You can now log in.`, 'success');
            showPage('login-page');
        }

        function handleLogout() {
            State.currentUser = null;
            showPage('login-page');
            showToast('Session terminated.', 'info');
        }

        /* ═══════════════════════════════════════
           PAGE NAVIGATION
        ═══════════════════════════════════════ */
        function showPage(id) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }

        function initApp() {
            seedData();
            const u = State.currentUser;
            document.getElementById('sidebar-avatar').textContent = u.name[0].toUpperCase();
            document.getElementById('sidebar-username').textContent = u.name;
            document.getElementById('sidebar-role').textContent = u.role.toUpperCase();

            // Show admin nav only for admins
            document.getElementById('admin-nav').style.display = u.role === 'Admin' ? 'block' : 'none';

            updateProfileView();
            renderDashboard();
            startClock();
        }

        function switchView(view) {
            State.currentView = view;
            document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
            document.getElementById('view-' + view).classList.add('active');

            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            event && event.currentTarget && event.currentTarget.classList.add('active');

            const titles = {
                dashboard: 'Dashboard',
                feeds: 'Threat Feeds',
                iocs: 'IOC Explorer',
                alerts: 'Security Alerts',
                reports: 'Reports',
                actors: 'Threat Actors',
                hunt: 'Threat Hunt',
                users: 'User Management',
                profile: 'My Profile',
                settings: 'Settings'
            };
            document.getElementById('topbar-title').textContent = titles[view] || view;

            // Lazy render views
            if (view === 'feeds') renderFeeds();
            if (view === 'iocs') renderIOCs();
            if (view === 'alerts') renderAlerts();
            if (view === 'reports') renderReports();
            if (view === 'actors') renderActors();
            if (view === 'users') renderUsers();
            if (view === 'profile') updateProfileView();
        }

        /* ═══════════════════════════════════════
           CLOCK
        ═══════════════════════════════════════ */
        function startClock() {
            const tick = () => {
                const now = new Date();
                document.getElementById('topbar-clock').textContent =
                    now.toUTCString().slice(17, 25) + ' UTC';
            };
            tick();
            setInterval(tick, 1000);
        }

        /* ═══════════════════════════════════════
           DASHBOARD RENDER
        ═══════════════════════════════════════ */
        function renderDashboard() {
            renderThreatTable();
            renderFeedStatus();
            renderChart();
            renderActivityLog();
            renderMalwareList();
            renderCVEList();
            renderActorSummary();
            renderGeoDots();
        }

        function renderThreatTable() {
            const sevBadge = s => `<span class="badge badge-${s.toLowerCase()}">${s}</span>`;
            const body = State.threats.map(t => `
    <tr>
      <td class="text-cyan">${t.indicator}</td>
      <td><span class="tag">${t.type}</span></td>
      <td>${sevBadge(t.severity)}</td>
      <td class="text-muted">${t.source}</td>
      <td class="text-muted">${t.time}</td>
    </tr>
  `).join('');
            document.getElementById('threat-table-body').innerHTML = body;
        }

        function renderFeedStatus() {
            const list = State.feeds.slice(0, 8).map(f => `
    <div class="feed-item">
      <div class="feed-status-dot ${f.status}"></div>
      <div class="feed-name">${f.name}</div>
      <div class="feed-count">${f.iocs.toLocaleString()}</div>
      <div class="feed-updated">${f.lastUpdate}</div>
    </div>
  `).join('');
            document.getElementById('feed-status-list').innerHTML = list;
        }

        function renderChart() {
            const bars = Array.from({
                length: 24
            }, (_, i) => {
                const h = Math.floor(Math.random() * 85) + 10;
                const isHigh = h > 70;
                return `<div class="chart-bar ${isHigh ? 'red-bar' : ''}" style="height:${h}%" title="Hour ${i}:00 — ${Math.floor(h * 3)} threats"></div>`;
            });
            document.getElementById('threat-chart').innerHTML = bars.join('');
        }

        function renderActivityLog() {
            const logs = [{
                time: '09:47',
                text: 'Feed <strong>Abuse.ch</strong> synced — <span class="highlight">+234 IOCs</span>'
            }, {
                time: '09:31',
                text: '<strong>CVE-2024-12356</strong> flagged as <span class="text-red">Critical</span>'
            }, {
                time: '09:15',
                text: 'User <strong>s.chen</strong> added <span class="highlight">47 IP addresses</span>'
            }, {
                time: '08:52',
                text: 'Alert rule triggered: <span class="text-orange">Tor Exit Node Activity</span>'
            }, {
                time: '08:34',
                text: 'Auto-generated <strong>Daily Report</strong> completed'
            }, {
                time: '08:00',
                text: 'Scheduled sync: <span class="highlight">all 23 feeds</span> processed'
            }];
            document.getElementById('activity-log').innerHTML = logs.map(l =>
                `<div class="activity-line"><span class="activity-time">${l.time}</span><span class="activity-text">${l.text}</span></div>`
            ).join('');
        }

        function renderMalwareList() {
            const malware = [{
                name: 'LockBit 4.0',
                count: 847,
                pct: 90
            }, {
                name: 'Emotet',
                count: 612,
                pct: 65
            }, {
                name: 'QakBot',
                count: 441,
                pct: 47
            }, {
                name: 'Cobalt Strike',
                count: 398,
                pct: 42
            }, {
                name: 'BlackCat/ALPHV',
                count: 287,
                pct: 30
            }];
            document.getElementById('malware-list').innerHTML = malware.map(m => `
    <div style="padding:10px 16px;border-bottom:1px solid var(--border);">
      <div class="flex-between mb-4">
        <span style="font-size:11px;color:var(--text-primary);">${m.name}</span>
        <span style="font-size:10px;color:var(--text-muted);">${m.count} IOCs</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${m.pct}%;background:var(--accent-red);"></div></div>
    </div>
  `).join('');
        }

        function renderCVEList() {
            const cves = [{
                id: 'CVE-2024-12356',
                cvss: '9.8',
                desc: 'Citrix NetScaler RCE',
                badge: 'critical'
            }, {
                id: 'CVE-2024-11477',
                cvss: '9.1',
                desc: '7-Zip Code Execution',
                badge: 'critical'
            }, {
                id: 'CVE-2024-10905',
                cvss: '8.4',
                desc: 'Ivanti Connect Secure',
                badge: 'high'
            }, {
                id: 'CVE-2024-9680',
                cvss: '9.8',
                desc: 'Firefox Use-After-Free',
                badge: 'critical'
            }, {
                id: 'CVE-2024-8932',
                cvss: '7.5',
                desc: 'PHP Remote Code Exec',
                badge: 'high'
            }];
            document.getElementById('cve-list').innerHTML = cves.map(c => `
    <div style="padding:9px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;">
      <span class="badge badge-${c.badge}" style="flex-shrink:0;">${c.cvss}</span>
      <div>
        <div style="font-size:10px;color:var(--accent-cyan);font-weight:600;">${c.id}</div>
        <div style="font-size:10px;color:var(--text-muted);">${c.desc}</div>
      </div>
    </div>
  `).join('');
        }

        function renderActorSummary() {
            const shown = State.actors.slice(0, 5);
            document.getElementById('actor-list').innerHTML = shown.map(a => `
    <div style="padding:9px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;cursor:pointer;" onclick="switchView('actors')">
      <div>
        <div style="font-size:11px;color:var(--text-primary);font-weight:600;">${a.name}</div>
        <div style="font-size:10px;color:var(--text-muted);">${a.origin} · ${a.targets}</div>
      </div>
      <span class="badge badge-${a.activity === 'High' || a.activity === 'Very High' ? 'high' : 'medium'}">${a.activity}</span>
    </div>
  `).join('');
        }

        function renderGeoDots() {
            const countries = [{
                name: 'Russia',
                count: 847,
                color: 'var(--accent-red)',
                top: '22%',
                left: '58%'
            }, {
                name: 'China',
                count: 612,
                color: 'var(--accent-orange)',
                top: '35%',
                left: '75%'
            }, {
                name: 'North Korea',
                count: 341,
                color: 'var(--accent-yellow)',
                top: '30%',
                left: '78%'
            }, {
                name: 'Iran',
                count: 287,
                color: 'var(--accent-purple)',
                top: '38%',
                left: '60%'
            }, {
                name: 'Ukraine',
                count: 124,
                color: 'var(--accent-cyan)',
                top: '25%',
                left: '55%'
            }];
            document.getElementById('geo-dots').innerHTML = countries.map(c =>
                `<div class="geo-dot" style="top:${c.top};left:${c.left};background:${c.color};box-shadow:0 0 8px ${c.color};"></div>`
            ).join('');
            document.getElementById('geo-list').innerHTML = countries.slice(0, 4).map(c =>
                `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:10px;">
      <div style="width:6px;height:6px;border-radius:50%;background:${c.color};flex-shrink:0;"></div>
      <span style="color:var(--text-secondary);flex:1;">${c.name}</span>
      <span style="color:var(--text-muted);">${c.count} IOCs</span>
    </div>`
            ).join('');
        }

        function refreshDashboard() {
            const s = document.getElementById('stat-critical');
            const old = parseInt(s.textContent);
            s.textContent = old + Math.floor(Math.random() * 5);
            renderChart();
            showToast('Dashboard refreshed — ' + new Date().toLocaleTimeString(), 'info');
            document.getElementById('last-sync').textContent = 'just now';
        }

        /* ═══════════════════════════════════════
           FEEDS RENDER
        ═══════════════════════════════════════ */
        function renderFeeds() {
            const statusColor = {
                online: 'var(--accent-green)',
                degraded: 'var(--accent-yellow)',
                offline: 'var(--accent-red)'
            };
            document.getElementById('feeds-grid').innerHTML = State.feeds.map(f => `
    <div class="feed-card">
      <div class="feed-card-header">
        <div class="feed-card-name">${f.name}</div>
        <div style="width:8px;height:8px;border-radius:50%;background:${statusColor[f.status]};box-shadow:0 0 6px ${statusColor[f.status]};"></div>
      </div>
      <div style="font-size:9px;color:var(--text-muted);margin-bottom:8px;">${f.source}</div>
      <span class="badge badge-info">${f.type}</span>
      <span class="badge badge-${f.status === 'online' ? 'low' : f.status === 'degraded' ? 'medium' : 'critical'}" style="margin-left:4px;">${f.status.toUpperCase()}</span>
      <div class="feed-card-stats">
        <div class="feed-card-stat"><strong>${f.iocs.toLocaleString()}</strong>IOCs</div>
        <div class="feed-card-stat"><strong>${f.lastUpdate}</strong>Last Sync</div>
      </div>
      <div class="flex gap-8" style="margin-top:12px;">
        <button class="btn btn-ghost btn-xs" onclick="syncFeed(${f.id})">⟳ Sync</button>
        <button class="btn btn-ghost btn-xs" onclick="toggleFeedStatus(${f.id})">${f.status === 'online' ? '⏸ Pause' : '▶ Enable'}</button>
        <button class="btn btn-danger btn-xs" onclick="deleteFeed(${f.id})">✕</button>
      </div>
    </div>
  `).join('');
        }

        function syncFeed(id) {
            const f = State.feeds.find(x => x.id === id);
            if (!f) return;
            f.lastUpdate = 'just now';
            f.iocs += Math.floor(Math.random() * 50) + 5;
            renderFeeds();
            showToast(`${f.name} synced successfully.`, 'success');
        }

        function toggleFeedStatus(id) {
            const f = State.feeds.find(x => x.id === id);
            if (!f) return;
            f.status = f.status === 'online' ? 'offline' : 'online';
            renderFeeds();
            showToast(`${f.name} is now ${f.status}.`, f.status === 'online' ? 'success' : 'warning');
        }

        function deleteFeed(id) {
            State.feeds = State.feeds.filter(x => x.id !== id);
            renderFeeds();
            showToast('Feed removed.', 'info');
        }

        function openAddFeedModal() {
            openModal('feed-modal');
        }

        function addFeed() {
            const name = document.getElementById('new-feed-name').value.trim();
            const type = document.getElementById('new-feed-type').value;
            const url = document.getElementById('new-feed-url').value.trim();
            if (!name || !url) {
                showToast('Name and URL are required.', 'error');
                return;
            }
            State.feeds.push({
                id: Date.now(),
                name,
                type,
                status: 'online',
                iocs: 0,
                lastUpdate: 'just now',
                source: url.replace('https://', '').split('/')[0]
            });
            closeModal('feed-modal');
            renderFeeds();
            showToast(`Feed "${name}" added successfully.`, 'success');
        }

        /* ═══════════════════════════════════════
           IOC RENDER
        ═══════════════════════════════════════ */
        function renderIOCs(filtered) {
            const data = filtered || State.iocs;
            document.getElementById('ioc-count').textContent = `Showing ${data.length} of 12,843`;
            document.getElementById('ioc-table-body').innerHTML = data.map(ioc => `
    <tr>
      <td class="text-cyan">${ioc.value}</td>
      <td><span class="tag">${ioc.type}</span></td>
      <td><span class="badge badge-${ioc.severity.toLowerCase()}">${ioc.severity}</span></td>
      <td>
        <div style="display:flex;align-items:center;gap:6px;">
          <div class="progress-bar" style="width:60px;margin:0;"><div class="progress-fill" style="width:${ioc.confidence}%;background:var(--accent-cyan);"></div></div>
          <span style="font-size:10px;color:var(--text-muted);">${ioc.confidence}%</span>
        </div>
      </td>
      <td class="text-muted">${ioc.firstSeen}</td>
      <td class="text-muted">${ioc.lastSeen}</td>
      <td class="text-muted">${ioc.source}</td>
      <td>${ioc.tags.map(t => `<span class="tag cyan">${t}</span>`).join('')}</td>
    </tr>
  `).join('');
}

function filterIOCs() {
  const typeF = document.getElementById('ioc-filter-type').value;
  const sevF = document.getElementById('ioc-filter-sev').value;
  const filtered = State.iocs.filter(i =>
    (!typeF || i.type === typeF) && (!sevF || i.severity === sevF)
  );
  renderIOCs(filtered);
}

/* ═══════════════════════════════════════
   ALERTS RENDER
═══════════════════════════════════════ */
function renderAlerts() {
  const unread = State.alerts.filter(a => a.unread).length;
  document.getElementById('notif-count').textContent = unread;
  document.getElementById('notif-count').style.display = unread ? 'flex' : 'none';

  document.getElementById('alerts-panel').innerHTML = State.alerts.map(a => `
    <div class="alert-item ${a.unread ? 'unread' : ''}" onclick="markAlertRead(${a.id})">
      <div class="alert-icon">${a.icon}</div>
      <div class="alert-content">
        <div class="alert-title">${a.title} ${a.unread ? '<span style="width:6px;height:6px;border-radius:50%;background:var(--accent-cyan);display:inline-block;margin-left:4px;"></span>' : ''}</div>
        <div class="alert-body">${a.body}</div>
        <div class="alert-time">${a.time}</div>
      </div>
      <div><span class="badge badge-${a.severity}">${a.severity}</span></div>
    </div>
  `).join('');
}

function markAlertRead(id) {
  const a = State.alerts.find(x => x.id === id);
  if (a) { a.unread = false; renderAlerts(); }
}

function markAllRead() {
  State.alerts.forEach(a => a.unread = false);
  renderAlerts();
  showToast('All alerts marked as read.', 'success');
}

/* ═══════════════════════════════════════
   REPORTS RENDER
═══════════════════════════════════════ */
function renderReports() {
  const reports = [
    { title: 'Weekly Threat Intelligence Report — W9 2025', date: 'Mar 03, 2025', type: 'Weekly', iocs: 1842 },
    { title: 'LockBit 4.0 Campaign Analysis', date: 'Mar 01, 2025', type: 'Campaign', iocs: 284 },
    { title: 'APT29 Infrastructure Report Q1 2025', date: 'Feb 28, 2025', type: 'Actor', iocs: 94 },
    { title: 'Daily Digest — Feb 27, 2025', date: 'Feb 27, 2025', type: 'Daily', iocs: 342 },
    { title: 'CVE Exploitation Trends — Feb 2025', date: 'Feb 25, 2025', type: 'Monthly', iocs: 67 }
  ];
  document.getElementById('reports-list').innerHTML = reports.map(r => `
    <div style="padding:12px 18px;border-bottom:1px solid var(--border);cursor:pointer;transition:background 0.15s;" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''">
      <div style="font-size:12px;color:var(--text-primary);margin-bottom:4px;">${r.title}</div>
      <div style="display:flex;gap:8px;align-items:center;">
        <span class="badge badge-info">${r.type}</span>
        <span style="font-size:10px;color:var(--text-muted);">${r.date}</span>
        <span style="font-size:10px;color:var(--text-muted);margin-left:auto;">${r.iocs} IOCs</span>
      </div>
    </div>
  `).join('');
}

function generateReport() {
  showToast('Generating report... This may take a moment.', 'info');
  setTimeout(() => {
    showToast('Report generated successfully.', 'success');
    renderReports();
  }, 2000);
}

/* ═══════════════════════════════════════
   ACTORS RENDER
═══════════════════════════════════════ */
function renderActors() {
  document.getElementById('actors-grid').innerHTML = State.actors.map(a => `
    <div class="panel" style="cursor:pointer;transition:border-color 0.2s;" onmouseover="this.style.borderColor='${a.color}'" onmouseout="this.style.borderColor='var(--border)'">
      <div class="panel-header">
        <span style="font-size:13px;font-weight:700;color:${a.color};">${a.name}</span>
        <span class="badge badge-${a.activity === 'High' || a.activity === 'Very High' ? 'high' : a.activity === 'Medium' ? 'medium' : 'low'}">${a.activity}</span>
      </div>
      <div class="panel-body">
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:8px;">Origin: <span style="color:var(--text-secondary);">${a.origin}</span></div>
        <div style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">Targets: <span style="color:var(--text-secondary);">${a.targets}</span></div>
        <div style="margin-bottom:12px;">${a.ttps.map(t => `<span class="tag">${t}</span>`).join('')}</div>
        <div style="font-size:11px;color:var(--text-muted);">Known IOCs: <span style="color:${a.color};font-weight:700;">${a.iocs}</span></div>
      </div>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════
   THREAT HUNT
═══════════════════════════════════════ */
function runHuntQuery() {
  const q = document.getElementById('hunt-query').value.trim();
  if (!q) { showToast('Enter a search query.', 'warning'); return; }

  const resultsDiv = document.getElementById('hunt-results');
  resultsDiv.innerHTML = `<div class="panel-header"><span class="panel-title">Hunt Results — <span class="text-cyan">"${q}"</span></span></div><div class="panel-body"><div class="spinner"></div> Searching intelligence feeds...</div>`;

  setTimeout(() => {
    const matchedIOCs = State.iocs.filter(i => i.value.toLowerCase().includes(q.toLowerCase()) || i.tags.some(t => t.includes(q.toLowerCase()))).slice(0, 10);
    const matchedActor = State.actors.find(a => a.name.toLowerCase().includes(q.toLowerCase()));

    let html = `<div class="panel-header"><span class="panel-title">Hunt Results — <span class="text-cyan">"${q}"</span></span><span class="badge badge-info">${matchedIOCs.length} matches</span></div>`;

    if (matchedActor) {
      html += `<div style="padding:14px 18px;background:var(--accent-cyan-dim);border-bottom:1px solid var(--border);">
        <div style="font-size:12px;font-weight:700;color:var(--accent-cyan);">🎯 Threat Actor Match: ${matchedActor.name}</div>
        <div style="font-size:11px;color:var(--text-muted);margin-top:4px;">Origin: ${matchedActor.origin} · Activity: ${matchedActor.activity} · ${matchedActor.iocs} known IOCs</div>
      </div>`;
    }

    if (matchedIOCs.length > 0) {
      html += `<table class="threat-table"><thead><tr><th>Value</th><th>Type</th><th>Severity</th><th>Source</th><th>Tags</th></tr></thead><tbody>`;
      html += matchedIOCs.map(i => `<tr>
        <td class="text-cyan">${i.value}</td>
        <td><span class="tag">${i.type}</span></td>
        <td><span class="badge badge-${i.severity.toLowerCase()}">${i.severity}</span></td>
        <td class="text-muted">${i.source}</td>
        <td>${i.tags.map(t => `<span class="tag cyan">${t}</span>`).join('')}</td>
      </tr>`).join('');
      html += '</tbody></table>';
    } else if (!matchedActor) {
      html += `<div class="panel-body" style="color:var(--text-muted);">No matches found for "<span class="text-cyan">${q}</span>" in current threat intelligence database.</div>`;
    }

    resultsDiv.innerHTML = html;
  }, 1200);
}

/* ═══════════════════════════════════════
   USER MANAGEMENT
═══════════════════════════════════════ */
function renderUsers() {
  const colors = ['avatar-cyan', 'avatar-purple', 'avatar-orange'];
  document.getElementById('users-grid').innerHTML = State.users.map((u, i) => `
    <div class="user-card">
      <div class="user-card-top">
        <div class="user-card-avatar ${colors[i % colors.length]}" style="width:46px;height:46px;">${u.name[0]}</div>
        <div>
          <div class="user-card-name">${u.name}</div>
          <div class="user-card-email">${u.email}</div>
          <div class="user-card-role">${u.role}</div>
        </div>
        <div style="margin-left:auto;">
          <span class="badge ${u.active ? 'badge-low' : 'badge-critical'}">${u.active ? 'ACTIVE' : 'INACTIVE'}</span>
        </div>
      </div>
      <div class="user-card-meta">
        <span>📋 ${u.reports} reports</span>
        <span>🔍 ${u.iocs} IOCs</span>
        <span>📅 Since ${u.since}</span>
      </div>
      <div class="user-card-actions">
        <button class="btn btn-ghost btn-xs" onclick="editUser(${u.id})">✏ Edit</button>
        <button class="btn btn-ghost btn-xs" onclick="toggleUserStatus(${u.id})">${u.active ? '⏸ Deactivate' : '▶ Activate'}</button>
        ${u.id !== 1 ? `<button class="btn btn-danger btn-xs" onclick="deleteUser(${u.id})">✕ Delete</button>` : ''}
      </div>
    </div>
  `).join('');
}

function openAddUserModal() {
  document.getElementById('user-modal-title').textContent = 'Add New User';
  document.getElementById('edit-user-id').value = '';
  ['modal-name','modal-email','modal-username','modal-password'].forEach(id => document.getElementById(id).value = '');
  openModal('user-modal');
}

function editUser(id) {
  const u = State.users.find(x => x.id === id);
  if (!u) return;
  document.getElementById('user-modal-title').textContent = 'Edit User';
  document.getElementById('edit-user-id').value = id;
  document.getElementById('modal-name').value = u.name;
  document.getElementById('modal-email').value = u.email;
  document.getElementById('modal-username').value = u.username;
  document.getElementById('modal-password').value = '';
  document.getElementById('modal-role').value = u.role;
  document.getElementById('modal-tlp').value = u.tlp;
  openModal('user-modal');
}

function saveUser() {
  const id = document.getElementById('edit-user-id').value;
  const name = document.getElementById('modal-name').value.trim();
  const email = document.getElementById('modal-email').value.trim();
  const username = document.getElementById('modal-username').value.trim();
  const password = document.getElementById('modal-password').value;
  const role = document.getElementById('modal-role').value;
  const tlp = document.getElementById('modal-tlp').value;

  if (!name || !email || !username) { showToast('Name, email and username are required.', 'error'); return; }

  if (id) {
    const u = State.users.find(x => x.id === parseInt(id));
    if (u) { u.name = name; u.email = email; u.username = username; u.role = role; u.tlp = tlp; if (password) u.password = password; }
    showToast('User updated.', 'success');
  } else {
    if (State.users.find(u => u.username === username)) { showToast('Username taken.', 'error'); return; }
    State.users.push({ id: State.nextUserId++, name, username, email, password: password || 'change123', role, tlp, since: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), active: true, reports: 0, iocs: 0, feeds: 0, days: 0 });
    showToast(`User "${name}" created.`, 'success');
  }

  closeModal('user-modal');
  renderUsers();
}

function toggleUserStatus(id) {
  const u = State.users.find(x => x.id === id);
  if (!u) return;
  u.active = !u.active;
  renderUsers();
  showToast(`${u.name} is now ${u.active ? 'active' : 'inactive'}.`, u.active ? 'success' : 'warning');
}

function deleteUser(id) {
  const u = State.users.find(x => x.id === id);
  if (!u) return;
  State.users = State.users.filter(x => x.id !== id);
  renderUsers();
  showToast(`User "${u.name}" deleted.`, 'info');
}

/* ═══════════════════════════════════════
   PROFILE
═══════════════════════════════════════ */
function updateProfileView() {
  const u = State.currentUser;
  if (!u) return;

  document.getElementById('profile-avatar-large').textContent = u.name[0];
  document.getElementById('profile-name').textContent = u.name;
  document.getElementById('profile-title').textContent = (u.role + ' — THREAT INTELLIGENCE').toUpperCase();
  document.getElementById('profile-badges').innerHTML = `<span class="badge badge-info">${u.role}</span> <span class="badge badge-new">${u.tlp}</span>`;

  document.getElementById('ps-reports').textContent = u.reports;
  document.getElementById('ps-iocs').textContent = u.iocs.toLocaleString();
  document.getElementById('ps-feeds').textContent = u.feeds;
  document.getElementById('ps-days').textContent = u.days;

  document.getElementById('pf-name').textContent = u.name;
  document.getElementById('pf-username').textContent = u.username;
  document.getElementById('pf-email').textContent = u.email;
  document.getElementById('pf-role').textContent = u.role;
  document.getElementById('pf-tlp').textContent = u.tlp;
  document.getElementById('pf-since').textContent = u.since;

  renderProfileActivity();
  renderAPIKeys();
}

function renderProfileActivity() {
  const activities = [
    { text: 'Synced <strong>Abuse.ch</strong> feed', time: '2m ago', icon: '📡' },
    { text: 'Added <strong>47 IOCs</strong> to watchlist', time: '1h ago', icon: '🔍' },
    { text: 'Generated <strong>Weekly Report</strong>', time: '1d ago', icon: '📋' },
    { text: 'Updated <strong>APT29 actor profile</strong>', time: '2d ago', icon: '👤' },
    { text: 'Created alert rule for <strong>CVE-2024-12356</strong>', time: '3d ago', icon: '🚨' }
  ];
  document.getElementById('profile-activity').innerHTML = activities.map(a =>
    `<div class="feed-item"><span style="font-size:16px;">${a.icon}</span><span style="font-size:11px;color:var(--text-secondary);flex:1;">${a.text}</span><span style="font-size:10px;color:var(--text-dim);">${a.time}</span></div>`
  ).join('');
}

function renderAPIKeys() {
  document.getElementById('api-keys-list').innerHTML = State.apiKeys.map(k => `
    <div class="feed-item">
      <div style="flex:1;">
        <div style="font-size:12px;color:var(--text-primary);font-weight:600;">${k.name}</div>
        <div style="font-size:10px;color:var(--text-muted);margin-top:2px;font-family:var(--font-mono);">${k.key}</div>
        <div style="font-size:9px;color:var(--text-dim);margin-top:2px;">Created ${k.created} · Last used ${k.lastUsed}</div>
      </div>
      <div class="flex gap-8">
        <button class="btn btn-ghost btn-xs" onclick="copyToClipboard('${k.key}')">📋 Copy</button>
        <button class="btn btn-danger btn-xs" onclick="revokeKey('${k.id}')">✕ Revoke</button>
      </div>
    </div>
  `).join('');
}

function openEditProfileModal() {
  const u = State.currentUser;
  document.getElementById('edit-fullname').value = u.name;
  document.getElementById('edit-email').value = u.email;
  document.getElementById('edit-title').value = u.role + ' Analyst';
  openModal('profile-modal');
}

function saveProfile() {
  const u = State.currentUser;
  const name = document.getElementById('edit-fullname').value.trim();
  const email = document.getElementById('edit-email').value.trim();
  if (!name || !email) { showToast('Name and email are required.', 'error'); return; }
  u.name = name;
  u.email = email;
  closeModal('profile-modal');
  updateProfileView();
  document.getElementById('sidebar-username').textContent = name;
  document.getElementById('sidebar-avatar').textContent = name[0].toUpperCase();
  showToast('Profile updated.', 'success');
}

function generateAPIKey() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const key = 'tp_live_' + Array.from({ length: 24 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  State.apiKeys.push({ id: 'key_' + Date.now(), name: 'New API Key ' + (State.apiKeys.length + 1), key: key.slice(0,12) + '••••••••••••', created: new Date().toISOString().slice(0, 10), lastUsed: 'Never' });
  renderAPIKeys();
  showToast('New API key generated.', 'success');
}

function revokeKey(id) {
  State.apiKeys = State.apiKeys.filter(k => k.id !== id);
  renderAPIKeys();
  showToast('API key revoked.', 'warning');
}

function copyToClipboard(text) {
  navigator.clipboard && navigator.clipboard.writeText(text);
  showToast('Copied to clipboard.', 'info');
}

/* ═══════════════════════════════════════
   SETTINGS
═══════════════════════════════════════ */
function switchSettingsTab(el, tabId) {
  document.querySelectorAll('.settings-nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.settings-tab').forEach(t => t.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

function toggleSwitch(el) {
  el.classList.toggle('on');
}

function saveSettings(section) {
  showToast(`${section.charAt(0).toUpperCase() + section.slice(1)} settings saved.`, 'success');
}

function changePassword() {
  const cur = document.getElementById('pw-current').value;
  const nw = document.getElementById('pw-new').value;
  const conf = document.getElementById('pw-confirm').value;

  if (!cur || !nw || !conf) { showToast('All password fields are required.', 'error'); return; }
  if (cur !== State.currentUser.password) { showToast('Current password is incorrect.', 'error'); return; }
  if (nw !== conf) { showToast('New passwords do not match.', 'error'); return; }
  if (nw.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }

  State.currentUser.password = nw;
  const userRecord = State.users.find(u => u.id === State.currentUser.id);
  if (userRecord) userRecord.password = nw;

  ['pw-current','pw-new','pw-confirm'].forEach(id => document.getElementById(id).value = '');
  showToast('Password changed successfully.', 'success');
}

function changeTheme(theme) {
  const themes = {
    cyan: '#00d4ff',
    green: '#00ff88',
    orange: '#ff7c2a',
    purple: '#9b5de5'
  };
  document.documentElement.style.setProperty('--accent-cyan', themes[theme] || themes.cyan);
  showToast(`Theme changed to ${theme}.`, 'info');
}

/* ═══════════════════════════════════════
   GLOBAL SEARCH
═══════════════════════════════════════ */
function globalSearch(q) {
  if (!q || q.length < 3) return;
  const results = State.iocs.filter(i => i.value.toLowerCase().includes(q.toLowerCase())).length;
  if (results > 0) showToast(`Found ${results} IOCs matching "${q}" — press Enter to view in IOC Explorer`, 'info');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.activeElement.id === 'global-search') {
    document.getElementById('hunt-query').value = document.getElementById('global-search').value;
    switchView('hunt');
    runHuntQuery();
  }
  if (e.key === 'Enter' && document.activeElement.id === 'login-username' || e.key === 'Enter' && document.activeElement.id === 'login-password') {
    handleLogin();
  }
});

/* ═══════════════════════════════════════
   MODAL HELPERS
═══════════════════════════════════════ */
function openModal(id) {
  document.getElementById(id).classList.add('show');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}

// Close modal on overlay click
document.querySelectorAll('.modal-overlay').forEach(o => {
  o.addEventListener('click', e => {
    if (e.target === o) o.classList.remove('show');
  });
});

/* ═══════════════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════════════ */
function showToast(msg, type = 'info') {
  const map = { success: 'toast-success', error: 'toast-error', warning: 'toast-warning', info: '' };
  const toast = document.createElement('div');
  toast.className = `toast ${map[type] || ''}`;
  toast.textContent = msg;
  document.getElementById('toast-container').appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ═══════════════════════════════════════
   LIVE STATS UPDATER
═══════════════════════════════════════ */
function liveUpdate() {
  if (!State.currentUser) return;
  // Randomly increment IOC count
  const statIocs = document.getElementById('stat-iocs');
  if (statIocs) {
    const cur = parseInt(statIocs.textContent.replace(/,/g, ''));
    if (Math.random() > 0.7) statIocs.textContent = (cur + Math.floor(Math.random() * 3) + 1).toLocaleString();
  }
}

setInterval(liveUpdate, 5000);

