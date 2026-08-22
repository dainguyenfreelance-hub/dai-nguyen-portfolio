import { useEffect, useMemo, useState } from "react";
import {
  Link,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ASSET_BASE, categories, initialProjects, services } from "./data";

const ADMIN_EMAIL = "dainguyen.freelance@gmail.com";
const PROJECTS_KEY = "dai-nguyen-portfolio-projects-v1";

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    play: <path d="m9 7 8 5-8 5V7Z" />,
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    mail: <path d="M4 6h16v12H4zM4 7l8 6 8-6" />,
    phone: <path d="M7 4 5 6c0 7 6 13 13 13l2-2-4-3-2 2c-3-1-5-3-6-6l2-2-3-4Z" />,
    location: <><path d="M12 21s6-5 6-11a6 6 0 1 0-12 0c0 6 6 11 6 11Z" /><circle cx="12" cy="10" r="2" /></>,
    edit: <><path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z" /><path d="m14 7 3 3" /></>,
    trash: <><path d="M5 7h14M9 7V4h6v3M8 10v7M12 10v7M16 10v7M7 7l1 13h8l1-13" /></>,
    plus: <path d="M12 5v14M5 12h14" />,
    logout: <><path d="M10 5H5v14h5M14 8l4 4-4 4M9 12h9" /></>,
    copy: <><rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V5H5v11h3" /></>,
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

function useProjects() {
  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem(PROJECTS_KEY);
      return stored ? JSON.parse(stored) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  useEffect(() => {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  }, [projects]);

  return [projects, setProjects];
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
          <NavLink key={href} to={href}>{label}</NavLink>
        ))}
        <Link className="button button-small" to="/contact">Let&apos;s talk</Link>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <span>© {new Date().getFullYear()} Dai Nguyen</span>
      <span>Video editing · Motion · AI video</span>
      <Link to="/admin">Admin</Link>
    </footer>
  );
}

function GradientTitle({ children, compact = false }) {
  return <h1 className={compact ? "display-title compact" : "display-title"}>{children}</h1>;
}

function CtaBand() {
  return (
    <section className="cta-band">
      <div className="cta-orb"><Icon name="mail" size={28} /></div>
      <div>
        <span className="eyebrow">Available for selected projects</span>
        <h2>Let&apos;s make something move.</h2>
        <p>Have a project in mind? Let&apos;s create something precise, memorable and alive.</p>
      </div>
      <Link className="text-link" to="/contact">Get in touch <Icon name="arrow" /></Link>
    </section>
  );
}

function ProjectCard({ project }) {
  return (
    <Link className="project-card" to={`/work/${project.id}`}>
      <div className="project-thumb">
        <img src={project.image} alt="" />
        <span className="play-button"><Icon name="play" size={26} /></span>
      </div>
      <div className="project-card-body">
        <span>{project.category}</span>
        <h3>{project.title}</h3>
        <div className="project-meta">
          <small>{project.client}</small>
          <Icon name="arrow" />
        </div>
      </div>
    </Link>
  );
}

function Home({ projects }) {
  const featured = projects.filter((project) => project.published && project.featured).slice(0, 4);
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Video editor · Motion designer · 3D artist</span>
          <GradientTitle>
            I edit ideas<br />into <em>motion.</em>
          </GradientTitle>
          <p>
            Editorial craft, motion design and visual storytelling for brands that want every
            frame to earn its place.
          </p>
          <div className="button-row">
            <Link className="button" to="/work"><Icon name="play" /> View selected work</Link>
            <Link className="button button-quiet" to="/about">About Dai</Link>
          </div>
          <div className="hero-stats">
            <div><strong>15+</strong><span>years in post</span></div>
            <div><strong>5</strong><span>core disciplines</span></div>
            <div><strong>Global</strong><span>remote collaboration</span></div>
          </div>
        </div>
        <Link className="hero-visual" to="/work/samsung-voices-of-galaxy">
          <img src={`${ASSET_BASE}/case-study.png`} alt="Selected campaign work by Dai Nguyen" />
          <div className="hero-visual-overlay">
            <span className="play-button large"><Icon name="play" size={32} /></span>
            <div>
              <small>Featured case study</small>
              <strong>Samsung Voices of Galaxy MMA</strong>
            </div>
          </div>
        </Link>
      </section>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Selected work</span>
            <h2>Projects with purpose and pace.</h2>
          </div>
          <Link className="text-link" to="/work">View all work <Icon name="arrow" /></Link>
        </div>
        <div className="project-grid">
          {featured.map((project) => <ProjectCard key={project.id} project={project} />)}
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
    </>
  );
}

