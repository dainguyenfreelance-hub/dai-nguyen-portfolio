import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import { ASSET_BASE, initialProjects, services, workCategories } from "./data";
import ProductionAdmin from "./ProductionAdmin";
import {
  fetchPublishedProjects,
  fetchSiteSettings,
  youtubeThumbnail,
  youtubeVideoId,
} from "./supabase";

const ADMIN_EMAIL = "dainguyen.freelance@gmail.com";
// Slug kept as-is so older /work/showreel-2022 links keep resolving.
const SHOWREEL_SLUG = "showreel-2022";
const SHOWREEL_TITLE = "Showreel";
const SHOWREEL_URL = "https://www.youtube.com/watch?v=kqHpzNs8xEs";
const capabilities = [
  {
    id: "video-editing",
    number: "01",
    label: "Editorial mastery",
    title: "Video Editing",
    copy: "Complex stories shaped with clarity, rhythm and precision.",
    bullets: ["Multicam workflows", "Story edit", "Color + audio", "Final delivery"],
    image: `${ASSET_BASE}/capability-motion-graphics.webp`,
  },
  {
    id: "motion-graphic",
    number: "02",
    label: "Motion systems",
    title: "Motion Graphic",
    copy: "Advanced After Effects animation, compositing and visual systems.",
    bullets: ["Kinetic typography", "2D / 3D compositing", "Expressions + rigs"],
    image: `${ASSET_BASE}/capability-video-editing.webp`,
    reverse: true,
  },
  {
    id: "ai-content",
    number: "03",
    label: "Generative pipelines",
    title: "AI Content",
    copy: "Node-based image and video workflows for consistent campaign worlds.",
    bullets: [
      "Node-based workflows",
      "Image + video generation",
      "Upscale + detail control",
      "Consistency + art direction",
    ],
    image: `${ASSET_BASE}/capability-ai-content.webp`,
  },
  {
    id: "3d-product",
    number: "04",
    label: "Digital product craft",
    title: "3D Product",
    copy: "Highly detailed modeling, materials, lighting and animation with 3ds Max + V-Ray.",
    bullets: [
      "Product modeling",
      "Photorealistic materials",
      "Studio lighting",
      "CGI films + packshots",
    ],
    image: `${ASSET_BASE}/capability-3d-product.webp`,
    reverse: true,
  },
];

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    play: <path d="m9 7 8 5-8 5V7Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    phone: <path d="M7 4 5 6c0 7 6 13 13 13l2-2-4-3-2 2c-3-1-5-3-6-6l2-2-3-4Z" />,
    location: (
      <>
        <path d="M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    edit: (
      <>
        <path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z" />
        <path d="m14 7 3 3" />
      </>
    ),
    trash: (
      <>
        <path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    logout: (
      <>
        <path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="11" height="11" rx="2" />
        <path d="M16 8V5H5v11h3" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const navItems = [
    ["/", "Home"],
    ["/work", "Work"],
    ["/services", "Services"],
    ["/about", "About"],
    ["/contact", "Contact"],
  ];

  return (
    <header className="site-header">
      <Link className="brand" to="/" aria-label="Dai Nguyen home">
        <img src={`${ASSET_BASE}/logo.png`} alt="Dai Nguyen" />
      </Link>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        <Icon name={open ? "close" : "menu"} />
      </button>
      <nav className={open ? "main-nav is-open" : "main-nav"}>
        {navItems.map(([href, label]) => (
          <NavLink key={href} to={href} end={href === "/"}>
            {label}
          </NavLink>
        ))}
        <Link className="button button-small" to="/contact">
          Let&apos;s talk
        </Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Dai Nguyen</span>
      <span>Video editing · Motion · AI video</span>
    </footer>
  );
}

function GradientTitle({ children, compact = false }) {
  return <h1 className={compact ? "display-title compact" : "display-title"}>{children}</h1>;
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="cta-orb">
        <Icon name="mail" size={28} />
      </div>
      <div>
        <span className="eyebrow">Available for selected projects</span>
        <h2>Let&apos;s make something move.</h2>
        <p>Have a project in mind? Let&apos;s create something precise, memorable and alive.</p>
      </div>
      <Link className="text-link" to="/contact">
        Get in touch <Icon name="arrow" />
      </Link>
    </section>
  );
}

