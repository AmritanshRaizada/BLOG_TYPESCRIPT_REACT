import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Move your CSS styles here
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
              <Link to="/web"><p>Web Design & Development</p></Link>
              <Link to="/SEO"><p>Search Engine Optimization</p></Link>
              <Link to="/PPC"><p>Pay-Per-Click</p></Link>
              <Link to="/Meta"><p>Meta Ads</p></Link>
              <Link to="/influencer"><p>Influencer Marketing</p></Link>
              <Link to="/whatsappMarketing"><p>Whatsapp Marketing</p></Link>
              <Link to="/broadcasting"><p>Broadcasting Advertising</p></Link>
              <Link to="/NewsPPPr"><p>Newspaper Printing</p></Link>
              <Link to="/BillBo"><p>Billboard Advertisement</p></Link>
            </div>
          </div>
          <Link to="/ourWork" className="nav-elem"><h4>OUR WORK</h4></Link>
          <Link to="/About" className="nav-elem"><h4>About Us</h4></Link>
        </div>

        <Link to="/contact">
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

        <div className="hamburger" onClick={toggleMenu}>
          <div className="bar" />
          <div className="bar" />
          <div className="bar" />
        </div>
      </nav>

      <div className={`mobile-menu ${mobileMenuOpen ? 'show' : ''}`}>
        <Link to="/web"><p>Web Design & Development</p></Link>
        <Link to="/SEO"><p>Search Engine Optimization</p></Link>
        <Link to="/PPC"><p>Pay-Per-Click</p></Link>
        <Link to="/Meta"><p>Meta Ads</p></Link>
        <Link to="/influencer"><p>Influencer Marketing</p></Link>
        <Link to="/whatsappMarketing"><p>Whatsapp Marketing</p></Link>
        <Link to="/broadcasting"><p>Broadcasting Advertising</p></Link>
        <Link to="/NewsPPPr"><p>Newspaper Printing</p></Link>
        <Link to="/BillBo"><p>Billboard Advertisement</p></Link>
        <Link to="/ourWork"><p>OUR WORK</p></Link>
        <Link to="/About"><p>ABOUT US</p></Link>
        <Link to="/contact"><p>CONTACT US</p></Link>
      </div>
    </>
  );
};

export default Navbar;
