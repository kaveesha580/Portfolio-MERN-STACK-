import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link } from 'react-router-dom'  
import './App.css'
import Admin from './components/Admin'  
import { 
  useTypingAnimation, 
  useThemeManager, 
  useTimelineProgress,
  useSmoothNavigation,
  handleFormSubmit 
} from './portfolioLogic'

function App() {
  const [typedText, setTypedText] = useState('')
  const [progressHeight, setProgressHeight] = useState('0%')
  const [formFeedback, setFormFeedback] = useState({ message: '', color: '' })
  
  const nameInputRef = useRef(null)
  const emailInputRef = useRef(null)
  const msgInputRef = useRef(null)
  const contactFormRef = useRef(null)
  const timelineContainerRef = useRef(null)
  const progressFillRef = useRef(null)
  const educationSectionRef = useRef(null)

  // Custom hooks
  useTypingAnimation(setTypedText)
  const { theme, toggleTheme, getThemeIcon, getThemeText } = useThemeManager()
  useTimelineProgress(setProgressHeight, timelineContainerRef, progressFillRef, educationSectionRef)
  useSmoothNavigation()

  // Loader Effect
  useEffect(() => {
    const loader = document.getElementById('loaderWrapper')
    if (loader) {
      setTimeout(() => {
        loader.classList.add('hide')
        setTimeout(() => {
          loader.style.display = 'none'
        }, 500)
      }, 500)
    }
  }, [])

  // Contact Form Handler
  const handleSubmit = (e) => {
    handleFormSubmit(e, nameInputRef, emailInputRef, msgInputRef, contactFormRef, setFormFeedback)
  }

  return (
    <Routes>
      {/* Admin Route */}
      <Route path="/admin" element={<Admin />} />
      
      {/* Home Page Route */}
      <Route path="/*" element={
        <HomePage 
          typedText={typedText}
          progressHeight={progressHeight}
          formFeedback={formFeedback}
          toggleTheme={toggleTheme}
          getThemeIcon={getThemeIcon}
          getThemeText={getThemeText}
          nameInputRef={nameInputRef}
          emailInputRef={emailInputRef}
          msgInputRef={msgInputRef}
          contactFormRef={contactFormRef}
          timelineContainerRef={timelineContainerRef}
          progressFillRef={progressFillRef}
          educationSectionRef={educationSectionRef}
          handleSubmit={handleSubmit}
        />
      } />
    </Routes>
  )
}