function ProjectCard({ project, onPlay }) {
  const isPlayable = Boolean(youtubeVideoId(project.videoUrl));

  return (
    <article className="project-card">
      <button
        className="project-thumb"
        type="button"
        onClick={() => isPlayable && onPlay(project)}
        aria-label={isPlayable ? `Play ${project.title}` : `${project.title} has no video`}
        disabled={!isPlayable}
      >
        <img src={project.image} alt={`${project.title} video thumbnail`} />
        {isPlayable && (
          <span className="play-button">
            <Icon name="play" size={26} />
          </span>
        )}
      </button>
      <div className="project-card-body">
        <span>{project.category}</span>
        <h3>
          <Link to={`/work/${project.id}`}>{project.title}</Link>
        </h3>
        <div className="project-meta">
          <small>{project.client}</small>
          <button type="button" onClick={() => onPlay(project)} disabled={!isPlayable}>
            {isPlayable ? "Play" : "Coming soon"}
            {isPlayable && <Icon name="play" size={16} />}
          </button>
        </div>
      </div>
    </article>
  );
}

function HeroShowreel({ project, label, onOpen, disabled }) {
  const videoId = youtubeVideoId(project?.videoUrl);
  const frameRef = useRef(null);
  const [muted, setMuted] = useState(true);

  if (!videoId) {
    return (
      <button className="hero-visual" type="button" onClick={onOpen} disabled={disabled}>
        <img src={project?.image} alt={`Selected campaign work: ${project?.title}`} />
        <div className="hero-visual-overlay">
          <span className="play-button large">
            <Icon name="play" size={32} />
          </span>
          <div>
            <small>{label}</small>
            <strong>{project?.title}</strong>
          </div>
        </div>
      </button>
    );
  }

  const sendCommand = (func, args = []) => {
    frameRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func, args }),
      "*",
    );
  };

  const toggleSound = () => {
    if (muted) {
      sendCommand("unMute");
      sendCommand("setVolume", [100]);
      sendCommand("playVideo");
    } else {
      sendCommand("mute");
    }
    setMuted(!muted);
  };

  const embedSrc =
    `https://www.youtube-nocookie.com/embed/${videoId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0` +
    `&modestbranding=1&playsinline=1&enablejsapi=1`;

  return (
    <figure className="hero-visual hero-visual-live">
      <div className="hero-visual-frame">
        <iframe
          ref={frameRef}
          key={videoId}
          src={embedSrc}
          title={`${project.title} — autoplaying preview`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      </div>
      <figcaption className="hero-visual-bar">
        <div>
          <small>{label}</small>
          <strong>{project.title}</strong>
        </div>
        <div className="hero-visual-actions">
          <button
            className="button button-quiet hero-mute"
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            aria-label={muted ? `Unmute ${project.title}` : `Mute ${project.title}`}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
          <button
            className="button button-quiet hero-mute"
            type="button"
            onClick={onOpen}
            aria-label={`Open ${project.title} in the full player`}
          >
            Full player
          </button>
        </div>
      </figcaption>
    </figure>
  );
}