function Work({ projects }) {
  const [active, setActive] = useState("All");
  const visible = projects.filter(
    (project) => project.published && (active === "All" || project.category === active),
  );
  return (
    <>
      <section className="page-intro">
        <span className="eyebrow">Selected portfolio</span>
        <GradientTitle compact>Work that <em>moves.</em></GradientTitle>
        <p>Commercial, branded and experimental films shaped from first assembly to final frame.</p>
      </section>
      <div className="filter-bar">
        {categories.map((category) => (
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
        {visible.map((project) => <ProjectCard key={project.id} project={project} />)}
      </section>
      <CtaBand />
    </>
  );
}

function ProjectDetail({ projects }) {
  const { id } = useParams();
  const project = projects.find((item) => item.id === id);
  if (!project) {
    return <NotFound />;
  }
  return (
    <>
      <section className="project-hero">
        <div>
          <span className="eyebrow">{project.category} · {project.year}</span>
          <GradientTitle compact>{project.title}</GradientTitle>
          <p>{project.description}</p>
        </div>
        <dl className="project-facts">
          <div><dt>Client</dt><dd>{project.client}</dd></div>
          <div><dt>Role</dt><dd>{project.role}</dd></div>
          <div><dt>Year</dt><dd>{project.year}</dd></div>
        </dl>
      </section>
      <div className="project-player">
        <img src={project.image} alt={`${project.title} placeholder video frame`} />
        {project.videoUrl ? (
          <a className="play-button large" href={project.videoUrl} target="_blank" rel="noreferrer">
            <Icon name="play" size={34} />
          </a>
        ) : (
          <span className="placeholder-label">YouTube video placeholder</span>
        )}
      </div>
      <section className="case-study-grid">
        {[
          ["Brief", "Create a focused campaign film that communicates the central idea quickly and confidently."],
          ["Challenge", "Balance multiple assets, formats and stakeholder messages without losing emotional momentum."],
          ["Approach", "Build the cut around clear visual beats, sound-led transitions and purposeful motion."],
          ["Result", "A polished master film and adaptable structure ready for multiple campaign touchpoints."],
        ].map(([title, copy], index) => (
          <article key={title}>
            <span>0{index + 1}</span>
            <h2>{title}</h2>
            <p>{copy}</p>
          </article>
        ))}
      </section>
      <CtaBand />
    </>
  );
}

function Services() {
  const search = new URLSearchParams(useLocation().search);
  const requested = search.get("category");
  const [active, setActive] = useState(
    services.some((service) => service.name === requested) ? requested : services[0].name,
  );
  const service = services.find((item) => item.name === active);
  return (
    <>
      <section className="page-intro">
        <span className="eyebrow">Services</span>
        <GradientTitle compact>Stories shaped with <em>intent.</em></GradientTitle>
        <p>From first cut to final delivery, every service is grounded in clarity, rhythm and craft.</p>
      </section>
      <div className="service-tabs">
        {services.map((item) => (
          <button
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => setActive(item.name)}
          >
            {item.name}
          </button>
        ))}
      </div>
      <section className="service-feature">
        <div className="service-copy">
          <span className="eyebrow">{service.eyebrow}</span>
          <h2>{service.name}</h2>
          <p>{service.copy}</p>
          <ul>
            {service.deliverables.map((item) => <li key={item}><Icon name="check" />{item}</li>)}
          </ul>
          <Link className="button" to="/contact">Start a project <Icon name="arrow" /></Link>
        </div>
        <div className="service-image"><img src={service.image} alt={`${service.name} portfolio concept`} /></div>
      </section>
      <section className="process">
        {["Discover", "Shape", "Build", "Finish"].map((step, index) => (
          <div key={step}><strong>0{index + 1}</strong><span>{step}</span></div>
        ))}
      </section>
      <CtaBand />
    </>
  );
}

function About() {
  return (
    <>
      <section className="about-hero">
        <div>
          <span className="eyebrow">About me</span>
          <GradientTitle compact>15+ years<br />in <em>motion.</em></GradientTitle>
          <p>
            I&apos;m Dai Nguyen, a freelance video editor, motion designer and 3D artist based in
            Vietnam. I have worked in post-production since 2011 and independently since 2015,
            helping agencies and brands turn ideas into clear, engaging visual stories.
          </p>
          <p>
            My experience spans editing, motion graphics, 3D, compositing, color coordination
            and audio — with past collaborations across studios and agencies including Digipost,
            Glass Egg, Ogilvy, TBWA and Circus Digital.
          </p>
          <Link className="button" to="/work">View my work <Icon name="arrow" /></Link>
        </div>
        <div className="portrait-frame">
          <img src={`${ASSET_BASE}/dai-nguyen-portrait.png`} alt="Dai Nguyen, video editor" />
        </div>
      </section>
      <section className="about-panels">
        <article>
          <span className="eyebrow">Core disciplines</span>
          <div className="skill-list">
            {["Video editing", "Motion graphics", "3D visualization", "Compositing & VFX", "AI video"].map((skill) => <span key={skill}>{skill}</span>)}
          </div>
        </article>
        <article>
          <span className="eyebrow">Tools & workflow</span>
          <div className="tool-list">
            {["Premiere Pro", "After Effects", "DaVinci Resolve", "Photoshop", "Illustrator", "3ds Max", "V-Ray", "AI tools"].map((tool) => <span key={tool}>{tool}</span>)}
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
    await navigator.clipboard.writeText(ADMIN_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <section className="contact-layout">
      <div className="contact-intro">
        <span className="eyebrow">Get in touch</span>
        <GradientTitle compact>Let&apos;s make<br />something <em>move.</em></GradientTitle>
        <p>Have a project in mind? Send a short note and tell me what you&apos;d like to create.</p>
      </div>
      <div className="contact-stack">
        <article className="contact-card primary">
          <span className="contact-icon"><Icon name="mail" size={34} /></span>
          <div>
            <small>Email me</small>
            <h2>{ADMIN_EMAIL}</h2>
            <div className="button-row">
              <a className="button" href={`mailto:${ADMIN_EMAIL}`}>Write an email <Icon name="arrow" /></a>
              <button className="icon-button" onClick={copyEmail} aria-label="Copy email">
                <Icon name={copied ? "check" : "copy"} />
              </button>
            </div>
          </div>
        </article>
        <article className="contact-card">
          <span className="contact-icon"><Icon name="phone" size={32} /></span>
          <div><small>Call or message</small><h2>035 620 1967</h2></div>
        </article>
        <div className="contact-mini-grid">
          <article className="contact-card">
            <span className="contact-icon"><Icon name="location" /></span>
            <div><small>Location</small><strong>Vietnam</strong></div>
          </article>
          <article className="contact-card">
            <span className="contact-icon">◎</span>
            <div><small>Working mode</small><strong>Remote worldwide</strong></div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Admin({ projects, setProjects }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("dai-admin-session") === "true",
  );
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(initialProjects[0]);

  const login = (event) => {
    event.preventDefault();
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      sessionStorage.setItem("dai-admin-session", "true");
      setAuthenticated(true);
    }
  };

  if (!authenticated) {
    return (
      <section className="admin-login">
        <div className="admin-login-card">
          <img src={`${ASSET_BASE}/logo.png`} alt="Dai Nguyen" />
          <span className="eyebrow">Portfolio CMS preview</span>
          <h1>Admin access</h1>
          <p>Use the configured admin email to open the local content manager.</p>
          <form onSubmit={login}>
            <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={ADMIN_EMAIL} /></label>
            <button className="button" type="submit">Continue <Icon name="arrow" /></button>
          </form>
          <small>Production authentication will be connected through Lovable Cloud or Supabase.</small>
        </div>
      </section>
    );
  }

  const newProject = () => {
    setEditing("new");
    setForm({
      id: "",
      title: "",
      category: "Case Study",
      client: "Prodigious, Publicis Groupe",
      year: new Date().getFullYear().toString(),
      role: "",
      image: `${ASSET_BASE}/case-study.png`,
      videoUrl: "",
      featured: false,
      published: false,
      description: "",
    });
  };

  const editProject = (project) => {
    setEditing(project.id);
    setForm({ ...project });
  };

  const saveProject = (event) => {
    event.preventDefault();
    const id = form.id || form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const next = { ...form, id };
    setProjects((current) =>
      editing === "new" ? [next, ...current] : current.map((item) => item.id === editing ? next : item),
    );
    setEditing(null);
  };

  const removeProject = (id) => {
    if (window.confirm("Remove this project from the portfolio?")) {
      setProjects((current) => current.filter((project) => project.id !== id));
    }
  };

  return (
    <section className="admin-shell">
      <aside className="admin-sidebar">
        <img src={`${ASSET_BASE}/logo.png`} alt="Dai Nguyen" />
        <div>
          <span className="eyebrow">CMS preview</span>
          <h2>Portfolio admin</h2>
          <p>Manage project titles, categories, thumbnails, visibility and video URLs.</p>
        </div>
        <div className="admin-sidebar-actions">
          <Link className="button button-quiet" to="/" target="_blank">View website</Link>
          <button
            className="text-link"
            onClick={() => {
              sessionStorage.removeItem("dai-admin-session");
              setAuthenticated(false);
            }}
          >
            <Icon name="logout" /> Log out
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-heading">
          <div><span className="eyebrow">Content library</span><h1>Projects</h1></div>
          <button className="button" onClick={newProject}><Icon name="plus" /> New project</button>
        </div>
        <div className="admin-table">
          {projects.map((project) => (
            <article key={project.id}>
              <img src={project.image} alt="" />
              <div><strong>{project.title}</strong><span>{project.category} · {project.year}</span></div>
              <span className={project.published ? "status published" : "status draft"}>
                {project.published ? "Published" : "Draft"}
              </span>
              <div className="row-actions">
                <button onClick={() => editProject(project)} aria-label={`Edit ${project.title}`}><Icon name="edit" /></button>
                <button onClick={() => removeProject(project.id)} aria-label={`Delete ${project.title}`}><Icon name="trash" /></button>
              </div>
            </article>
          ))}
        </div>
      </main>

      {editing && (
        <div className="modal-backdrop" onMouseDown={() => setEditing(null)}>
          <form className="editor-modal" onSubmit={saveProject} onMouseDown={(event) => event.stopPropagation()}>
            <div className="modal-heading">
              <div><span className="eyebrow">{editing === "new" ? "Create" : "Edit"}</span><h2>Project details</h2></div>
              <button type="button" className="icon-button" onClick={() => setEditing(null)}><Icon name="close" /></button>
            </div>
            <div className="form-grid">
              <label className="full">Title<input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></label>
              <label>Category<select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
              <label>Year<input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></label>
              <label className="full">Client<input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} /></label>
              <label className="full">Role<input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></label>
              <label className="full">Thumbnail URL<input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} /></label>
              <label className="full">YouTube URL<input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="Add later" /></label>
              <label className="full">Description<textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
              <label className="check-field"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              <label className="check-field"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            </div>
            <div className="modal-actions">
              <button className="button button-quiet" type="button" onClick={() => setEditing(null)}>Cancel</button>
              <button className="button" type="submit">Save project</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}

function NotFound() {
  return (
    <section className="not-found">
      <span className="eyebrow">404</span>
      <GradientTitle compact>Lost between <em>frames.</em></GradientTitle>
      <Link className="button" to="/">Back home</Link>
    </section>
  );
}

function PublicLayout({ children }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

export default function App() {
  const [projects, setProjects] = useProjects();
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicLayout><Home projects={projects} /></PublicLayout>} />
        <Route path="/work" element={<PublicLayout><Work projects={projects} /></PublicLayout>} />
        <Route path="/work/:id" element={<PublicLayout><ProjectDetail projects={projects} /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/admin" element={<Admin projects={projects} setProjects={setProjects} />} />
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  );
}
