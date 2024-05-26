import React from 'react';

import './footer.scss';

import { Link } from 'react-router-dom';

import bg from '../../assets/footer-bg.jpg';
import logo from '../../assets/m.png';

const Footer = () => {
    return (
        <div className="footer" style={{backgroundImage: `url(${bg})`}}>
            <div className="footer__content container">
                <div className="footer__content__logo">
                    <div className="logo">
                        <img src={logo} alt="NEPX Logo" />
                        <Link to="/">NEPX</Link>
                    </div>
                </div>
                <div className="footer__content__info">
                    <p>&copy; {new Date().getFullYear()} NEPX</p>
                    <p>This website does not host any content. Everything is hosted as an API and found free from other sites. Video URLs are from Vidsrc.</p>
                </div>
            </div>
        </div>
    );
}

export default Footer;
