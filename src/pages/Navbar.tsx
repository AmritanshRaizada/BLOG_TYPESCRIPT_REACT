import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from '../Images/logo.jpg';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <>
      <nav>
        <div className="logo-container">
          <a href="https://visionandsolutions.com/">
            <img src={logo} alt="Logo" className="logo-img" />
          </a>
        </div>

        <div className="nav-part2">
          <div className="dropdown nav-elem">
            <h4>Services</h4>
            <div className="dropdown-menu">
              <a href="https://visionandsolutions.com/web.html"><p>Web Design & Development</p></a>
              <a href="https://visionandsolutions.com/SEO.html"><p>Search Engine Optimization</p></a>
              <a href="https://visionandsolutions.com/PPC.html"><p>Pay-Per-Click</p></a>
              <a href="https://visionandsolutions.com/Meta.html"><p>Meta Ads</p></a>
              <a href="https://visionandsolutions.com/influencer.html"><p>Influencer Marketing</p></a>
              <a href="https://visionandsolutions.com/whatsappMarketing.html"><p>Whatsapp Marketing</p></a>
              <a href="https://visionandsolutions.com/broadcasting.html"><p>Broadcasting Advertising</p></a>
              <a href="https://visionandsolutions.com/NewsPPPr.html"><p>Newspaper Printing</p></a>
              <a href="https://visionandsolutions.com/BillBo.html"><p>Billboard Advertisement</p></a>
            </div>
          </div>

          <a href="https://visionandsolutions.com/ourWork.html" className="nav-elem"><h4>OUR WORK</h4></a>
          <a href="https://visionandsolutions.com/About.html" className="nav-elem"><h4>About Us</h4></a>
          <a href="https://blog.visionandsolutions.com/" className="nav-elem"><h4>BLogs</h4></a>

          {/* Contact Us stays internal */}
          <Link to="https://visionandsolutions.com/contact.html">
            <button id="primary-contact-btn">
              Contact Us
              <svg fill="none" viewBox="0 0 20 20">
                <path
                  fill="#fff"
                  d="M2.5 14.375V17.5h3.125l9.217-9.217-3.125-3.125L2.5 14.375Zm14.758-8.508a.83.83 0 0 0 0-1.175l-1.95-1.95a.83.83 0 0 0-1.175 0l-1.525 1.525 3.125 3.125 1.525-1.525Z"
                />
              </svg>
            </button>
          </Link>
        </div>
        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      </nav>

      {/* Mobile Menu (external links) */}
<div className={`mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
  {[
    ["Web Design & Development", "web.html"],
    ["Search Engine Optimization", "SEO.html"],
    ["Pay-Per-Click", "PPC.html"],
    ["Meta Ads", "Meta.html"],
    ["Influencer Marketing", "influencer.html"],
    ["Whatsapp Marketing", "whatsappMarketing.html"],
    ["Broadcasting Advertising", "broadcasting.html"],
    ["Newspaper Printing", "NewsPPPr.html"],
    ["Billboard Advertisement", "BillBo.html"],
    ["OUR WORK", "ourWork.html"],
    ["ABOUT US", "About.html"],
    ["BLOGS", "https://blog.visionandsolutions.com/"],
    ["CONTACT US", "contact.html"],
  ].map(([label, url]) => (
    <a href={`https://visionandsolutions.com/${url}`} key={label}>
      <div className="menu-item">
        <span>{label}</span>
        <i className="ri-arrow-drop-right-line arrow-icon"></i>
      </div>
    </a>
  ))}
</div>


    </>
  );
};

export default Navbar;