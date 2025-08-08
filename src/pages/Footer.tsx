import React from 'react';
import './Footer.css';
import footerLogo from "../Images/logo-footer.png";



const Footer = () => {
  return (
    <div className="footer-section">
      <div className="container-fluid">
        <div className="row">
          {/* Column 1 - Logo + Address */}
          <div className="col-sm-6 col-md-6">
            <a href="https://visionandsolutions.com/" title="Go to homepage">
              <img
                src={footerLogo}
                alt="VisionAndSolutions"
                className="footer-logo"
              />
            </a>

            <div className="footer-address">
  <div className="footer-contact">
    <i className="ri-map-pin-2-fill icon-red"></i>
    <a
      href="https://maps.app.goo.gl/yTK8v9GAq4HWd1rm6"
      target="_blank"
      rel="noreferrer"
    >
      208, Plot No. CB-202A,<br />
      Guru Harkrishan Plaza, Ring Road,<br />
      Naraina, New Delhi - 110028
    </a>
  </div>

  <div className="footer-contact mt-2">
    <i className="ri-phone-fill icon-red"></i>
    <a href="tel:+918376000033">+91 83760-00033</a>
  </div>

  <div className="footer-contact">
   <i className="ri-mail-fill"></i>
    <a href="mailto:info@visionandsolutions.com">
      Info@visionandsolutions.com
    </a>
  </div>
</div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="col-sm-6 col-md-3">
            <p className="footer-heading">Quick Links :</p>
            <div className="footer-links">
              <a href="https://visionandsolutions.com/#page5">Our Services</a>
              <a href="https://visionandsolutions.com/ourWork.html">Our Work</a>
              <a href="https://visionandsolutions.com/About.html">About</a>
              <a href="https://visionandsolutions.com/./contact.html">Contact Us</a>
            </div>
          </div>

          {/* Column 3 - Social Icons */}
          <div className="col-md-3 col-sm-6">
            <p className="footer-heading">Our Social:</p>
            <div className="footer-socials">
              <a href="https://www.linkedin.com/company/vision-and-solution/" target="_blank" rel="noreferrer" className="social-icon linkedin">
                <i className="ri-linkedin-box-fill"></i>
              </a>
              <a href="https://www.instagram.com/visionandsolutionsofficial/" target="_blank" rel="noreferrer" className="social-icon instagram">
                <i className="ri-instagram-line"></i>
              </a>
              <a href="https://wa.me/+918376000033" target="_blank" rel="noreferrer" className="social-icon whatsapp">
                <i className="ri-whatsapp-line"></i>
              </a>
            </div>
          </div>
        </div>

        <hr />
        <div className="row">
          <div className="col-12 text-center copyright">
            <p>Copyright © 2023 All rights reserved by Vision and Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
