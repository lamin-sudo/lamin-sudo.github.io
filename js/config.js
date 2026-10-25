/* ==========================================================================
   SITE CONFIG — the only file you need to edit to make this site yours.
   Nothing below changes the design, the effects, the photos or the music.
   ========================================================================== */

const SITE = {
  nick: "Lamin",
  tag: "full-stack developer",
  headline: "Code Alchemist",
  blurb: "I turn ideas into living software — blending logic, design and a little alchemy.",
  foot: "lamin · press ` for terminal",
  url: "https://hadji.is-a.dev/",
  description: "Lamin — Full-Stack Developer. Android, web and AI products shipped end to end."
};

/* Set false to skip the "click to enter" gate entirely. */
const ENTER_SCREEN = true;

/* The two buttons under the profile rows. */
const GITHUB_USER = "lamin-sudo";
const EMAIL = "lamindzru@gmail.com";

/* Card rows. Keep EXACTLY 6: css/style.css staggers their entrance with
   nth-child(1..6) delays, so a 7th row would animate out of sync.
   `auto` is filled at runtime, `copy` makes the row click-to-copy. */
const ROWS = [
  { k: "name",     v: "Lamin" },
  { k: "role",     v: "full-stack developer" },
  { k: "stack",    v: "js · react · node" },
  { k: "projects", v: "", auto: "projects" },
  { k: "langs",    v: "ar · en · fr" },
  { k: "email",    v: EMAIL, copy: true }
];

/* Everything shown in the contact panel. `icon` must match an entry in
   js/panels.js ICONS, or leave it out for a plain text button. */
const SOCIALS = [
  { label: "GitHub",   icon: "github",   href: "https://github.com/lamin-sudo",              sub: "github.com/lamin-sudo" },
  { label: "Email",    icon: "mail",     href: "mailto:lamindzru@gmail.com",                 sub: "lamindzru@gmail.com", copy: EMAIL },
  { label: "Facebook", icon: "facebook", href: "https://www.facebook.com/laminechouiha17",    sub: "laminechouiha17" }
];

/* Paste a Formspree / Web3Forms endpoint here to activate the contact form.
   While it is empty the form stays hidden and only direct links are shown. */
const FORM_ENDPOINT = "";

/* --------------------------------------------------------------------------
   PROJECTS
   Optional fields: repo, shot, year, stack.
   `shot` — drop a screenshot into assets/shots/ and put its path here;
            the card grows a framed preview using the site's own .ph style.
            Leave it as "" for the typographic card (no image needed).
   -------------------------------------------------------------------------- */
const PROJECTS = [
  {
    name: "Noor Al-Quran",
    alt: "نور القرآن",
    desc: "Full offline Quran with prayer times, Adhan and Athkar.",
    tags: ["Android", "Quran", "Offline-first"],
    live: "https://noor-quran.web.app/",
    repo: "",
    shot: ""
  },
  {
    name: "Mellora",
    alt: "ميلورا",
    desc: "Algerian women's marketplace with a royal rewards club.",
    tags: ["Marketplace", "Supabase", "Web"],
    live: "https://mellora.web.app/",
    repo: "",
    shot: ""
  },
  {
    name: "Rafiq Al-Dawa",
    alt: "رفيق الدواء",
    desc: "Smart medicine manager with dose reminders and family tracking.",
    tags: ["Android", "Health", "Reminders"],
    live: "https://rafiq-aldawa.web.app/",
    repo: "",
    shot: ""
  },
  {
    name: "DevCloud / Sahab",
    alt: "",
    desc: "Developer cloud with code workspace, AI assistant and live preview.",
    tags: ["Cloud", "Vercel", "AI"],
    live: "https://sahab-cloud.vercel.app/",
    repo: "",
    shot: ""
  },
  {
    name: "GSM-DZ",
    alt: "",
    desc: "Blog for mobile repair tools, firmware and flashing utilities.",
    tags: ["Blog", "Tools", "Repair"],
    live: "https://dz-gsmdz.blogspot.com/",
    repo: "",
    shot: ""
  }
];

/* --------------------------------------------------------------------------
   SKILLS — grouped chip lists. Add or remove groups freely.
   -------------------------------------------------------------------------- */
const SKILL_GROUPS = [
  { k: "i love",     v: ["Programming", "AI", "Web Development"] },
  { k: "learning",   v: ["JavaScript", "React", "Node.js"] },
  { k: "i can do",   v: ["Web Development", "Databases", "Git"] },
  { k: "languages",  v: ["Arabic", "English", "French"] }
];

/* --------------------------------------------------------------------------
   JOURNEY — timeline entries, newest last.
   -------------------------------------------------------------------------- */
