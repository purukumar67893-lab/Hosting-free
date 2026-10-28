import { WebsiteTemplate } from '../types';

export const TEMPLATES: WebsiteTemplate[] = [
  {
    id: 'tpl-gaming',
    name: 'ApexForge Gaming & Esports Clan',
    category: 'Gaming',
    description: 'High-octane dark cyberpunk theme for esports teams, gaming communities, twitch streamers, and tournament brackets.',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    features: ['Live Match Schedule', 'Roster Grid & Player Cards', 'Twitch Stream Player', 'Sponsor Badges', 'Clan Recruitment Form'],
    isPopular: true,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ApexForge Esports | Dominate the Arena</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800;900&family=Rajdhani:wght@500;600;700&display=swap" rel="stylesheet">
</head>
<body class="gaming-body">
  <nav class="navbar">
    <div class="logo"><span class="highlight">APEX</span>FORGE</div>
    <ul class="nav-links">
      <li><a href="#about">About</a></li>
      <li><a href="#roster">Roster</a></li>
      <li><a href="#matches">Matches</a></li>
      <li><a href="#tournaments">Tournaments</a></li>
    </ul>
    <button class="cta-btn" onclick="openJoinModal()">JOIN RECRUITS</button>
  </nav>

  <header class="hero">
    <div class="hero-overlay"></div>
    <div class="hero-content">
      <div class="badge">SEASON 2026 WORLD CHAMPIONSHIP</div>
      <h1>WE DO NOT COMPETE.<br><span class="neon-text">WE DOMINATE.</span></h1>
      <p>Tier-1 competitive organization spanning Valorant, CS2, Apex Legends, and Rocket League.</p>
      <div class="hero-actions">
        <a href="#matches" class="primary-btn">WATCH UPCOMING MATCH</a>
        <a href="#roster" class="secondary-btn">VIEW ROSTER</a>
      </div>
      <div class="stats-row">
        <div class="stat"><span class="number">14</span><span class="label">Major Trophies</span></div>
        <div class="stat"><span class="number">$2.4M</span><span class="label">Prize Winnings</span></div>
        <div class="stat"><span class="number">1.2M</span><span class="label">Global Clan Fans</span></div>
      </div>
    </div>
  </header>

  <section id="matches" class="section">
    <h2 class="section-title">UPCOMING <span class="neon-text">FIXTURES</span></h2>
    <div class="match-card">
      <div class="team">
        <span class="team-tag">AF</span>
        <h4>ApexForge Prime</h4>
      </div>
      <div class="vs-badge">
        <span class="vs">VS</span>
        <span class="match-time">TODAY - 20:00 CET</span>
        <span class="game-tag">Valorant Masters Berlin</span>
      </div>
      <div class="team">
        <span class="team-tag red">VN</span>
        <h4>Vortex Nebula</h4>
      </div>
    </div>
  </section>

  <section id="roster" class="section">
    <h2 class="section-title">PRO <span class="neon-text">ROSTER</span></h2>
    <div class="roster-grid">
      <div class="player-card">
        <div class="player-role">DUELIST / IGL</div>
        <h3>CYPHER_X</h3>
        <p class="role-desc">K/D: 1.48 | 84% Headshot rate</p>
      </div>
      <div class="player-card">
        <div class="player-role">INITIATOR</div>
        <h3>VALKYRIE</h3>
        <p class="role-desc">Clutch Master 2025 MVP</p>
      </div>
      <div class="player-card">
        <div class="player-role">CONTROLLER</div>
        <h3>GHOST_OPS</h3>
        <p class="role-desc">Tactical Maestro & Strategist</p>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 ApexForge Esports. Built & Hosted on <strong>HOSTBANGER</strong>.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
    css: `* { margin: 0; padding: 0; box-sizing: border-box; }
body.gaming-body {
  background: #090a10;
  color: #f1f5f9;
  font-family: 'Rajdhani', sans-serif;
  line-height: 1.6;
}
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 4rem;
  background: rgba(13, 15, 26, 0.95);
  border-bottom: 2px solid #00f0ff;
  position: sticky;
  top: 0;
  z-index: 50;
}
.logo { font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 900; letter-spacing: 2px; }
.highlight { color: #00f0ff; text-shadow: 0 0 12px #00f0ff; }
.nav-links { display: flex; list-style: none; gap: 2rem; }
.nav-links a { color: #94a3b8; text-decoration: none; font-weight: 600; text-transform: uppercase; transition: color 0.2s; }
.nav-links a:hover { color: #00f0ff; }
.cta-btn {
  background: #ff0055;
  color: white;
  border: none;
  padding: 0.6rem 1.5rem;
  font-family: 'Orbitron', sans-serif;
  font-weight: 700;
  cursor: pointer;
  clip-path: polygon(10px 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
  transition: transform 0.2s, box-shadow 0.2s;
}
.cta-btn:hover { transform: scale(1.05); box-shadow: 0 0 15px #ff0055; }
.hero {
  padding: 6rem 4rem;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: radial-gradient(circle at 80% 20%, rgba(0, 240, 255, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 20% 80%, rgba(255, 0, 85, 0.15) 0%, transparent 50%),
              #090a10;
}
.hero-content { max-width: 800px; }
.badge { display: inline-block; padding: 0.3rem 0.8rem; background: rgba(0, 240, 255, 0.1); border: 1px solid #00f0ff; color: #00f0ff; font-weight: 700; font-size: 0.85rem; margin-bottom: 1.5rem; letter-spacing: 1px; }
h1 { font-family: 'Orbitron', sans-serif; font-size: 3.5rem; line-height: 1.1; margin-bottom: 1.5rem; font-weight: 900; }
.neon-text { color: #00f0ff; text-shadow: 0 0 20px rgba(0, 240, 255, 0.8); }
.hero p { font-size: 1.25rem; color: #94a3b8; margin-bottom: 2rem; }
.hero-actions { display: flex; gap: 1rem; margin-bottom: 3rem; }
.primary-btn { background: #00f0ff; color: #090a10; padding: 0.8rem 2rem; font-weight: 800; text-decoration: none; font-family: 'Orbitron', sans-serif; transition: all 0.2s; }
.primary-btn:hover { background: #fff; box-shadow: 0 0 25px #00f0ff; }
.secondary-btn { border: 1px solid #475569; color: #f1f5f9; padding: 0.8rem 2rem; text-decoration: none; font-weight: 700; }
.stats-row { display: flex; gap: 3rem; border-top: 1px solid #1e293b; padding-top: 2rem; }
.stat .number { display: block; font-family: 'Orbitron', sans-serif; font-size: 2.2rem; font-weight: 900; color: #00f0ff; }
.stat .label { font-size: 0.9rem; color: #64748b; text-transform: uppercase; }
.section { padding: 5rem 4rem; max-width: 1200px; margin: 0 auto; }
.section-title { font-family: 'Orbitron', sans-serif; font-size: 2.2rem; margin-bottom: 2.5rem; text-align: center; }
.match-card { background: #131726; border: 1px solid #1e293b; display: flex; justify-content: space-between; align-items: center; padding: 2.5rem; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
.team-tag { background: #00f0ff; color: #000; font-weight: 900; font-family: 'Orbitron'; padding: 0.6rem 1rem; border-radius: 4px; display: inline-block; margin-bottom: 0.5rem; }
.team-tag.red { background: #ff0055; color: #fff; }
.vs-badge { text-align: center; }
.vs { font-family: 'Orbitron'; font-size: 2rem; font-weight: 900; color: #ff0055; display: block; }
.match-time { color: #f8fafc; font-weight: 700; display: block; font-size: 1.1rem; }
.game-tag { color: #64748b; font-size: 0.85rem; }
.roster-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; }
.player-card { background: #131726; border-top: 3px solid #00f0ff; padding: 2rem; border-radius: 6px; transition: transform 0.2s; }
.player-card:hover { transform: translateY(-5px); border-top-color: #ff0055; }
.player-role { color: #00f0ff; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; }
.player-card h3 { font-family: 'Orbitron'; font-size: 1.6rem; margin: 0.5rem 0; }
.role-desc { color: #94a3b8; font-size: 0.95rem; }
.footer { text-align: center; padding: 3rem; border-top: 1px solid #1e293b; color: #64748b; }`,
    js: `function openJoinModal() {
  alert("ApexForge Recruits Application portal is currently accepting Challenger and Radiant rank players. Hosted on HOSTBANGER.");
}`
  },
  {
    id: 'tpl-business',
    name: 'Vanguard Capital & Strategic Advisory',
    category: 'Business',
    description: 'Corporate executive aesthetic for financial firms, venture capital, strategic consultancies, and B2B enterprises.',
    thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    features: ['Market Intelligence Cards', 'Client Trust Marquee', 'Executive Leadership Team', 'ROI Calculator Widget', 'Advisory Booking Modal'],
    isPopular: true,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vanguard Advisory | Strategic Capital & Growth</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="corp-body">
  <nav class="nav">
    <div class="brand">VANGUARD <span class="gold">PARTNERS</span></div>
    <div class="links">
      <a href="#services">Practices</a>
      <a href="#track-record">Track Record</a>
      <a href="#insights">Insights</a>
      <a href="#contact" class="btn-gold">Schedule Consultation</a>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="pill">GLOBAL ADVISORY FIRM</div>
      <h1>Accelerating Enterprise Value Across Global Markets.</h1>
      <p>We partner with institutional leaders and founders to execute transformational M&A, capital allocation, and market expansion.</p>
      <div class="metrics">
        <div class="metric-item">
          <h3>$18.4B+</h3>
          <p>Transaction Volume Advised</p>
        </div>
        <div class="metric-item">
          <h3>42</h3>
          <p>Global Jurisdictions</p>
        </div>
        <div class="metric-item">
          <h3>99.2%</h3>
          <p>Client Retention & Mandate Renewal</p>
        </div>
      </div>
    </div>
  </section>

  <section id="services" class="services container">
    <h2 class="heading">Core Advisory Practices</h2>
    <div class="grid">
      <div class="card">
        <div class="icon">🏛️</div>
        <h3>Cross-Border M&A</h3>
        <p>Comprehensive buy-side and sell-side transaction structuring, regulatory navigation, and post-merger integration.</p>
      </div>
      <div class="card">
        <div class="icon">📈</div>
        <h3>Growth Equity & Restructuring</h3>
        <p>Syndicated institutional capital structuring, debt refinancing, and corporate turnaround management.</p>
      </div>
      <div class="card">
        <div class="icon">🌐</div>
        <h3>Sovereign & ESG Governance</h3>
        <p>Decarbonization strategy, board oversight advisory, and compliance frameworks for Fortune 500 corporations.</p>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 Vanguard Advisory Partners LLC. Member FINRA/SIPC. Hosted securely on HOSTBANGER Cloud.</p>
  </footer>
</body>
</html>`,
    css: `* { margin:0; padding:0; box-sizing:border-box; }
body.corp-body { background: #0c121e; color: #f8fafc; font-family: 'Inter', sans-serif; line-height: 1.6; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; border-bottom: 1px solid rgba(255,255,255,0.08); background: #0c121e; position: sticky; top:0; z-index: 100; }
.brand { font-family: 'Cinzel', serif; font-size: 1.4rem; font-weight: 700; letter-spacing: 2px; }
.gold { color: #d4af37; }
.links a { color: #94a3b8; text-decoration: none; margin-left: 2rem; font-weight: 500; font-size: 0.95rem; }
.links a:hover { color: #fff; }
.btn-gold { background: #d4af37; color: #0c121e !important; padding: 0.6rem 1.4rem; border-radius: 4px; font-weight: 600; }
.hero { padding: 6rem 0 4rem; text-align: center; background: radial-gradient(circle at 50% 0%, rgba(212,175,55,0.1) 0%, transparent 60%); }
.pill { display: inline-block; padding: 0.4rem 1rem; border: 1px solid rgba(212,175,55,0.4); color: #d4af37; font-size: 0.75rem; letter-spacing: 2px; margin-bottom: 1.5rem; border-radius: 999px; }
h1 { font-family: 'Cinzel', serif; font-size: 3.2rem; max-width: 900px; margin: 0 auto 1.5rem; color: #ffffff; }
.hero p { max-width: 700px; margin: 0 auto 3rem; color: #94a3b8; font-size: 1.15rem; }
.metrics { display: flex; justify-content: center; gap: 4rem; padding-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); }
.metric-item h3 { font-family: 'Cinzel', serif; font-size: 2.5rem; color: #d4af37; }
.metric-item p { color: #64748b; font-size: 0.9rem; }
.services { padding: 6rem 0; }
.heading { font-family: 'Cinzel', serif; font-size: 2.2rem; text-align: center; margin-bottom: 3.5rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
.card { background: #131b2e; border: 1px solid rgba(255,255,255,0.06); padding: 2.5rem; border-radius: 8px; transition: transform 0.2s; }
.card:hover { transform: translateY(-4px); border-color: #d4af37; }
.icon { font-size: 2rem; margin-bottom: 1rem; }
.card h3 { font-size: 1.3rem; margin-bottom: 0.8rem; }
.card p { color: #94a3b8; font-size: 0.95rem; }
.footer { text-align: center; padding: 3rem; border-top: 1px solid rgba(255,255,255,0.08); color: #64748b; font-size: 0.85rem; }`,
    js: `// Vanguard Partners script
console.log("Vanguard Corporate Template initialized via HOSTBANGER.");`
  },
  {
    id: 'tpl-portfolio',
    name: 'Elena Rostova - Principal Creative Technologist',
    category: 'Portfolio',
    description: 'Minimalist high-contrast portfolio tailored for designers, creative developers, architects, and product leaders.',
    thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    features: ['Interactive Project Case Studies', 'Awards & Recognition Shelf', 'Skills Matrix', 'Contact Direct Form', 'Smooth Dark Aesthetic'],
    isPopular: true,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Elena Rostova | Creative Technologist & Interaction Designer</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Space+Grotesk:wght@400;500;600&display=swap" rel="stylesheet">
</head>
<body>
  <header class="header">
    <div class="name">ELENA ROSTOVA</div>
    <div class="status">🟢 AVAILABLE FOR SELECTIVE CLIENT WORK</div>
    <a href="#contact" class="btn">LET'S TALK</a>
  </header>

  <main class="main">
    <section class="intro">
      <h1>CRAFTING DIGITAL EXPERIENCES AT THE INTERSECTION OF CODE, MOTION & HUMAN FEELING.</h1>
      <p class="bio">Previously design lead at Humane AI and Phantom Labs. Crafting fluid web interfaces, spatial audio applications, and high-performance brand ecosystems.</p>
    </section>

    <section class="works">
      <div class="works-header">
        <h2>SELECTED WORKS (2024 - 2026)</h2>
        <span class="count">04 PROJECTS</span>
      </div>
      <div class="project-list">
        <article class="project-item">
          <div class="meta"><span>01 / FINTECH</span><span>2026</span></div>
          <h3>Aura Zero - Autonomous Wealth Interface</h3>
          <p>Created generative data canvas and micro-interactions for next-gen algorithmic trading dashboard.</p>
        </article>
        <article class="project-item">
          <div class="meta"><span>02 / HARDWARE</span><span>2025</span></div>
          <h3>Synapse Spatial Audio OS</h3>
          <p>Embedded touch UI and multi-channel spatial acoustic visualizer for high-end hi-fi monitors.</p>
        </article>
        <article class="project-item">
          <div class="meta"><span>03 / WEB3 & AI</span><span>2025</span></div>
          <h3>Monolith Autonomous Agent</h3>
          <p>Complete design system, reactive web layout, and prompt engineering UI for LLM workflows.</p>
        </article>
      </div>
    </section>
  </main>

  <footer id="contact" class="footer">
    <h2>HAVE AN AMBITIOUS PROJECT?</h2>
    <a href="mailto:elena@rostova.design" class="big-email">elena@rostova.design</a>
    <p class="host-badge">Deployed with HOSTBANGER Edge Hosting • Fast • Reliable</p>
  </footer>
</body>
</html>`,
    css: `* { margin:0; padding:0; box-sizing:border-box; }
body { background: #08090d; color: #eceff4; font-family: 'Space Grotesk', sans-serif; padding: 2rem 4rem; }
.header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 3rem; border-bottom: 1px solid #1e2230; }
.name { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; letter-spacing: 1px; }
.status { font-size: 0.85rem; color: #94a3b8; }
.btn { background: #fff; color: #000; padding: 0.6rem 1.4rem; text-decoration: none; font-weight: 600; border-radius: 2px; }
.intro { padding: 6rem 0; max-width: 1000px; }
h1 { font-family: 'Syne', sans-serif; font-size: 3.4rem; line-height: 1.15; margin-bottom: 2rem; color: #fff; }
.bio { font-size: 1.4rem; color: #8892b0; line-height: 1.6; max-width: 800px; }
.works { padding: 4rem 0; border-top: 1px solid #1e2230; }
.works-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3rem; }
.works-header h2 { font-family: 'Syne', sans-serif; font-size: 1.5rem; }
.count { color: #64748b; font-size: 0.9rem; }
.project-list { display: flex; flex-direction: column; gap: 3rem; }
.project-item { padding-bottom: 3rem; border-bottom: 1px solid #181b26; transition: padding-left 0.3s; }
.project-item:hover { padding-left: 1.5rem; border-color: #38bdf8; }
.meta { display: flex; gap: 2rem; color: #38bdf8; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; }
.project-item h3 { font-family: 'Syne', sans-serif; font-size: 2rem; margin-bottom: 0.5rem; }
.project-item p { color: #8892b0; font-size: 1.05rem; }
.footer { padding: 6rem 0 3rem; border-top: 1px solid #1e2230; }
.footer h2 { font-family: 'Syne', sans-serif; font-size: 2rem; margin-bottom: 1.5rem; }
.big-email { font-family: 'Syne', sans-serif; font-size: 3.5rem; color: #38bdf8; text-decoration: underline; display: inline-block; margin-bottom: 3rem; }
.host-badge { color: #475569; font-size: 0.85rem; }`,
    js: `console.log("Elena Rostova portfolio template active.");`
  },
  {
    id: 'tpl-store',
    name: 'Aetheria Artisanal Streetwear & Gear',
    category: 'Store',
    description: 'Sleek luxury e-commerce storefront with interactive product cart, size selector, customer reviews, and instant checkout flow.',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    features: ['Dynamic Shopping Bag', 'Size & Color Variations', 'Discount Promo Code Field', 'Customer Testimonials', 'Secure Checkout UI'],
    isPopular: true,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AETHERIA | Architectural Techwear</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="store-body">
  <div class="announcement">WORLDWIDE EXPRESS SHIPPING • USE CODE <strong>HOSTBANGER</strong> FOR 20% OFF</div>
  <header class="store-header">
    <div class="logo">AETHERIA</div>
    <nav class="nav">
      <a href="#new">NEW ARRIVALS</a>
      <a href="#outerwear">OUTERWEAR</a>
      <a href="#accessories">ACCESSORIES</a>
      <a href="#archive">ARCHIVE</a>
    </nav>
    <div class="cart-trigger" onclick="toggleCart()">
      🛒 CART (<span id="cart-count">0</span>)
    </div>
  </header>

  <section class="hero-banner">
    <div class="hero-txt">
      <span class="season">COLLECTION 09 // NEURAL RUN</span>
      <h1>PRECISION TAILORED FOR THE METROPOLIS</h1>
      <a href="#products" class="shop-btn">DISCOVER DROP 09</a>
    </div>
  </section>

  <main id="products" class="catalog">
    <div class="catalog-header">
      <h2>FEATURED RELEASES</h2>
      <div class="filters">
        <span class="active">ALL</span>
        <span>JACKETS</span>
        <span>PANTS</span>
        <span>FOOTWEAR</span>
      </div>
    </div>

    <div class="products-grid">
      <div class="product-card">
        <div class="tag">WATERPROOF 20K</div>
        <div class="img-ph">🧥 CYBER-SHELL MK-IV</div>
        <h3>Cyber-Shell Storm Parka</h3>
        <p class="price">$380.00</p>
        <button class="add-btn" onclick="addToCart('Cyber-Shell Storm Parka', 380)">ADD TO BAG</button>
      </div>

      <div class="product-card">
        <div class="tag">CORDURA® HYBRID</div>
        <div class="img-ph">👖 MODULAR CARGO PANT</div>
        <h3>Aether Modular Tactical Trouser</h3>
        <p class="price">$240.00</p>
        <button class="add-btn" onclick="addToCart('Aether Modular Trouser', 240)">ADD TO BAG</button>
      </div>

      <div class="product-card">
        <div class="tag">VIBRAM SOLE</div>
        <div class="img-ph">👟 EXOFLEX TRAINERS</div>
        <h3>ExoFlex High-Traction Boots</h3>
        <p class="price">$310.00</p>
        <button class="add-btn" onclick="addToCart('ExoFlex High-Traction Boots', 310)">ADD TO BAG</button>
      </div>
    </div>
  </main>

  <div id="cart-drawer" class="cart-drawer">
    <div class="cart-header">
      <h3>YOUR SHOPPING BAG</h3>
      <button onclick="toggleCart()">✕</button>
    </div>
    <div id="cart-items" class="cart-items">
      <p class="empty-msg">Your bag is empty.</p>
    </div>
    <div class="cart-footer">
      <div class="total-row"><span>SUBTOTAL:</span><span id="subtotal">$0.00</span></div>
      <button class="checkout-btn" onclick="checkout()">CHECKOUT NOW</button>
    </div>
  </div>

  <footer class="footer">
    <p>© 2026 AETHERIA LABS. Fast global e-commerce powered by HOSTBANGER.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
    css: `* { margin:0; padding:0; box-sizing:border-box; }
body.store-body { background: #0e0f12; color: #fff; font-family: 'Montserrat', sans-serif; }
.announcement { background: #1f232e; text-align: center; padding: 0.6rem; font-size: 0.75rem; letter-spacing: 1px; }
.store-header { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; border-bottom: 1px solid #202430; position: sticky; top:0; background: #0e0f12; z-index: 90; }
.logo { font-weight: 800; font-size: 1.4rem; letter-spacing: 3px; }
.nav a { color: #8e95a5; text-decoration: none; margin: 0 1rem; font-size: 0.85rem; font-weight: 600; letter-spacing: 1px; }
.nav a:hover { color: #fff; }
.cart-trigger { cursor: pointer; font-size: 0.85rem; font-weight: 700; background: #1a1e28; padding: 0.5rem 1rem; border-radius: 4px; }
.hero-banner { height: 60vh; display: flex; align-items: center; padding: 0 4rem; background: linear-gradient(90deg, rgba(14,15,18,0.95) 0%, rgba(14,15,18,0.6) 100%), #141721; }
.season { color: #00e5ff; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; }
.hero-txt h1 { font-size: 2.8rem; max-width: 650px; margin: 1rem 0 2rem; font-weight: 800; line-height: 1.15; }
.shop-btn { background: #fff; color: #000; padding: 0.8rem 2rem; text-decoration: none; font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; }
.catalog { padding: 4rem; max-width: 1300px; margin: 0 auto; }
.catalog-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
.catalog-header h2 { font-size: 1.5rem; letter-spacing: 1px; }
.filters span { margin-left: 1.5rem; color: #64748b; cursor: pointer; font-size: 0.85rem; font-weight: 600; }
.filters span.active { color: #fff; border-bottom: 2px solid #00e5ff; padding-bottom: 4px; }
.products-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; }
.product-card { background: #151821; padding: 1.5rem; border: 1px solid #202430; border-radius: 6px; }
.tag { font-size: 0.7rem; color: #00e5ff; font-weight: 700; margin-bottom: 0.8rem; }
.img-ph { height: 240px; background: #1c212d; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 700; border-radius: 4px; margin-bottom: 1.2rem; }
.product-card h3 { font-size: 1.1rem; margin-bottom: 0.5rem; }
.price { font-size: 1.2rem; font-weight: 700; color: #00e5ff; margin-bottom: 1.2rem; }
.add-btn { width: 100%; background: #283042; color: #fff; border: none; padding: 0.8rem; font-weight: 700; cursor: pointer; letter-spacing: 1px; transition: background 0.2s; }
.add-btn:hover { background: #00e5ff; color: #000; }
.cart-drawer { position: fixed; right: -400px; top:0; width: 380px; height: 100vh; background: #12141a; border-left: 1px solid #242a38; padding: 2rem; z-index: 200; display: flex; flex-direction: column; transition: right 0.3s ease; box-shadow: -10px 0 30px rgba(0,0,0,0.8); }
.cart-drawer.open { right: 0; }
.cart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid #242a38; padding-bottom: 1rem; }
.cart-header button { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; }
.cart-items { flex: 1; overflow-y: auto; }
.empty-msg { color: #64748b; font-size: 0.9rem; text-align: center; margin-top: 3rem; }
.cart-item-row { display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.8rem; border-bottom: 1px solid #1c212d; }
.cart-footer { border-top: 1px solid #242a38; padding-top: 1.5rem; }
.total-row { display: flex; justify-content: space-between; font-weight: 700; margin-bottom: 1rem; }
.checkout-btn { width: 100%; background: #00e5ff; color: #000; border: none; padding: 1rem; font-weight: 800; cursor: pointer; letter-spacing: 1px; }
.footer { text-align: center; padding: 3rem; border-top: 1px solid #202430; color: #64748b; font-size: 0.85rem; }`,
    js: `let cart = [];
function toggleCart() {
  document.getElementById('cart-drawer').classList.toggle('open');
}
function addToCart(title, price) {
  cart.push({ title, price });
  renderCart();
  document.getElementById('cart-drawer').classList.add('open');
}
function renderCart() {
  const container = document.getElementById('cart-items');
  const countEl = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('subtotal');
  countEl.innerText = cart.length;
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-msg">Your bag is empty.</p>';
    subtotalEl.innerText = '$0.00';
    return;
  }
  let total = 0;
  container.innerHTML = cart.map((item, idx) => {
    total += item.price;
    return '<div class="cart-item-row"><div><strong>' + item.title + '</strong><br><small>$' + item.price.toFixed(2) + '</small></div><button onclick="removeItem(' + idx + ')" style="background:none;border:none;color:#ef4444;cursor:pointer;">✕</button></div>';
  }).join('');
  subtotalEl.innerText = '$' + total.toFixed(2);
}
function removeItem(idx) {
  cart.splice(idx, 1);
  renderCart();
}
function checkout() {
  if (cart.length === 0) return alert("Please add an item to your bag first!");
  alert("Redirecting to secure Hostbanger payment gateway. Demo transaction simulation active.");
}`
  },
  {
    id: 'tpl-blog',
    name: 'The Pulse Tech & Culture Daily',
    category: 'Blog',
    description: 'Modern editorial magazine and tech journalism portal with featured lead stories, category chips, reading time, and newsletter.',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
    features: ['Breaking Story Carousel', 'Estimated Reading Time', 'Author Bylines & Bios', 'Newsletter Lead Magnet', 'Tag Filtering'],
    isPopular: false,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Pulse | Frontiers of Technology & Culture</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="blog-body">
  <header class="blog-header">
    <div class="top-bar">
      <span>EDITION: GLOBAL • WEDNESDAY, 2026</span>
      <span>TRENDING: QUANTUM REASONING • SPATIAL OS</span>
    </div>
    <div class="masthead">
      <h1>THE PULSE</h1>
      <p class="tagline">IN-DEPTH REPORTING ON ARTIFICIAL INTELLIGENCE, BIOTECH & SILICON FOUNDRIES</p>
    </div>
    <nav class="blog-nav">
      <a href="#">AI & COMPUTING</a>
      <a href="#">BIOLOGY</a>
      <a href="#">HARDWARE</a>
      <a href="#">VENTURE</a>
      <a href="#">ESSAYS</a>
    </nav>
  </header>

  <main class="main-content">
    <article class="featured-story">
      <div class="story-category">FEATURE INVESTIGATION • 8 MIN READ</div>
      <h2>The 2-Nanometer Transition: How Global Foundries Rewrote Chip Physics</h2>
      <p class="lead">Inside the hermetically sealed cleanrooms where Extreme Ultraviolet lithography entered the sub-atomic realm, fundamentally reshaping machine intelligence economics.</p>
      <div class="author-meta">By <strong>Marcus Sterling</strong>, Chief Technology Correspondent</div>
    </article>

    <div class="stories-grid">
      <article class="card">
        <span class="badge">BIOTECH</span>
        <h3>Protein Folding Models Unlock 400 New Enzymes for Plastic Degradation</h3>
        <p>A global research coalition confirms molecular synthesis benchmarks exceeding initial forecast models.</p>
        <div class="meta">4 min read • Oct 28, 2026</div>
      </article>

      <article class="card">
        <span class="badge">INFRASTRUCTURE</span>
        <h3>Why Cloud Data Centers Are Moving to Fusion & Geothermal Microgrids</h3>
        <p>Gigawatt-scale power demands are forcing hypescalers to build captive zero-emission power plants.</p>
        <div class="meta">6 min read • Oct 27, 2026</div>
      </article>

      <article class="card">
        <span class="badge">CULTURE</span>
        <h3>The Rise of Ambient Computing in Scandinavian Workspaces</h3>
        <p>Screens are fading into architectural textures as spatial voice agents take center stage.</p>
        <div class="meta">5 min read • Oct 26, 2026</div>
      </article>
    </div>

    <section class="newsletter">
      <h3>GET THE DAILY BRIEFING IN YOUR INBOX</h3>
      <p>Join 85,000 engineers, researchers, and venture capitalists every weekday morning.</p>
      <form onsubmit="subscribe(event)" class="news-form">
        <input type="email" placeholder="Enter work email..." required id="sub-email">
        <button type="submit">SUBSCRIBE</button>
      </form>
    </section>
  </main>

  <footer class="footer">
    <p>© 2026 The Pulse Media Group. Hosted with blazing-fast edge cache on HOSTBANGER.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
    css: `* { margin:0; padding:0; box-sizing:border-box; }
body.blog-body { background: #fbfbfd; color: #1c1d21; font-family: 'Inter', sans-serif; line-height: 1.6; }
.blog-header { border-bottom: 2px solid #1c1d21; max-width: 1100px; margin: 0 auto; padding: 1.5rem 1rem 0; }
.top-bar { display: flex; justify-content: space-between; font-size: 0.75rem; font-weight: 600; color: #6b7280; letter-spacing: 1px; padding-bottom: 1rem; border-bottom: 1px solid #e5e7eb; }
.masthead { text-align: center; padding: 2.5rem 0 1.5rem; }
.masthead h1 { font-family: 'Newsreader', serif; font-size: 4.2rem; font-weight: 700; letter-spacing: -1px; }
.tagline { font-size: 0.75rem; letter-spacing: 2px; color: #4b5563; font-weight: 600; margin-top: 0.5rem; }
.blog-nav { display: flex; justify-content: center; gap: 2.5rem; padding: 1rem 0; font-size: 0.85rem; font-weight: 700; letter-spacing: 1px; }
.blog-nav a { color: #1c1d21; text-decoration: none; }
.blog-nav a:hover { text-decoration: underline; }
.main-content { max-width: 1100px; margin: 0 auto; padding: 3rem 1rem; }
.featured-story { border-bottom: 1px solid #e5e7eb; padding-bottom: 3rem; margin-bottom: 3rem; }
.story-category { font-size: 0.8rem; font-weight: 700; color: #2563eb; letter-spacing: 1px; margin-bottom: 1rem; }
.featured-story h2 { font-family: 'Newsreader', serif; font-size: 3rem; line-height: 1.15; margin-bottom: 1rem; }
.lead { font-size: 1.35rem; color: #4b5563; line-height: 1.6; margin-bottom: 1.5rem; font-family: 'Newsreader', serif; }
.author-meta { font-size: 0.9rem; color: #6b7280; }
.stories-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; margin-bottom: 4rem; }
.card { border-top: 1px solid #1c1d21; padding-top: 1.5rem; }
.badge { display: inline-block; font-size: 0.7rem; font-weight: 700; color: #2563eb; letter-spacing: 1px; margin-bottom: 0.6rem; }
.card h3 { font-family: 'Newsreader', serif; font-size: 1.6rem; line-height: 1.3; margin-bottom: 0.8rem; }
.card p { font-size: 0.95rem; color: #4b5563; margin-bottom: 1rem; }
.meta { font-size: 0.8rem; color: #9ca3af; font-weight: 500; }
.newsletter { background: #111827; color: #fff; padding: 3.5rem; border-radius: 8px; text-align: center; }
.newsletter h3 { font-family: 'Newsreader', serif; font-size: 2.2rem; margin-bottom: 0.8rem; }
.newsletter p { color: #9ca3af; margin-bottom: 2rem; font-size: 1.05rem; }
.news-form { display: flex; justify-content: center; gap: 0.8rem; max-width: 500px; margin: 0 auto; }
.news-form input { flex: 1; padding: 0.8rem 1.2rem; border-radius: 4px; border: none; font-size: 0.95rem; }
.news-form button { background: #2563eb; color: #fff; border: none; padding: 0.8rem 1.8rem; font-weight: 700; border-radius: 4px; cursor: pointer; }
.footer { text-align: center; padding: 3rem; color: #9ca3af; font-size: 0.85rem; border-top: 1px solid #e5e7eb; }`,
    js: `function subscribe(e) {
  e.preventDefault();
  const val = document.getElementById('sub-email').value;
  alert('Thank you for subscribing, ' + val + '! Confirmed on HOSTBANGER Edge.');
  document.getElementById('sub-email').value = '';
}`
  },
  {
    id: 'tpl-landing',
    name: 'NovaFlow AI Cloud Engine',
    category: 'Landing Page',
    description: 'High-converting dark SaaS landing page featuring live code snippet tabs, pricing matrix, and interactive feature tours.',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    features: ['Interactive Tabbed Code Snippet', 'Feature Showcase with Glow Effects', 'Tiered Pricing Table', 'Customer Logos Ribbon', 'Fast CTA Form'],
    isPopular: true,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NovaFlow | Next-Generation AI Pipeline Engine</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="saas-body">
  <nav class="nav">
    <div class="logo">⚡ NovaFlow</div>
    <div class="nav-links">
      <a href="#features">Features</a>
      <a href="#benchmark">Benchmarks</a>
      <a href="#pricing">Pricing</a>
      <a href="#docs">Docs</a>
    </div>
    <a href="#cta" class="nav-cta">Start Free Trial</a>
  </nav>

  <header class="hero">
    <div class="pill">🚀 NOVAPRO V4 ENGINE RELEASED</div>
    <h1>The High-Throughput AI Pipeline for Modern Engineers</h1>
    <p>Orchestrate multi-agent workflows, stream vector embeddings, and deploy serverless fine-tuned endpoints in under 45 seconds.</p>
    <div class="cta-row">
      <button class="primary-btn" onclick="startTrial()">Deploy Your First Flow</button>
      <button class="secondary-btn" onclick="openDocs()">Read Architecture Whitepaper</button>
    </div>
  </header>

  <section id="features" class="features">
    <div class="container">
      <h2 class="title">Engineered for Extreme Latency Sensitivity</h2>
      <div class="grid">
        <div class="feature-card">
          <div class="badge">99.999% SLA</div>
          <h3>Sub-12ms Edge Gateway</h3>
          <p>Global multi-region routing across 320 points of presence with automatic failover and TLS session resumption.</p>
        </div>
        <div class="feature-card">
          <div class="badge">DISTRIBUTED</div>
          <h3>Serverless Vector Sharding</h3>
          <p>Scale cosine similarity and ANN lookups across billions of high-dimensional vectors with zero cold starts.</p>
        </div>
        <div class="feature-card">
          <div class="badge">COMPLIANT</div>
          <h3>Enterprise Cryptographic Vault</h3>
          <p>Hardware-enforced confidential computing, SOC2 Type II audited, and zero data retention guarantees.</p>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 NovaFlow Systems Inc. Hosted on HOSTBANGER high-availability cloud cluster.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
    css: `* { margin:0; padding:0; box-sizing:border-box; }
body.saas-body { background: #0b0f19; color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1.6; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 4rem; border-bottom: 1px solid #1e293b; background: rgba(11,15,25,0.85); backdrop-filter: blur(12px); position: sticky; top:0; z-index: 100; }
.logo { font-size: 1.4rem; font-weight: 800; color: #38bdf8; }
.nav-links a { color: #94a3b8; text-decoration: none; margin: 0 1.2rem; font-weight: 600; font-size: 0.95rem; }
.nav-links a:hover { color: #fff; }
.nav-cta { background: #38bdf8; color: #0b0f19; padding: 0.6rem 1.4rem; border-radius: 6px; font-weight: 700; text-decoration: none; }
.hero { padding: 6rem 2rem 5rem; text-align: center; max-width: 900px; margin: 0 auto; }
.pill { display: inline-block; padding: 0.4rem 1rem; background: rgba(56,189,248,0.1); border: 1px solid rgba(56,189,248,0.3); color: #38bdf8; border-radius: 999px; font-size: 0.8rem; font-weight: 700; margin-bottom: 2rem; }
h1 { font-size: 3.6rem; font-weight: 800; line-height: 1.15; margin-bottom: 1.5rem; letter-spacing: -0.5px; }
.hero p { font-size: 1.25rem; color: #94a3b8; margin-bottom: 2.5rem; }
.cta-row { display: flex; justify-content: center; gap: 1rem; }
.primary-btn { background: #38bdf8; color: #0b0f19; border: none; padding: 0.9rem 2rem; font-size: 1rem; font-weight: 700; border-radius: 6px; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
.primary-btn:hover { transform: translateY(-2px); box-shadow: 0 0 25px rgba(56,189,248,0.4); }
.secondary-btn { background: #1e293b; color: #f8fafc; border: 1px solid #334155; padding: 0.9rem 2rem; font-size: 1rem; font-weight: 600; border-radius: 6px; cursor: pointer; }
.features { padding: 5rem 2rem; }
.container { max-width: 1200px; margin: 0 auto; }
.title { text-align: center; font-size: 2.4rem; font-weight: 800; margin-bottom: 4rem; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2rem; }
.feature-card { background: #13192b; border: 1px solid #1e293b; padding: 2.5rem; border-radius: 12px; }
.badge { display: inline-block; color: #38bdf8; font-size: 0.75rem; font-weight: 800; margin-bottom: 1rem; }
.feature-card h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 0.8rem; }
.feature-card p { color: #94a3b8; font-size: 1rem; }
.footer { text-align: center; padding: 3rem; border-top: 1px solid #1e293b; color: #64748b; font-size: 0.85rem; }`,
    js: `function startTrial() {
  alert("Creating instant NovaFlow developer sandbox via HOSTBANGER cloud runner.");
}
function openDocs() {
  alert("NovaFlow documentation opened.");
}`
  },
  {
    id: 'tpl-edu',
    name: 'QuantumAcademy Masterclasses',
    category: 'Educational',
    description: 'Interactive online course and certification academy featuring syllabus breakdown, video player placeholders, and student enrollments.',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
    features: ['Curriculum Accordion Modules', 'Instructor Credentials & Research', 'Certificate Preview Badge', 'Live Student Q&A Feed', 'Enrollment Flow'],
    isPopular: false,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuantumAcademy | Advanced Computing & Applied Physics</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body class="edu-body">
  <nav class="nav">
    <div class="logo">⚛️ QUANTUM ACADEMY</div>
    <div class="links">
      <a href="#courses">Courses</a>
      <a href="#faculty">Faculty</a>
      <a href="#certification">Certification</a>
    </div>
    <button class="enroll-btn" onclick="enroll()">Enroll Now</button>
  </nav>

  <header class="hero">
    <span class="tag">ACCREDITED PROFESSIONAL CERTIFICATION</span>
    <h1>Master Quantum Information Science & Quantum Algorithms</h1>
    <p>Comprehensive 12-week intensive designed by MIT and CERN researchers. Build and execute real quantum circuits on Qiskit and IonQ backends.</p>
  </header>

  <section id="courses" class="syllabus container">
    <h2>Course Curriculum & Modules</h2>
    <div class="module-card">
      <span class="week">WEEK 01-03</span>
      <h3>Foundations of Quantum Superposition & Entanglement</h3>
      <p>Hilbert spaces, Dirac notation, qubit states, bloch sphere geometry, and Bell state experiments.</p>
    </div>
    <div class="module-card">
      <span class="week">WEEK 04-07</span>
      <h3>Quantum Algorithms: Shor, Grover & Quantum Fourier Transform</h3>
      <p>Algorithmic speedups, phase estimation, quantum circuit synthesis, and fault-tolerant noise mitigation.</p>
    </div>
    <div class="module-card">
      <span class="week">WEEK 08-12</span>
      <h3>Quantum Machine Learning & Variational Quantum Eigensolvers</h3>
      <p>Parameterized quantum circuits, hybrid classical-quantum optimization, and drug discovery modeling.</p>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 QuantumAcademy Consortium. Powered by HOSTBANGER Education Hosting.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
    css: `* { margin:0; padding:0; box-sizing:border-box; }
body.edu-body { background: #0a0d14; color: #f1f5f9; font-family: 'Inter', sans-serif; line-height: 1.6; }
.nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; border-bottom: 1px solid #1e293b; }
.logo { font-weight: 800; font-size: 1.25rem; color: #a855f7; }
.links a { color: #94a3b8; text-decoration: none; margin: 0 1rem; font-weight: 500; }
.enroll-btn { background: #a855f7; color: #fff; border: none; padding: 0.6rem 1.4rem; border-radius: 6px; font-weight: 700; cursor: pointer; }
.hero { padding: 5rem 2rem 4rem; text-align: center; max-width: 850px; margin: 0 auto; }
.tag { color: #a855f7; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; display: inline-block; margin-bottom: 1rem; }
h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1.2rem; }
.hero p { color: #94a3b8; font-size: 1.15rem; }
.container { max-width: 900px; margin: 0 auto; padding: 2rem; }
.syllabus h2 { font-size: 2rem; margin-bottom: 2rem; text-align: center; }
.module-card { background: #121624; border: 1px solid #1e293b; padding: 2rem; border-radius: 8px; margin-bottom: 1.5rem; }
.week { color: #a855f7; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; }
.module-card h3 { font-size: 1.3rem; margin: 0.4rem 0 0.8rem; }
.module-card p { color: #94a3b8; }
.footer { text-align: center; padding: 3rem; color: #64748b; font-size: 0.85rem; border-top: 1px solid #1e293b; }`,
    js: `function enroll() {
  alert("Enrollment modal opened for Quantum Information Science track. Hosted on HOSTBANGER.");
}`
  },
  {
    id: 'tpl-entertainment',
    name: 'NeonSound Underground Festival',
    category: 'Entertainment',
    description: 'Immersive festival and entertainment experience with artist lineup cards, ticket tier checkout, Spotify audio player mock, and venue guide.',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    features: ['Headliner Artist Lineup Cards', 'Multi-tier Ticket Reservation', 'Interactive Venue Map Guide', 'Music Player Bar', 'Festival Countdown Timer'],
    isPopular: false,
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NeonSound 2026 | Electronic Music & Light Festival</title>
  <link rel="stylesheet" href="style.css">
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Plus+Jakarta+Sans:wght@500;700&display=swap" rel="stylesheet">
</head>
<body class="fest-body">
  <header class="hero">
    <div class="top-date">AUGUST 14 - 17, 2026 • REYKJAVIK HARBOR ARENA</div>
    <h1>NEON<span class="glow">SOUND</span></h1>
    <p class="sub">3 DAYS • 60 ARTISTS • 4 IMMERSIVE HOLOGRAPHIC STAGES</p>
    <button class="ticket-btn" onclick="getTickets()">SECURE FESTIVAL WRISTBAND</button>
  </header>

  <section class="lineup container">
    <h2>HEADLINER LINEUP</h2>
    <div class="lineup-grid">
      <div class="artist">AURORA CORE</div>
      <div class="artist">CYBERKIDD</div>
      <div class="artist">SYNAPSE ECHO</div>
      <div class="artist">KROMA RESONANCE</div>
      <div class="artist">VALKYRIE DNB</div>
      <div class="artist">SUB-ZERO BASS</div>
    </div>
  </section>

  <footer class="footer">
    <p>© 2026 NeonSound Arts Foundation. Engineered & hosted on HOSTBANGER Cloud.</p>
  </footer>
  <script src="script.js"></script>
</body>
</html>`,
    css: `* { margin:0; padding:0; box-sizing:border-box; }
body.fest-body { background: #050508; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; }
.hero { padding: 6rem 1rem; background: radial-gradient(circle at 50% 50%, rgba(236,72,153,0.2) 0%, rgba(99,102,241,0.2) 50%, transparent 80%); }
.top-date { color: #f43f5e; font-weight: 700; letter-spacing: 2px; font-size: 0.85rem; margin-bottom: 1rem; }
h1 { font-family: 'Syne', sans-serif; font-size: 5rem; letter-spacing: 2px; line-height: 1; }
.glow { color: #ec4899; text-shadow: 0 0 30px #ec4899; }
.sub { color: #94a3b8; font-size: 1rem; margin: 1.5rem 0 2.5rem; letter-spacing: 1px; }
.ticket-btn { background: linear-gradient(45deg, #ec4899, #8b5cf6); color: #fff; border: none; padding: 1rem 2.5rem; font-size: 1.1rem; font-weight: 800; border-radius: 999px; cursor: pointer; }
.container { max-width: 1000px; margin: 0 auto; padding: 4rem 2rem; }
.lineup h2 { font-family: 'Syne', sans-serif; font-size: 2.2rem; margin-bottom: 2rem; }
.lineup-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; }
.artist { background: #11111a; border: 1px solid #232338; padding: 2rem; font-family: 'Syne', sans-serif; font-size: 1.3rem; border-radius: 8px; color: #e2e8f0; }
.artist:hover { border-color: #ec4899; color: #ec4899; }
.footer { padding: 3rem; color: #64748b; font-size: 0.85rem; border-top: 1px solid #1a1a28; }`,
    js: `function getTickets() {
  alert("Redirecting to NeonSound ticket tier selection. VIP & General Admission hosted by HOSTBANGER.");
}`
  }
];

export const HOSTING_PLANS: import('../types').HostingPlan[] = [
  {
    id: 'free',
    name: 'FREE HOSTING PLAN',
    priceMonthly: 0,
    priceYearly: 0,
    tagline: 'Create Free. Host Free. Go Online. No payment information required.',
    isPopular: true,
    features: {
      freePublishing: 'Free Cloudflare Pages Static Hosting',
      freeSubdomain: 'Free *.pages.dev & *.hostbanger.app Subdomains',
      cloudflarePages: true,
      githubPages: true,
      storage: '500 MB Free Storage Quota',
      bandwidth: '100 GB Monthly Bandwidth Limit',
      aiCredits: '15 AI Generations / month',
      customDomain: false,
      freeSSL: true,
      backups: 'Weekly Auto Snapshots',
      support: 'Standard Community Support',
      advancedCodeEditor: true
    }
  },
  {
    id: 'pro',
    name: 'PRO CREATOR',
    priceMonthly: 4.99,
    priceYearly: 49.00,
    tagline: 'For creators & businesses needing custom domains and expanded AI quota.',
    features: {
      freePublishing: 'Unlimited Static & API Projects',
      freeSubdomain: 'Free Subdomains + Custom Domains',
      cloudflarePages: true,
      githubPages: true,
      storage: '25 GB High-Speed NVMe Storage',
      bandwidth: '500 GB Edge Bandwidth',
      aiCredits: '150 AI Generations / month',
      customDomain: true,
      freeSSL: true,
      backups: 'Daily Automatic Snapshots',
      support: 'Priority Chat & Email Support',
      advancedCodeEditor: true
    }
  },
  {
    id: 'business',
    name: 'ENTERPRISE',
    priceMonthly: 12.99,
    priceYearly: 129.00,
    tagline: 'Maximum power, white-glove deployment, and team collaboration.',
    features: {
      freePublishing: 'Unlimited High-Traffic Sites',
      freeSubdomain: 'Custom Domains + Wildcard SSL',
      cloudflarePages: true,
      githubPages: true,
      storage: '100 GB NVMe Storage',
      bandwidth: 'Unlimited Global CDN',
      aiCredits: 'Unlimited AI Generations',
      customDomain: true,
      freeSSL: true,
      backups: 'On-Demand Realtime Backups',
      support: 'Dedicated Technical Account Manager',
      advancedCodeEditor: true
    }
  }
];
