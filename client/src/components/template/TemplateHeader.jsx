import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CircleIcon = () => (
  <span className="elementor-icon-list-icon">
    <svg aria-hidden="true" className="e-font-icon-svg e-fas-circle" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
    </svg>
  </span>
);

const NavLink = ({ to, children, onClick }) => (
  <li className="menu-item">
    <Link to={to} className="elementor-item" onClick={onClick}>
      {children}
    </Link>
  </li>
);

const SubNavLink = ({ to, children, onClick }) => (
  <li className="menu-item">
    <Link to={to} className="elementor-sub-item" onClick={onClick}>
      {children}
    </Link>
  </li>
);

const TemplateHeader = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const menuItems = (idPrefix) => (
    <ul id={idPrefix} className="elementor-nav-menu">
      <NavLink to="/" onClick={closeMenu}>Home</NavLink>
      <li className="menu-item menu-item-has-children">
        <Link to="/rooms" className="elementor-item" onClick={closeMenu}>Our Rooms</Link>
        <ul className="sub-menu elementor-nav-menu--dropdown">
          <SubNavLink to="/rooms" onClick={closeMenu}>All Accommodations</SubNavLink>
          <SubNavLink to="/rooms?type=suite" onClick={closeMenu}>Suites</SubNavLink>
          <SubNavLink to="/rooms?type=deluxe" onClick={closeMenu}>Deluxe Rooms</SubNavLink>
        </ul>
      </li>
      <li className="menu-item menu-item-has-children">
        <Link to="/about" className="elementor-item" onClick={closeMenu}>Pages</Link>
        <ul className="sub-menu elementor-nav-menu--dropdown">
          <SubNavLink to="/about" onClick={closeMenu}>About</SubNavLink>
          <SubNavLink to="/services" onClick={closeMenu}>Services</SubNavLink>
          <SubNavLink to="/contact" onClick={closeMenu}>Contact</SubNavLink>
        </ul>
      </li>
      {isAuthenticated ? (
        <li className="menu-item menu-item-has-children">
          <Link to="/profile" className="elementor-item" onClick={closeMenu}>
            {user?.firstName || user?.username || 'Account'}
          </Link>
          <ul className="sub-menu elementor-nav-menu--dropdown">
            <SubNavLink to="/my-bookings" onClick={closeMenu}>My Bookings</SubNavLink>
            <SubNavLink to="/profile" onClick={closeMenu}>My Profile</SubNavLink>
            {isStaff && <SubNavLink to="/admin" onClick={closeMenu}>Staff Portal</SubNavLink>}
            <li className="menu-item">
              <button type="button" className="elementor-sub-item motela-logout" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </li>
      ) : (
        <NavLink to="/login" onClick={closeMenu}>Sign In</NavLink>
      )}
      <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
    </ul>
  );

  return (
    <header
      data-elementor-type="header"
      data-elementor-id="22"
      className="elementor elementor-22 elementor-location-header"
    >
      <div
        className="elementor-element elementor-element-c57645c e-con-full elementor-hidden-mobile e-flex e-con e-parent"
        data-id="c57645c"
        data-element_type="container"
      >
        <div className="elementor-element elementor-element-fc2fd68 e-con-full e-flex e-con e-child" data-element_type="container">
          <div className="elementor-element elementor-element-738a589 elementor-icon-list--layout-inline elementor-align-left elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-element_type="widget">
            <ul className="elementor-icon-list-items elementor-inline-items">
              <li className="elementor-icon-list-item elementor-inline-item">
                <span className="elementor-icon-list-text">Best Rate Guarantee</span>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item">
                <CircleIcon />
                <span className="elementor-icon-list-text">24/7 Concierge</span>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item">
                <CircleIcon />
                <span className="elementor-icon-list-text">Free Cancellation</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="elementor-element elementor-element-4729039 e-con-full e-flex e-con e-child" data-element_type="container">
          <div className="elementor-element elementor-element-b5722d0 elementor-icon-list--layout-inline elementor-align-right elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-element_type="widget">
            <ul className="elementor-icon-list-items elementor-inline-items">
              <li className="elementor-icon-list-item elementor-inline-item">
                <span className="elementor-icon-list-text">+1 (555) 888-9900</span>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item">
                <CircleIcon />
                <span className="elementor-icon-list-text">reservations@luxurystay.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div
        className="elementor-element elementor-element-c54a532 e-con-full e-flex e-con e-parent"
        data-id="c54a532"
        data-element_type="container"
      >
        <div className="elementor-element elementor-element-d3ed2b5 e-con-full e-flex e-con e-child" data-element_type="container">
          <div className="elementor-element elementor-element-85b0f12 elementor-widget" data-element_type="widget">
            <Link to="/" className="motela-logo" aria-label="LuxuryStay Hospitality home">
              <span className="motela-logo__name">LuxuryStay</span>
              <span className="motela-logo__tagline">Hospitality</span>
            </Link>
          </div>
        </div>

        <div className="elementor-element elementor-element-dd529b1 e-con-full e-flex e-con e-child" data-element_type="container">
          <div
            className={`elementor-element elementor-element-332820d elementor-nav-menu__align-center elementor-nav-menu--stretch elementor-nav-menu--dropdown-tablet elementor-nav-menu__text-align-aside elementor-nav-menu--toggle elementor-nav-menu--burger elementor-widget elementor-widget-nav-menu${menuOpen ? ' elementor-active' : ''}`}
            data-element_type="widget"
          >
            <nav aria-label="Menu" className="elementor-nav-menu--main elementor-nav-menu__container elementor-nav-menu--layout-horizontal e--pointer-none">
              {menuItems('menu-primary')}
            </nav>

            <button
              type="button"
              className="motela-menu-toggle"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? (
                <svg aria-hidden="true" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                  <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                  <path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z" />
                </svg>
              )}
            </button>

            {menuOpen && (
              <nav className="motela-mobile-nav" aria-label="Mobile menu">
                {menuItems('menu-mobile')}
              </nav>
            )}
          </div>
        </div>

        <div className="elementor-element elementor-element-fdbc382 e-con-full elementor-hidden-mobile e-flex e-con e-child" data-element_type="container">
          <div className="elementor-element elementor-element-1c49cba elementor-align-right elementor-widget elementor-widget-button" data-element_type="widget">
            <Link className="elementor-button elementor-button-link elementor-size-sm elementor-animation-shrink" to="/rooms">
              <span className="elementor-button-content-wrapper">
                <span className="elementor-button-text">Book Now</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TemplateHeader;
