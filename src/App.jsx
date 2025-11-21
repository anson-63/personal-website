// App.jsx
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Resume from './components/resume.jsx';
import Map from './components/proj/map.jsx';
import Login from './components/proj/login.jsx';
import sticker from './assets/sticker.webp';
import './App.css';





// Separate components for each page
function Home() {
  return (
    <>
      <div className='content'>
        <h1>About me</h1>
        <p>I'm a Year 3 student studying Information Engineering from Chinese University of Hong Kong, currently looking for opportunities to gain some 
          valuable work experience within your organization with strong
          communication skills, ability to perform under pressure, handle complex projects and to work as a team or independently.</p>
      </div>
    </>
  );
}

function Layout() {
  return (
    <div className='container'>
      {/* Navigation - always visible */}
      <div className='header'>
        <Link to='/personal-website'><h2>Home</h2></Link>
        <Link to='/resume'><h2>Resume</h2></Link>
        <div className="dropdown">
          <button className="dropbtn"><h2>Project</h2></button>
          <div className="dropdown-content">
            <Link to="/proj/map">Map</Link>
            <Link to="/proj/login">Additional features</Link>
            {/*<Link to="#">Link 3</Link>*/}
          </div>
        </div>
      </div>

      {/* Sidebar - always visible */}
      <div className='sidebar'>
        <div className="image-wrapper">
          <img src={sticker} alt="sticker" />
        </div>
        <br />
        <div className='box'>
          <i className="fa-solid fa-envelope fa-2xl"></i>
          <h3>Email</h3>
          <p>anson63w@gmail.com</p>
        </div>
        <div className='box'>
          <i className="fa-solid fa-mobile fa-2xl"></i>
          <h3>Phone</h3>
          <p>+852 9140 7007</p>
        </div>
        <div className='box'>
          <i className="fa-solid fa-location-dot fa-2xl"></i>
          <h3>Location</h3>
          <p>Hong Kong</p>
        </div>

        <div className='box'>
          <a href="https://www.linkedin.com/in/yin-wang-li-3362a835a" target="_blank" rel="noreferrer">
            <i className="fa-brands fa-linkedin fa-2xl"></i>
          </a>
          <h3>LinkedIn</h3>
          <p>Yin Wang Li</p>
        </div>
        
      </div>

      {/* This is where the routed content goes */}
      <div className='main-content'>
        <Routes>
          <Route path="/personal-website" element={<Home />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/proj/map" element={<Map />} />
          <Route path="/proj/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
      <Layout />
  );
}

export default App;