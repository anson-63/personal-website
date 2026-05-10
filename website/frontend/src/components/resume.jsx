import '../App.css';
import './resume.css';

function Resume() {
  return (
    <div className="resume-page">
      <h1>My Resume</h1>

      <section>
        <div className="section-header">
          <i class="fa-solid fa-graduation-cap fa-2xl"></i>
          <h2>Education</h2>
        </div>
        <ul className='education-list'>
          <li>
            <h2>Chinese University of Hong Kong</h2>
            <p>Sep 2023 - Jul 2027 (expected)</p>
            <p>Bachelor of Information Engineering</p>
            <p>Latest GPA: 3.554 / Major GPA: 3.377 / CGPA: 3.26</p>
          </li>
          <li>
            <h2>Wesley College</h2>
            <p>Sep 2017 - Jul 2023</p>
            <p>Secondary Education</p>
          </li>
        </ul>
      </section>

      <section>
        <div className="section-header">
          <i class="fa-solid fa-briefcase fa-2xl"></i>
          <h2>Work Experience</h2>
        </div>
        <ul>
          <li>
            <h2>Creative Union International Ltd</h2>
            <p>Jun 2023 - Jun 2024</p>
            <p>Management Trainee</p>
            <ul className='bullet'>
              <li>Website setup and maintenance support</li>
              <li>Online store development</li>
              <li>Customer service management</li>
              <li>Concert ticket logistics for events like MIRROR UK Tour (80,000+ visitors)</li>
            </ul>
          </li>
          <li>
            <h2>Quinity Esports Hong Kong Limited</h2>
            <p>May 2021 - Sep 2022</p>
            <p>Event & Tournament Executive</p>
            <ul className='bullet'>
              <li>Cross-team communication and emergency handling</li>
              <li>Hosting and monitoring tournaments</li>
              <li>Project management</li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <div className="section-header">
          <i class="fa-solid fa-diagram-project fa-2xl"></i>
          <h2>Projects</h2>
        </div>
        <ul>
          <li>
            <h2>Personal Website</h2>
            <p>Dec 2025</p>
            <p><a href="https://ansonli.web.app" target="_blank" rel="noreferrer">ansonli.web.app</a></p>
            <ul className='bullet'>
              <li>Built with ReactJS and Vite</li>
              <li>Firebase backend</li>
              <li>Features: authentication, chatroom, interactive map</li>
            </ul>
          </li>
          <li>
            <h2>Taiko no Tatsujin Game Project</h2>
            <p>Dec 2025</p>
            <p><a href="https://github.com/anson-63/Taiko-no-Tatsujin" target="_blank" rel="noreferrer">GitHub repo</a></p>
            <p>WPF C# group project</p>
            <ul className='bullet'>
              <li>Frontend development and coordination</li>
              <li>Features: basic control, scoring system, local multiplayer</li>
            </ul>
          </li>
          <li>
            <h2>STM32: Embedded Duck Shooting Game</h2>
            <p>Dec 2025</p>
            <ul className='bullet'>
              <li>Developed a high-performance arcade game on the STM32F10x (ARM Cortex-M3) using C</li>
              <li>Interfaced TFT-LCD via FSMC for high-speed rendering and integrated PS/2 peripheral protocols</li>
              <li>Optimized system responsiveness using NVIC interrupt handling and PWM-based audio generation</li>
            </ul>
          </li>
          <li>
            <h2>AI Audio Separation & Transcription Tool</h2>
            <p>Jan 2026</p>
            <p><a href="https://github.com/anson-63/audio-separation" target="_blank" rel="noreferrer">GitHub Repo</a></p>
            <ul className='bullet'>
              <li>Python application integrating Spleeter (AI source separation) and OpenAI Whisper (transcription)</li>
              <li>Built an interactive web UI using Gradio for YouTube link processing and file uploads</li>
            </ul>
          </li>
          <li>
            <h2>E-Shop E-Commerce Platform</h2>
            <p>Feb 2026</p>
            <p><a href="https://github.com/anson-63/E-Shop" target="_blank" rel="noreferrer">GitHub Repo</a></p>
            <ul className='bullet'>
              <li>Full-stack deployment on a Linux VM using Nginx as a reverse proxy and Node.js backend</li>
              <li>Architected a secure MSSQL database with connection pooling and session-based authentication</li>
              <li>Integrated PayPal REST API for secure payments and implemented a custom discount engine</li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <div className="section-header">
          <i class="fa-solid fa-hand-holding-heart fa-2xl"></i>
          <h2>Leadership</h2>
        </div>
        <ul>
          <li>
            <h2>Leo Club of Hong Kong West</h2>
            <p>Jul 2025 - Jun 2026</p>
            <p>Vice President</p>
            <ul className='bullet'>
              <li>Event organization</li>
              <li>Member coordination</li>
              <li>Operational oversight</li>
            </ul>
          </li>
        </ul>
      </section>

      <section>
        <div className="section-header">
          <i class="fa-solid fa-screwdriver-wrench fa-2xl"></i>
          <h2>Skills</h2>
        </div>
        <p>C (Advanced), Python (Intermediate), ReactJS (Intermediate), JS (Intermediate), Content Editing</p>

        <div className="section-header">
          <i class="fa-solid fa-language fa-2xl"></i>
          <h2>Languages</h2>
        </div>
        <p>Cantonese (Native), Mandarin (Fluent), English (Limited Working)</p>
      </section>
    </div>
  );
}

export default Resume;