function VideoModal({ projects, activeIndex, onChange, onClose }) {
  const project = activeIndex === null ? null : projects[activeIndex];
  const videoId = youtubeVideoId(project?.videoUrl);

  useEffect(() => {
    if (!project) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") {
        onChange((activeIndex - 1 + projects.length) % projects.length);
      }
      if (event.key === "ArrowRight") {
        onChange((activeIndex + 1) % projects.length);
      }
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, onChange, onClose, project, projects.length]);

  if (!project || !videoId) return null;

  const previous = () => onChange((activeIndex - 1 + projects.length) % projects.length);
  const next = () => onChange((activeIndex + 1) % projects.length);

  return (
    <div
      className="video-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="video-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${project.title} video player`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="video-modal-header">
          <div>
            <span className="eyebrow">{project.category}</span>
            <h2>{project.title}</h2>
          </div>
          <div className="video-modal-close">
            <span>ESC to close</span>
            <button type="button" onClick={onClose} aria-label="Close video">
              <Icon name="close" size={26} />
            </button>
          </div>
        </header>
        <div className="video-embed">
          <iframe
            key={videoId}
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1&playsinline=1`}
            title={project.title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
        <footer className="video-modal-footer">
          <div>
            <span>Project</span>
            <strong>{project.title}</strong>
          </div>
          <div>
            <span>Client</span>
            <strong>{project.client || "Dai Nguyen"}</strong>
          </div>
          <small>
            {String(activeIndex + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </small>
        </footer>
      </section>
      {projects.length > 1 && (
        <>
          <button
            className="video-nav previous"
            type="button"
            onClick={previous}
            aria-label="Previous video"
          >
            ←
          </button>
          <button className="video-nav next" type="button" onClick={next} aria-label="Next video">
            →
          </button>
        </>
      )}
    </div>
  );
}

function Home({ projects, siteSettings }) {
  const [videoIndex, setVideoIndex] = useState(null);
  const featured = projects.filter((project) => project.published && project.featured).slice(0, 4);
  const fallbackHeroProject = featured[0] ||
    projects.find((project) => project.published) || {
      id: "",
      title: "Dai Nguyen Portfolio",
      image: `${ASSET_BASE}/case-study.webp`,
    };
  const portfolioShowreel = projects.find(
    (project) =>
      project.published &&
      /showreel/i.test(project.title) &&
      Boolean(youtubeVideoId(project.videoUrl)),
  );
  const fallbackShowreel = {
    id: SHOWREEL_SLUG,
    title: SHOWREEL_TITLE,
    category: "Showreel",
    client: "Dai Nguyen",
    image: youtubeThumbnail(SHOWREEL_URL),
    videoUrl: SHOWREEL_URL,
    published: true,
  };
  const configuredShowreelId = youtubeVideoId(siteSettings.showreelUrl);
  const showreelProject = configuredShowreelId
    ? {
        ...(portfolioShowreel || {}),
        id: portfolioShowreel?.id || SHOWREEL_SLUG,
        title: siteSettings.showreelCaption || portfolioShowreel?.title || SHOWREEL_TITLE,
        category: "Showreel",
        client: portfolioShowreel?.client || "Dai Nguyen",
        image:
          youtubeThumbnail(siteSettings.showreelUrl) ||
          portfolioShowreel?.image ||
          fallbackHeroProject.image,
        videoUrl: siteSettings.showreelUrl,
      }
    : portfolioShowreel || fallbackShowreel;
  const heroProject = showreelProject || fallbackHeroProject;
  const homeFeatured = showreelProject
    ? [
        showreelProject,
        ...featured.filter(
          (project) =>
            project.id !== showreelProject.id &&
            project.id !== "samsung-voices-of-galaxy" &&
            !/samsung voices of galaxy/i.test(project.title),
        ),
      ].slice(0, 4)
    : featured;
  const playableFeatured = homeFeatured.filter((project) => youtubeVideoId(project.videoUrl));
  const heroVideoProject = youtubeVideoId(heroProject.videoUrl) ? heroProject : null;
  const homeVideos = [
    ...playableFeatured,
    ...(heroVideoProject && !playableFeatured.some((project) => project.id === heroVideoProject.id)
      ? [heroVideoProject]
      : []),
  ];
  const openHomeVideo = (project) => {
    const index = homeVideos.findIndex((item) => item.id === project?.id);
    if (index >= 0) setVideoIndex(index);
  };
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Video editor · Motion designer · 3D artist</span>
          <GradientTitle>
            I edit ideas
            <br />
            into <em>motion.</em>
          </GradientTitle>
          <p>
            Editorial craft, motion design and visual storytelling for brands that want every frame
            to earn its place.
          </p>
          <div className="button-row">
            <Link className="button" to="/work">
              <Icon name="play" /> View selected work
            </Link>
            {showreelProject && (
              <button
                className="button button-quiet"
                type="button"
                onClick={() => openHomeVideo(showreelProject)}
              >
                <Icon name="play" /> Watch showreel
              </button>
            )}
            <Link className="button button-quiet" to="/about">
              About Dai
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>15+</strong>
              <span>years in post</span>
            </div>
            <div>
              <strong>5</strong>
              <span>core disciplines</span>
            </div>
            <div>
              <strong>Global</strong>
              <span>remote collaboration</span>
            </div>
          </div>
        </div>
        <HeroShowreel
          project={showreelProject || heroProject}
          label={showreelProject ? "Featured showreel" : "Featured case study"}
          onOpen={() => {
            if (showreelProject) openHomeVideo(showreelProject);
            else openHomeVideo(heroVideoProject);
          }}
          disabled={!showreelProject && !heroVideoProject}
        />
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>Projects with purpose and pace.</h2>
          </div>
          <Link className="text-link" to="/work">
            View all work <Icon name="arrow" />
          </Link>
        </div>
        <div className="project-grid">
          {homeFeatured.map((project) => (
            <ProjectCard key={project.id} project={project} onPlay={() => openHomeVideo(project)} />
          ))}
        </div>
      </section>

      <section className="discipline-strip">
        {services.map((service, index) => (
          <Link key={service.name} to={`/services?category=${encodeURIComponent(service.name)}`}>
            <span>0{index + 1}</span>
            <strong>{service.name}</strong>
            <Icon name="arrow" />
          </Link>
        ))}
      </section>

      <CtaBand />
      <VideoModal
        projects={homeVideos}
        activeIndex={videoIndex}
        onChange={setVideoIndex}
        onClose={() => setVideoIndex(null)}
      />
    </>
  );
}

