export const ASSET_BASE = `${import.meta.env.BASE_URL}assets`;

export const categories = [
  "All",
  "Case Study",
  "TVC",
  "Social Post",
  "Animatic",
  "AI Video",
];

export const initialProjects = [
  {
    id: "samsung-voices-of-galaxy",
    title: "Samsung Voices of Galaxy MMA",
    category: "Case Study",
    client: "Prodigious, Publicis Groupe",
    year: "2026",
    role: "Video Editing · Motion Graphics",
    image: `${ASSET_BASE}/case-study.png`,
    videoUrl: "",
    featured: true,
    published: true,
    description:
      "A campaign case study shaped around human stories, platform momentum and a precise editorial rhythm.",
  },
  {
    id: "nescafe-tet-corporation",
    title: "NESCAFÉ Tết Corporation — YouTube Awards",
    category: "TVC",
    client: "Prodigious, Publicis Groupe",
    year: "2026",
    role: "Offline Editing · Finishing",
    image: `${ASSET_BASE}/tvc.png`,
    videoUrl: "",
    featured: true,
    published: true,
    description:
      "A warm seasonal film balancing brand storytelling, product detail and celebratory energy.",
  },
  {
    id: "nescafe-tet",
    title: "NESCAFÉ Tết — YouTube Awards",
    category: "Social Post",
    client: "Prodigious, Publicis Groupe",
    year: "2026",
    role: "Social-first Editing · Motion",
    image: `${ASSET_BASE}/social.png`,
    videoUrl: "",
    featured: true,
    published: true,
    description:
      "A modular social campaign built for fast hooks, clear product moments and adaptable cutdowns.",
  },
  {
    id: "nescafe-cafe-viet",
    title: "NESCAFÉ Café Việt — YouTube Awards",
    category: "Animatic",
    client: "Prodigious, Publicis Groupe",
    year: "2026",
    role: "Animatic Editing · Sound Design",
    image: `${ASSET_BASE}/animatic.png`,
    videoUrl: "",
    featured: true,
    published: true,
    description:
      "An animatic that turns boards and timing into a persuasive, production-ready visual narrative.",
  },
  {
    id: "mitsubishi-destinator",
    title: "Mitsubishi Destinator MMA",
    category: "AI Video",
    client: "Prodigious, Publicis Groupe",
    year: "2026",
    role: "AI-assisted Visuals · Compositing",
    image: `${ASSET_BASE}/ai-video.png`,
    videoUrl: "",
    featured: true,
    published: true,
    description:
      "A future-facing visual exploration combining generated imagery, compositing and cinematic motion.",
  },
];

export const services = [
  {
    name: "Case Study",
    eyebrow: "Strategy into story",
    copy: "Turn complex campaigns into clear films that reveal the thinking, craft and result.",
    image: `${ASSET_BASE}/case-study.png`,
    deliverables: ["Story structure", "Interview edit", "Motion graphics", "Final polish"],
  },
  {
    name: "TVC",
    eyebrow: "Craft every second",
    copy: "Commercial edits with strong pacing, precise product moments and premium finishing.",
    image: `${ASSET_BASE}/tvc.png`,
    deliverables: ["Offline edit", "Versioning", "Color coordination", "Sound polish"],
  },
  {
    name: "Social Post",
    eyebrow: "Built for the feed",
    copy: "Fast, platform-aware content designed to hook early and stay visually coherent.",
    image: `${ASSET_BASE}/social.png`,
    deliverables: ["Short-form edits", "Cutdowns", "Motion toolkit", "Multi-format delivery"],
  },
  {
    name: "Animatic",
    eyebrow: "Ideas before production",
    copy: "Boards, timing and sound assembled into a film that teams can align around.",
    image: `${ASSET_BASE}/animatic.png`,
    deliverables: ["Board edit", "Timing pass", "Temp sound", "Client revisions"],
  },
  {
    name: "AI Video",
    eyebrow: "New tools, human taste",
    copy: "AI-assisted visuals shaped through art direction, compositing and editorial judgment.",
    image: `${ASSET_BASE}/ai-video.png`,
    deliverables: ["Visual development", "Generation", "Compositing", "Editorial finish"],
  },
];