// ========== HomePage Component ==========
function HomePage({ 
  typedText, 
  progressHeight, 
  formFeedback,
  toggleTheme,
  getThemeIcon,
  getThemeText,
  nameInputRef,
  emailInputRef,
  msgInputRef,
  contactFormRef,
  timelineContainerRef,
  progressFillRef,
  educationSectionRef,
  handleSubmit
}) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  return (
    <div>
      <div className="loader-wrapper" id="loaderWrapper">
        <div className="loader"></div>
      </div>

      <div className="page-content" id="pageContent">
        <header>
          <nav>
            <div className="logo">Kaveesha</div>
            <ul className="nav-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About</a></li>
              <li><a href="#skills">Skills</a></li>
              <li><a href="#projects">Projects</a></li>
              <li><a href="#education">Education</a></li>
              <li><a href="#contact">Contact</a></li>
              <li><Link to="/admin" style={{ color: '#ccff33' }}>🔐 Admin</Link></li>
            </ul>
            <button className="theme-toggle" onClick={toggleTheme}>
              <span className="icon">{getThemeIcon()}</span>
              <span>{getThemeText()}</span>
            </button>
          </nav>
        </header>

        <main>
          {/* Home Section */}
          <div id="home" className="hero-wrapper">
            <div className="hero-image-card">
              <img src="/img/my.jpeg" alt="Profile" />
            </div>
            <div className="hero-text-card">
              <section className="hero" style={{ padding: '0' }}>
                <h1>Hi, I'm <span className="highlight">Kaveesha</span></h1>
                <div className="typing-container">
                  <span className="typed-text">{typedText}</span>
                </div>
                <br />
                <a href="#projects" className="btn">View My Work →</a>
              </section>
            </div>
          </div>

          {/* About Section */}
          <section id="about">
            <div className="about-content">
              <div className="about-text">
                <h2>About Me</h2>
                <p>
                  I'm a passionate and dedicated student pursuing a BSc in
                  Information Technology at the University of Sri Jayewardenepura.
                  With a strong foundation in programming, web development, and
                  software engineering, I strive to create innovative solutions
                  that make a positive impact. My journey in the tech world is
                  driven by curiosity, continuous learning, and a commitment to
                  excellence.
                </p>
                <a href="cv.pdf" className="btn" style={{ background: '#333', color: '#ccff33' }}>
                  Download Resume
                </a>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="skills-section">
            <h2>My Skills</h2>
            <div className="skills-container">
              <div className="skills-category">
                <h3>💻 Technical Skills</h3>
                <div className="tech-grid">
                  <div className="tech-item">
                    <span className="tech-name">Java</span>
                    <span className="tech-level">Intermediate</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-name">JavaScript</span>
                    <span className="tech-level">Intermediate</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-name">HTML</span>
                    <span className="tech-level">Advanced</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-name">Microsoft Office</span>
                    <span className="tech-level">Advanced</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-name">CSS</span>
                    <span className="tech-level">Advanced</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-name">React</span>
                    <span className="tech-level">Beginner</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-name">Git & GitHub</span>
                    <span className="tech-level">Intermediate</span>
                  </div>
                  <div className="tech-item">
                    <span className="tech-name">MySQL</span>
                    <span className="tech-level">Basic</span>
                  </div>
                </div>
              </div>
              <div className="skills-category">
                <h3>🤝 Professional Skills</h3>
                <div className="skills-list">
                  <span className="skill-tag">Teamwork</span>
                  <span className="skill-tag">Communication</span>
                  <span className="skill-tag">Time Management</span>
                  <span className="skill-tag">Fast Learner</span>
                  <span className="skill-tag">Attention to Detail</span>
                  <span className="skill-tag">Problem Solving</span>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="projects-section">
            <h2>Featured Projects</h2>
            {loading ? (
              <p style={{ textAlign: 'center', color: '#ccff33' }}>Loading projects...</p>
            ) : projects.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#ccc' }}>No projects added yet.</p>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div className="project-card" key={project._id}>
                    <img src={project.image || '/img/wait.jpeg'} alt={project.title} />
                    <div className="project-info">
                      <div className={`project-status ${
                        project.status === 'Completed' ? 'status-completed' :
                        project.status === 'In Progress' ? 'status-progress' :
                        'status-planning'
                      }`}>
                        {project.status === 'Completed' && '✅ Completed'}
                        {project.status === 'In Progress' && '🔄 In Progress'}
                        {project.status === 'Planned' && '📝 Planned'}
                      </div>
                      <h3>{project.title}</h3>
                      <div className="project-tech">
                        {project.technologies.map((tech, index) => (
                          <span className="tech-stack" key={index}>{tech}</span>
                        ))}
                      </div>
                      <p>{project.description}</p>
                      {project.githubLink && (
                        <a href={project.githubLink} className="github-link" target="_blank" rel="noopener noreferrer">
                          🔗 View on GitHub
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Education Section */}
          <section id="education" className="education-section" ref={educationSectionRef}>
            <h2 className="section-title">Education Timeline</h2>
            <div className="timeline-container" ref={timelineContainerRef}>
              <div className="timeline-line"></div>
              <div 
                className="timeline-progress-fill" 
                ref={progressFillRef}
                style={{ height: progressHeight }}
              ></div>
              <div className="timeline-item">
                <div className="timeline-dot dot-green"></div>
                <div className="timeline-content">
                  <div className="result-badge">🎓 8A 1S</div>
                  <span className="timeline-year year-green">2020</span>
                  <h2>G.C.E. Ordinary Level (O/L)</h2>
                  <h3>9 Subjects</h3>
                  <p>Successfully completed with excellent results.</p>
                  <div className="result-details">
                    <div className="subject-grid">
                      <div className="subject-item">Maths A</div>
                      <div className="subject-item">Science A</div>
                      <div className="subject-item">ICT A</div>
                      <div className="subject-item">English S</div>
                      <div className="subject-item">Sinhala A</div>
                      <div className="subject-item">History A</div>
                      <div className="subject-item">Dancing A</div>
                      <div className="subject-item">Religion A</div>
                      <div className="subject-item">Commerce A</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dot-orange"></div>
                <div className="timeline-content">
                  <div className="result-badge">📊 2023</div>
                  <span className="timeline-year year-orange">2023</span>
                  <h2>G.C.E. Advanced Level (A/L)</h2>
                  <h3>Physical Science Stream</h3>
                  <p>Combined Maths - B | ICT - C | Physics - C</p>
                  <div className="result-details">
                    <div className="subject-grid">
                      <div className="subject-item">Maths B</div>
                      <div className="subject-item">ICT C</div>
                      <div className="subject-item">Physics C</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-dot dot-green"></div>
                <div className="timeline-content">
                  <div className="result-badge">📊 GPA:2.96</div>
                  <span className="timeline-year year-green">2026 - Present</span>
                  <h2>BSc in Information Technology</h2>
                  <h3>University of Sri Jayewardenepura</h3>
                  <p>
                    Currently pursuing with focus on Web Development, Programming,
                    and Software Engineering.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact">
            <h2>Get In Touch</h2>
            <div className="contact-form">
              <form ref={contactFormRef} onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required ref={nameInputRef} />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required ref={emailInputRef} />
                </div>
                <div className="form-group">
                  <textarea rows="5" placeholder="Your Message" required ref={msgInputRef}></textarea>
                </div>
                <button type="submit" className="btn">Send Message</button>
                {formFeedback.message && (
                  <p style={{ marginTop: '12px', fontSize: '0.85rem', textAlign: 'center', color: formFeedback.color }}>
                    {formFeedback.message}
                  </p>
                )}
              </form>
            </div>
          </section>
        </main>

        <footer>
          <p>@2026 H.A.K.Dilshan</p>
        </footer>
      </div>
    </div>
  )
}

export default App