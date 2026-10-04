import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { projects, profile } from "./site-config.js";
import "./style.css";

const navigation = [
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["journey", "Journey"],
  ["achievements", "Achievements"],
  ["contact", "Contact"],
];

const skills = [
  { group: "Programming", items: ["C", "C++", "JavaScript"] },
  { group: "Web", items: ["HTML", "CSS", "Three.js"] },
  { group: "Tools & workflow", items: ["Git", "GitHub", "Vercel", "VS Code", "AI-assisted development"] },
];

function ArrowIcon({ diagonal = false }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="arrow-icon">
      {diagonal ? (
        <path d="M4 12 12 4M5 4h7v7" />
      ) : (
        <path d="M2.75 8h10.5m-4.5-4.5L13.25 8l-4.5 4.5" />
      )}
    </svg>
  );
}

function BrandMark() {
  return <span aria-hidden="true" className="brand-mark">AS<span>.</span></span>;
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </div>
  );
}

function ProjectCard({ project, index }) {
  return (
    <article className={`project-card project-card-${index + 1}`}>
      <div className="project-topline">
        <span className="project-index">0{index + 1} / PROJECT</span>
        <span className={`project-status ${project.status === "Ongoing" ? "is-ongoing" : ""}`}>
          <span aria-hidden="true" />
          {project.status}
        </span>
      </div>
      <div className="project-copy">
        <h3>{project.name}</h3>
        <p>{project.description}</p>
      </div>
      <ul className="feature-list">
        {project.features.map((feature) => <li key={feature}>{feature}</li>)}
      </ul>
      <div className="tag-list" aria-label="Technologies">
        {project.stack.map((item) => <span className="tag" key={item}>{item}</span>)}
      </div>
      <div className="project-actions">
        {project.liveUrl && (
          <a className="text-action" href={project.liveUrl} target="_blank" rel="noreferrer">
            Live demo <ArrowIcon diagonal />
          </a>
        )}
        {project.githubUrl && (
          <a className="text-action secondary-action" href={project.githubUrl} target="_blank" rel="noreferrer">
            GitHub <ArrowIcon diagonal />
          </a>
        )}
      </div>
    </article>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");

  useEffect(() => {
    const sections = ["top", ...navigation.map(([id]) => id)]
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.15, 0.35, 0.6] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="header-inner">
          <a className="brand" href="#top" aria-label="Anurag Shivhare, home" onClick={() => setMenuOpen(false)}>
            <BrandMark />
            <span className="brand-name">anurag<span>.dev</span></span>
          </a>
          <button
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className={`menu-toggle ${menuOpen ? "is-open" : ""}`}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            <span /><span />
          </button>
          <nav id="site-navigation" className={`site-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
            {navigation.map(([id, label]) => (
              <a
                aria-current={activeSection === id ? "location" : undefined}
                className={activeSection === id ? "is-active" : ""}
                href={`#${id}`}
                key={id}
                onClick={() => setMenuOpen(false)}
              >{label}</a>
            ))}
            <a className="nav-resume" href={profile.githubUrl} target="_blank" rel="noreferrer">
              GitHub <ArrowIcon diagonal />
            </a>
          </nav>
        </div>
      </header>

      <main id="main">
        <section className="hero section-wrap" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="availability"><span /> FIRST-YEAR CSE STUDENT · CSJMU</div>
            <h1 id="hero-title">Building.<br /><span>Learning.</span><br />Shipping<span className="accent-dot">.</span></h1>
            <p className="hero-lede">BTech CSE student exploring software engineering, web development and AI-powered development.</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#projects">View projects <ArrowIcon /></a>
              <a className="button button-outline" href={profile.githubUrl} target="_blank" rel="noreferrer">GitHub <ArrowIcon diagonal /></a>
              <a className="button button-quiet" href="#contact">Contact me</a>
            </div>
            <div className="hero-note"><span className="note-line" />Learning in public, one project at a time.</div>
          </div>
          <div className="hero-art" aria-label="A code editor showing a small JavaScript greeting" role="img">
            <div className="art-glow" />
            <div className="editor-window">
              <div className="editor-topbar">
                <div className="window-dots" aria-hidden="true"><i /><i /><i /></div>
                <span>hello-world.js</span>
                <span className="editor-menu" aria-hidden="true">···</span>
              </div>
              <div className="editor-content">
                <span className="line-number">01</span><code><span className="code-purple">const</span> <span className="code-blue">developer</span> = &#123;</code>
                <span className="line-number">02</span><code>&nbsp; name: <span className="code-green">"Anurag"</span>,</code>
                <span className="line-number">03</span><code>&nbsp; studying: <span className="code-green">"Computer Science"</span>,</code>
                <span className="line-number">04</span><code>&nbsp; year: <span className="code-orange">1</span>,</code>
                <span className="line-number">05</span><code>&nbsp; mindset: <span className="code-green">"keep building"</span></code>
                <span className="line-number">06</span><code>&#125;;</code>
                <span className="line-number">07</span><code className="code-comment">// still learning. always shipping.</code>
                <span className="line-number">08</span><code><span className="code-purple">export default</span> developer;<span className="cursor">▍</span></code>
              </div>
              <div className="editor-footer"><span><i /> JavaScript</span><span>UTF-8</span><span>Ln 8, Col 24</span></div>
            </div>
            <div className="art-caption"><span>01</span><span>CURIOUS BY DEFAULT</span><span className="caption-rule" /></div>
          </div>
          <a className="scroll-cue" href="#about"><span />Scroll to explore</a>
        </section>

        <section className="section-wrap about-section" id="about">
          <SectionHeading eyebrow="A little about me" title={<>Curious by nature.<br /><span>Learning by doing.</span></>} />
          <div className="about-grid">
            <p className="about-lead">I’m Anurag, a first-year BTech Computer Science student at CSJMU. I’m at the beginning of my software engineering journey—and enjoying the process of figuring things out.</p>
            <div className="about-details">
              <p>I’m learning programming fundamentals, exploring how the web works, and turning ideas into projects I can share. Building things helps me connect what I study with how software feels when someone actually uses it.</p>
              <p>There’s a lot I haven’t learned yet. That’s the exciting part: each small project gives me a new problem to solve and another reason to keep going.</p>
              <a className="inline-link" href="#journey">A little more about my journey <ArrowIcon /></a>
            </div>
          </div>
          <div className="about-meta">
            <div><span className="meta-label">CURRENT CHAPTER</span><strong>First year of BTech CSE</strong></div>
            <div><span className="meta-label">BASED IN</span><strong>India · CSJMU</strong></div>
            <div><span className="meta-label">APPROACH</span><strong>Build, learn, iterate</strong></div>
          </div>
        </section>

        <section className="section-wrap skills-section" id="skills">
          <SectionHeading eyebrow="Tools in my toolkit" title={<>A foundation, <span>still growing.</span></>} />
          <p className="section-intro">Things I’m learning and using as I build projects. I’m always adding to the list.</p>
          <div className="skills-grid">
            {skills.map((category, index) => (
              <article className="skill-card" key={category.group}>
                <div className="skill-card-head"><span>0{index + 1}</span><h3>{category.group}</h3></div>
                <ul>{category.items.map((skill) => <li key={skill}><span className="skill-dot" />{skill}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section-wrap projects-section" id="projects">
          <SectionHeading eyebrow="A few things I’ve made" title={<>Learning looks like <span>building.</span></>} />
          <p className="section-intro">Small steps, real projects. Each one teaches me something new.</p>
          <div className="projects-grid">
            {projects.map((project, index) => <ProjectCard index={index} key={project.name} project={project} />)}
          </div>
        </section>

        <section className="section-wrap journey-section" id="journey">
          <SectionHeading eyebrow="Where I am & where I’m going" title={<>Early days. <span>Big curiosity.</span></>} />
          <div className="journey-grid">
            <article className="journey-card education-card">
              <div className="journey-icon" aria-hidden="true">01</div>
              <div className="journey-content">
                <span className="meta-label">EDUCATION · CURRENT</span>
                <h3>BTech, Computer Science &amp; Engineering</h3>
                <p>Chhatrapati Shahu Ji Maharaj University (CSJMU)</p>
                <span className="journey-note">First year</span>
              </div>
            </article>
            <article className="journey-card learning-card">
              <div className="journey-icon" aria-hidden="true">02</div>
              <div className="journey-content">
                <span className="meta-label">CURRENTLY LEARNING</span>
                <h3>One concept at a time</h3>
                <p>Strengthening my C and C++ fundamentals, getting more comfortable with JavaScript and the web, and learning how to make projects work well on different screens.</p>
                <div className="tag-list"><span className="tag">Programming fundamentals</span><span className="tag">Responsive web</span><span className="tag">Three.js</span><span className="tag">Git workflow</span></div>
              </div>
            </article>
          </div>
          <div className="honesty-note"><span className="honesty-mark">↗</span><p><strong>Honest about the journey.</strong> I’m a first-year student with lots still to learn. No shortcuts, just curiosity and consistent practice.</p></div>
        </section>

        <section className="section-wrap achievements-section" id="achievements">
          <SectionHeading eyebrow="Achievements & certifications" title={<>The work is <span>the beginning.</span></>} />
          <div className="achievement-card">
            <span className="achievement-marker" aria-hidden="true">↗</span>
            <div>
              <h3>Focused on learning by building</h3>
              <p>I’m early in my degree and haven’t added formal certifications or awards yet. For now, I’m putting my energy into coursework, programming fundamentals, and projects I can learn from.</p>
            </div>
          </div>
        </section>

        <section className="section-wrap contact-section" id="contact">
          <div className="contact-card">
            <div className="contact-decoration" aria-hidden="true"><span /><span /><span /></div>
            <p className="eyebrow">Have a project in mind?</p>
            <h2>Let’s make<br /><span>something useful.</span></h2>
            <p className="contact-copy">I’m always glad to connect with fellow learners, swap ideas, or hear what you think of a project.</p>
            <a className="button button-primary" href={profile.githubUrl} target="_blank" rel="noreferrer">Find me on GitHub <ArrowIcon diagonal /></a>
            <span className="contact-footnote">No pressure. Just a conversation.</span>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><BrandMark /><span className="brand-name">anurag<span>.dev</span></span></a>
        <p>Made with curiosity by Anurag Shivhare.</p>
        <a className="back-to-top" href="#top">Back to top <ArrowIcon diagonal /></a>
        <span className="copyright">© {new Date().getFullYear()}</span>
      </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
