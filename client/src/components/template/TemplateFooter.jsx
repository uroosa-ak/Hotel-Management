import { Link } from 'react-router-dom';

const CircleIcon = () => (
  <span className="elementor-icon-list-icon">
    <svg aria-hidden="true" className="e-font-icon-svg e-fas-circle" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z" />
    </svg>
  </span>
);

const TemplateFooter = () => (
  <footer
    data-elementor-type="footer"
    data-elementor-id="125"
    className="elementor elementor-125 elementor-location-footer"
  >
    <div className="elementor-element elementor-element-380c8ab8 e-con-full e-flex e-con e-child" data-element_type="container">
      <div className="elementor-element elementor-element-7efa6d41 elementor-widget elementor-widget-heading" data-element_type="widget">
        <h4 className="elementor-heading-title elementor-size-default">Info :</h4>
      </div>
      <div className="elementor-element elementor-element-6d6442c9 elementor-align-right elementor-tablet-align-right elementor-mobile-align-center elementor-icon-list--layout-traditional elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-element_type="widget">
        <ul className="elementor-icon-list-items">
          <li className="elementor-icon-list-item">
            <span className="elementor-icon-list-text">Address : 100 Ocean Promenade, Paradise Bay</span>
          </li>
          <li className="elementor-icon-list-item">
            <span className="elementor-icon-list-text">Email : reservations@luxurystay.com</span>
          </li>
          <li className="elementor-icon-list-item">
            <span className="elementor-icon-list-text">Phone : +1 (555) 888-9900</span>
          </li>
        </ul>
      </div>
    </div>

    <div className="elementor-element elementor-element-29dc500f e-flex e-con-boxed e-con e-parent" data-element_type="container">
      <div className="e-con-inner">
        <div className="elementor-element elementor-element-22fcd029 e-con-full e-flex e-con e-child" data-element_type="container">
          <div className="elementor-element elementor-element-5618ee9d elementor-icon-list--layout-inline elementor-align-center elementor-tablet-align-center elementor-list-item-link-full_width elementor-widget elementor-widget-icon-list" data-element_type="widget">
            <ul className="elementor-icon-list-items elementor-inline-items">
              <li className="elementor-icon-list-item elementor-inline-item">
                <Link to="/rooms">
                  <span className="elementor-icon-list-text">Accommodations</span>
                </Link>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item">
                <CircleIcon />
                <Link to="/services">
                  <span className="elementor-icon-list-text">Services</span>
                </Link>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item">
                <CircleIcon />
                <Link to="/contact">
                  <span className="elementor-icon-list-text">Contact</span>
                </Link>
              </li>
              <li className="elementor-icon-list-item elementor-inline-item">
                <CircleIcon />
                <span className="elementor-icon-list-text">
                  &copy; {new Date().getFullYear()} LuxuryStay Hospitality
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default TemplateFooter;
