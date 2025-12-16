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
                <p>2023-Present</p>
                <p>Bachelor of Information Engineering</p>
            </li>
            <li>
                <h2>Wesley College</h2>
                <p>2017-2023</p>
                <p>Bachelor of Information Engineering</p>
            </li>
        </ul>
      </section>

      <section>
        <div className="section-header">
            <i class="fa-solid fa-briefcase fa-2xl"></i>
            <h2>Experience</h2>
        </div>
        <ul>
            <li>
                <h2>Creative Union Internation Ltd</h2>
                <p>2023-2024</p>
                <p>Management Trainee</p>
                <ul className='bullet'>
                    <li>
                        Website setup and maintenance using Squarespace
                    </li>
                    <li>
                        Online store development
                    </li>
                    <li>
                        Customer service
                    </li>
                </ul>
            </li>
        </ul>
      </section>

      <section>
        <div className="section-header">
            <i class="fa-solid fa-hand-holding-heart fa-2xl"></i>
            <h2>Volunteer</h2>
        </div>
        <ul>
            <li>
                <h2>Leo Club of Hong Kong West</h2>
                <p>2025-2026</p>
                <p>Vice President</p>
                <ul className='bullet'>
                    <li>
                        Event planning and organization
                    </li>
                    <li>
                        Coordination
                    </li>
                </ul>
            </li>
        </ul>
      </section>

      <section>
        <div className="section-header">
            <i class="fa-solid fa-screwdriver-wrench fa-2xl"></i>
            <h2>Skills</h2>
        </div>
        <p>C, Content Editing, Python, ReactJS</p>
        <div className="section-header">
            <i class="fa-solid fa-language fa-2xl"></i>
            <h2>Languages</h2>
        </div>
        <p>Cantonese, Mandarin, English</p>
        {/* Add more */}
      </section>

      {/* Add more sections: projects, certifications, etc. */}
    </div>
  );
}

export default Resume;