const JOURNEY = [
  { year: "2023", title: "First Line of Code", text: "Fell in love with programming." },
  { year: "2024", title: "Web & Git",          text: "Built sites, learned databases and version control." },
  { year: "2025", title: "JS · React · Node",  text: "Went deep on the modern JavaScript stack." },
  { year: "2026", title: "Full-Stack & AI",    text: "Shipping end-to-end products, exploring AI." }
];

/* Path to your CV, relative to index.html. Leave "" to hide every CV button. */
const CV_URL = "";

/* --------------------------------------------------------------------------
   UI TEXT
   -------------------------------------------------------------------------- */
const STRINGS = {
  enterCta: "click to enter",
  enterCtaTouch: "tap to enter",
  enterSub: "full-stack developer",
  nowPlaying: "now playing",
  projects: "projects",
  skills: "skills",
  about: "about",
  contact: "contact",
  close: "close",
  live: "live",
  repo: "code",
  downloadCv: "download cv",
  printCv: "print / save as pdf",
  copied: "copied",
  copyHint: "click to copy",
  journey: "journey",
  sendMessage: "send message",
  sending: "sending…",
  sent: "message sent",
  sendFail: "send failed — email me directly",
  formName: "your name",
  formEmail: "your email",
  formBody: "message",
  formNote: "or reach me directly —",
  noProjects: "nothing here yet",
  musicFailedTitle: "music did not load",
  musicFailedArtist: "the assets folder must sit next to index.html",
  musicHint: "click anywhere to enable sound"
};

/* ==========================================================================
   PHOTOS — the 19 images that rotate through the 16 scattered frames.
   Swap the files inside assets/photos/ (keep the same names) to make the
   gallery yours. No code change needed.
   ========================================================================== */
const PHOTOS = [
  "assets/photos/01.jpg",
  "assets/photos/02.jpg",
  "assets/photos/03.jpg",
  "assets/photos/04.jpg",
  "assets/photos/05.jpg",
  "assets/photos/06.jpg",
  "assets/photos/07.jpg",
  "assets/photos/08.jpg",
  "assets/photos/09.jpg",
  "assets/photos/10.jpg",
  "assets/photos/11.jpg",
  "assets/photos/12.jpg",
  "assets/photos/13.jpg",
  "assets/photos/14.jpg",
  "assets/photos/15.jpg",
  "assets/photos/16.jpg",
  "assets/photos/17.jpg",
  "assets/photos/18.jpg",
  "assets/photos/19.jpg"
];

/* ==========================================================================
   MUSIC — HOW TO ADD A TRACK (clean, 3 steps, no code touched)

   1. Drop the file in  assets/music/        →  assets/music/09.mp3
   2. Drop its cover in assets/music/covers/ →  assets/music/covers/09.jpg
      (optional — skip it and the player shows its equalizer bars instead)
   3. Add ONE line to the array below:

      { title: "track name", artist: "artist name",
        src: "assets/music/09.mp3", cover: "assets/music/covers/09.jpg" },

   That is all. The player picks it up immediately: shuffle, queue, cover,
   progress bar and the phone's lock-screen controls all read from here.

   Notes
   • Order does not matter — playback is always shuffled.
   • No cover? Use  cover: ""  and the bars animation takes over.
   • Keep MP3 for widest browser support; ~2-4 MB per track is a good target.
   • Files are served straight from your repo, so nothing else to configure.
   ========================================================================== */
const TRACKS = [
  { title: "небесная твердь", artist: "#меланхолик", src: "assets/music/01.mp3", cover: "assets/music/covers/01.jpg" },
  { title: "странный дом", artist: "#меланхолик", src: "assets/music/02.mp3", cover: "assets/music/covers/02.jpg" },
  { title: "drollXD", artist: "DJ UNIVXRSEL", src: "assets/music/03.mp3", cover: "assets/music/covers/03.jpg" },
  { title: "ex-freundin - slowed + instrumental", artist: "Luu", src: "assets/music/04.mp3", cover: "assets/music/covers/04.jpg" },
  { title: "phonkday", artist: "cxldwind", src: "assets/music/05.mp3", cover: "assets/music/covers/05.jpg" },
  { title: "type london", artist: "onda andar", src: "assets/music/06.mp3", cover: "assets/music/covers/06.jpg" },
  { title: "наше прошлое лето", artist: "vecher", src: "assets/music/07.mp3", cover: "assets/music/covers/07.jpg" },
  { title: "Девочка с каре (Piano)", artist: "МУККА", src: "assets/music/08.mp3", cover: "assets/music/covers/08.jpg" }
];
