import { useEffect, useRef, useContext, useState } from 'react';
import logo from "../../assets/images/logo.png";
import { NavLink, Link } from 'react-router-dom';
import { BiMenu } from "react-icons/bi";
import { authContext } from '../../context/AuthContext';
import { getToken } from '../../utils/auth';
import defaultAvatar from "../../assets/images/avatar-icon.png"; // Add this import
import ImageWithFallback from '../common/ImageWithFallback';

const navLinks = [
  {
    path: '/home',
    display: 'Home'
  },
  {
    path: '/doctors',
    display: 'Find a Doctor'
  },
  {
    path: '/services',
    display: 'Services'
  },
  {
    path: '/contact',
    display: 'Contact'
  },
];

const Header = () => {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { user, role } = useContext(authContext);
  const token = getToken();
  const [imageError, setImageError] = useState(false);
  const [imgKey, setImgKey] = useState(Date.now()); // Add this for forcing image refresh

  const handleScroll = () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      headerRef.current.classList.add('sticky_header');
    } else {
      headerRef.current.classList.remove('sticky_header');
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => menuRef.current.classList.toggle('show_menu');

  const handleImageError = () => {
    setImageError(true);
    setImgKey(Date.now()); // Force reload with default avatar
  };

  return (
    <header className="header flex items-center" ref={headerRef}>
      <div className="container">
        <div className="flex items-center justify-between">
          {/* logo */}
          <div>
            <img src={logo} alt="Logo" />
          </div>
          
          {/* menu */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <ul className="menu flex items-center gap-[2.7rem]">
              {navLinks.map((link, index) => (
                <li key={index}>
                  <NavLink
                    to={link.path}
                    className={navClass =>
                      navClass.isActive
                        ? "text-primaryColor text-[16px] leading-7 font-[600]"
                        : "text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor"
                    }
                  >
                    {link.display}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav right */}
          <div className="flex items-center gap-4">
            {token && user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={`${role === 'doctor' ? '/doctors/profile/me' : '/users/profile/me'}`}
                >
                  <figure className="w-[35px] h-[35px] rounded-full cursor-pointer overflow-hidden">
                    <ImageWithFallback
                      src={user?.photo}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </figure>
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-primaryColor py-2 px-6 text-white font-[600] h-[44px] flex items-center justify-center rounded-[50px]">
                  Login
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