function Work({ projects }) {
  const [active, setActive] = useState(workCategories[0]);
  const [videoIndex, setVideoIndex] = useState(null);
  const visible = projects.filter((project) => project.published && project.category === active);
  return (
    <>
      <section className="page-intro">
        <span className="eyebrow">Selected portfolio</span>
        <GradientTitle compact>
          Work that <em>moves.</em>
        </GradientTitle>
        <p>Commercial, branded and experimental films shaped from first assembly to final frame.</p>
      </section>
      <div className="filter-bar">
        {workCategories.map((category) => (
          <button
            key={category}
            className={active === category ? "active" : ""}
            onClick={() => setActive(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <section className="project-grid work-grid">
        {visible.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onPlay={() => setVideoIndex(visible.indexOf(project))}
          />
        ))}
      </section>
      <CtaBand />
      <VideoModal
        projects={visible}
        activeIndex={videoIndex}
        onChange={setVideoIndex}
        onClose={() => setVideoIndex(null)}
      />
    </>
  );
}

function ProjectDetail({ projects }) {
  const [videoIndex, setVideoIndex] = useState(null);
  const { id } = useParams();
  const showreelFallback =
    id === SHOWREEL_SLUG || id === "showreel"
      ? {
          id: SHOWREEL_SLUG,
          title: SHOWREEL_TITLE,
          category: "Showreel",
          client: "Dai Nguyen",
          role: "Editor, Motion Designer, 3D Artist",
          year: new Date().getFullYear(),
          description: "A cut of selected editing, motion design and 3D work.",
          image: youtubeThumbnail(SHOWREEL_URL),
          videoUrl: SHOWREEL_URL,
          published: true,
        }
      : null;
  const project = projects.find((item) => item.id === id) || showreelFallback;
  if (!project) {
    return <NotFound />;
  }
  return (
    <>
      <section className="project-hero">
        <div>
          <span className="eyebrow">
            {project.category} · {project.year}
          </span>
          <GradientTitle compact>{project.title}</GradientTitle>
          <p>{project.description}</p>
        </div>
        <dl className="project-facts">
          <div>
            <dt>Client</dt>
            <dd>{project.client}</dd>
          </div>
          <div>
            <dt>Role</dt>
            <dd>{project.role}</dd>
          </div>
          <div>
            <dt>Year</dt>
            <dd>{project.year}</dd>
          </div>
        </dl>
      </section>
      <div className="project-player">
        <img src={project.image} alt={`${project.title} placeholder video frame`} />
        {youtubeVideoId(project.videoUrl) ? (
          <button className="play-button large" type="button" onClick={() => setVideoIndex(0)}>
            <Icon name="play" size={34} />
          </button>
        ) : (
          <span className="placeholder-label">YouTube video placeholder</span>
        )}
      </div>
      <section className="case-study-grid">
        {[
          [
            "Brief",
            project.brief ||
              "Create a focused campaign film that communicates the central idea quickly and confidently.",
          ],
          [
            "Challenge",
            project.challenge ||
              "Balance multiple assets, formats and stakeholder messages without losing emotional momentum.",
          ],
          [
            "Approach",
            project.approach ||
              "Build the cut around clear visual beats, sound-led transitions and purposeful motion.",
          ],
          [
            "Result",
            project.result ||
              "A polished master film and adaptable structure ready for multiple campaign touchpoints.",
          ],
        ].map(([title, copy], index) => (
          <article key={title}>
            <span>0{index + 1}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      {project.credits && (
        <section className="project-credits">
          <span className="eyebrow">Credits</span>
          <p>{project.credits}</p>
        </section>
      )}
      <CtaBand />
      <VideoModal
        projects={[project]}
        activeIndex={videoIndex}
        onChange={setVideoIndex}
        onClose={() => setVideoIndex(null)}
      />
    </>
  );
}

function Services() {
  const [active, setActive] = useState(capabilities[0].id);

  const scrollToCapability = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="services-redesign">
      <section className="services-intro">
        <span className="eyebrow">Services / Core capabilities</span>
        <h1 className="services-title">
          Crafted with <em>depth.</em>
        </h1>
        <p>Four disciplines. One senior creative workflow — from raw footage to final pixels.</p>
      </section>

      <div className="services-hero-image">
        <img
          src={`${ASSET_BASE}/services-hero.webp`}
          alt="Video editor working at a dual-monitor post-production setup"
        />
      </div>

      <nav className="capability-nav" aria-label="Core capabilities">
        {capabilities.map((capability) => (
          <button
            key={capability.id}
            type="button"
            className={active === capability.id ? "active" : ""}
            aria-current={active === capability.id ? "true" : undefined}
            onClick={() => scrollToCapability(capability.id)}
          >
            <span>{capability.number}</span> {capability.title}
          </button>
        ))}
      </nav>

      <section className="capability-list" aria-label="Capability details">
        {capabilities.map((capability) => (
          <article
            id={capability.id}
            key={capability.id}
            className={`capability-module${capability.reverse ? " is-reverse" : ""}`}
          >
            <div className="capability-copy">
              <span className="eyebrow">
                {capability.number} / {capability.label}
              </span>
              <h2>{capability.title}</h2>
              <p>{capability.copy}</p>
              <ul>
                {capability.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </div>
            <div className="capability-image">
              <img src={capability.image} alt={`${capability.title} capability`} />
            </div>
          </article>
        ))}
      </section>

      <CtaBand />
    </div>
  );
}

function About() {
  return (
    <>
      <section className="about-hero">
        <div>
          <span className="eyebrow">About me</span>
          <GradientTitle compact>
            15+ years
            <br />
            in <em>motion.</em>
          </GradientTitle>
          <p>
            I&apos;m Dai Nguyen, a freelance video editor, motion designer and 3D artist based in
            Vietnam. I have worked in post-production since 2011 and independently since 2015,
            helping agencies and brands turn ideas into clear, engaging visual stories.
          </p>
          <p>
            My experience spans editing, motion graphics, 3D, compositing, color coordination and
            audio — with past collaborations across studios and agencies including Digipost, Glass
            Egg, Ogilvy, TBWA and Circus Digital.
          </p>
          <Link className="button" to="/work">
            View my work <Icon name="arrow" />
          </Link>
        </div>
        <div className="portrait-frame">
          <img src={`${ASSET_BASE}/dai-nguyen-portrait.webp`} alt="Dai Nguyen, video editor" />
        </div>
      </section>
      <section className="about-panels">
        <article>
          <span className="eyebrow">Core disciplines</span>
          <div className="skill-list">
            {[
              "Video editing",
              "Motion graphics",
              "3D visualization",
              "Compositing & VFX",
              "AI video",
            ].map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </article>
        <article>
          <span className="eyebrow">Tools & workflow</span>
          <div className="tool-list">
            {[
              "Premiere Pro",
              "After Effects",
              "DaVinci Resolve",
              "Photoshop",
              "Illustrator",
              "3ds Max",
              "V-Ray",
              "AI tools",
            ].map((tool) => (
              <span key={tool}>{tool}</span>
            ))}
          </div>
        </article>
      </section>
      <CtaBand />
    </>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(ADMIN_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      const input = document.createElement("textarea");
      input.value = ADMIN_EMAIL;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }
  };

  const contactChannels = [
    {
      name: "Zalo",
      logo: `${ASSET_BASE}/contact-zalo-logo.svg`,
      qr: `${ASSET_BASE}/contact-zalo-qr.png`,
      instruction: "Open Zalo and scan this code",
      accent: "zalo",
    },
    {
      name: "Viber",
      logo: `${ASSET_BASE}/contact-viber-logo.svg`,
      qr: `${ASSET_BASE}/contact-viber-qr.png`,
      instruction: "Open Viber and scan this code",
      accent: "viber",
    },
    {
      name: "WhatsApp",
      logo: `${ASSET_BASE}/contact-whatsapp-logo.svg`,
      qr: `${ASSET_BASE}/contact-whatsapp-qr.png`,
      instruction: "Open WhatsApp and scan this code",
      accent: "whatsapp",
    },
  ];

  return (
    <section className="contact-layout">
      <div className="contact-intro">
        <span className="eyebrow">Get in touch</span>
        <GradientTitle compact>
          Let&apos;s make
          <br />
          something
          <br />
          <em>move.</em>
        </GradientTitle>
        <p>Have a project in mind? Send a short note or scan the channel that works for you.</p>
        <dl className="contact-facts">
          <div>
            <dt>Location</dt>
            <dd>Vietnam</dd>
          </div>
          <div>
            <dt>Working mode</dt>
            <dd>Remote worldwide</dd>
          </div>
        </dl>
      </div>
      <div className="contact-stack">
        <article className="contact-card primary">
          <span className="contact-icon">
            <Icon name="mail" size={34} />
          </span>
          <div>
            <small>Email me</small>
            <h2>{ADMIN_EMAIL}</h2>
            <div className="button-row">
              <a className="button" href={`mailto:${ADMIN_EMAIL}`}>
                Write an email <Icon name="arrow" />
              </a>
              <button
                className="icon-button"
                type="button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email"}
                title={copied ? "Copied" : "Copy email"}
              >
                <Icon name={copied ? "check" : "copy"} />
              </button>
            </div>
          </div>
        </article>

        <div className="contact-channel-grid">
          {contactChannels.map((channel) => (
            <article
              className={`contact-channel-card contact-channel-${channel.accent}`}
              key={channel.name}
            >
              <header>
                <span className="contact-channel-logo">
                  <img src={channel.logo} alt={`${channel.name} logo`} />
                </span>
                <div>
                  <h2>{channel.name}</h2>
                  <span>Scan to connect</span>
                </div>
              </header>
              <div className="contact-qr">
                <img src={channel.qr} alt={`${channel.name} contact QR code`} />
              </div>
              <footer>
                <strong>Direct message</strong>
                <p>{channel.instruction}</p>
              </footer>
            </article>
          ))}
        </div>
        <p className="contact-privacy-note">
          QR codes are displayed without phone numbers to protect privacy and make mobile contact
          effortless.
        </p>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <section className="not-found">
      <span className="eyebrow">404</span>
      <GradientTitle compact>
        Lost between <em>frames.</em>
      </GradientTitle>
      <Link className="button" to="/">
        Back home
      </Link>
    </section>
  );
}

function PublicLayout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [siteSettings, setSiteSettings] = useState({
    showreelUrl: "",
    showreelCaption: "",
  });

  useEffect(() => {
    let active = true;
    const loadPortfolioContent = async () => {
      try {
        const [cloudProjects, cloudSettings] = await Promise.all([
          fetchPublishedProjects(),
          fetchSiteSettings(),
        ]);
        if (!active) return;
        if (cloudProjects) setProjects(cloudProjects);
        if (cloudSettings) setSiteSettings(cloudSettings);
      } catch (error) {
        console.error("Could not load portfolio content from Cloud.", error);
      }
    };
    loadPortfolioContent();
    window.addEventListener("portfolio-content-updated", loadPortfolioContent);
    return () => {
      active = false;
      window.removeEventListener("portfolio-content-updated", loadPortfolioContent);
    };
  }, []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <Home projects={projects} siteSettings={siteSettings} />
            </PublicLayout>
          }
        />
        <Route
          path="/work"
          element={
            <PublicLayout>
              <Work projects={projects} />
            </PublicLayout>
          }
        />
        <Route
          path="/work/:id"
          element={
            <PublicLayout>
              <ProjectDetail projects={projects} />
            </PublicLayout>
          }
        />
        <Route
          path="/services"
          element={
            <PublicLayout>
              <Services />
            </PublicLayout>
          }
        />
        <Route
          path="/about"
          element={
            <PublicLayout>
              <About />
            </PublicLayout>
          }
        />
        <Route
          path="/contact"
          element={
            <PublicLayout>
              <Contact />
            </PublicLayout>
          }
        />
        <Route path="/admin" element={<ProductionAdmin />} />
        <Route
          path="*"
          element={
            <PublicLayout>
              <NotFound />
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
}
