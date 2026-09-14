import { Link } from 'react-router-dom';

const UserIcon = () => (
  <div className="elementor-icon-wrapper">
    <div className="elementor-icon">
      <svg aria-hidden="true" className="e-font-icon-svg e-fas-user" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" />
      </svg>
    </div>
  </div>
);

const ExpandIcon = () => (
  <div className="elementor-icon-wrapper">
    <div className="elementor-icon">
      <svg aria-hidden="true" className="e-font-icon-svg e-fas-expand" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 180V56c0-13.3 10.7-24 24-24h124c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12H64v84c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12zM288 44v40c0 6.6 5.4 12 12 12h84v84c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12V56c0-13.3-10.7-24-24-24H300c-6.6 0-12 5.4-12 12zm148 276h-40c-6.6 0-12 5.4-12 12v84h-84c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h124c13.3 0 24-10.7 24-24V332c0-6.6-5.4-12-12-12zM160 468v-40c0-6.6-5.4-12-12-12H64v-84c0-6.6-5.4-12-12-12H12c-6.6 0-12 5.4-12 12v124c0 13.3 10.7 24 24 24h124c6.6 0 12-5.4 12-12z" />
      </svg>
    </div>
  </div>
);

/**
 * A single accommodation, rendered in the template's loop-item card markup so
 * it picks up the theme's card styling, but fed from the rooms API.
 */
const RoomCardTemplate = ({ room }) => {
  const detailPath = `/rooms/${room._id}`;
  const image = room.images?.[0] || '/images/rooms/room-01.jpg';

  return (
    <div
      data-elementor-type="loop-item"
      data-elementor-id="2712"
      className="elementor elementor-2712 e-loop-item mphb_room_type type-mphb_room_type"
    >
      <div className="elementor-element elementor-element-8526174 e-flex e-con-boxed e-con e-parent" data-element_type="container">
        <div className="e-con-inner">
          <div
            className="elementor-element elementor-element-8f43dae elementor-absolute elementor-widget elementor-widget-button"
            data-element_type="widget"
          >
            <Link className="elementor-button elementor-button-link elementor-size-sm elementor-animation-shrink" to={detailPath}>
              <span className="elementor-button-content-wrapper">
                <span className="elementor-button-text">BOOK NOW</span>
              </span>
            </Link>
          </div>

          <div className="elementor-element elementor-element-af38c86 e-con-full e-flex e-con e-child" data-element_type="container" />

          <div className="elementor-element elementor-element-ded53de e-con-full e-flex e-con e-child" data-element_type="container">
            <div className="elementor-element elementor-element-4de1b07 elementor-widget elementor-widget-image" data-element_type="widget">
              <Link to={detailPath}>
                <img width="1024" height="664" src={image} className="attachment-large size-large" alt={room.name} loading="lazy" />
              </Link>
            </div>
          </div>

          <div className="elementor-element elementor-element-e5a33ee e-con-full e-flex e-con e-child" data-element_type="container">
            <div className="elementor-element elementor-element-4144d9d e-con-full e-flex e-con e-child" data-element_type="container">
              <div className="elementor-element elementor-element-d7dc00e elementor-widget elementor-widget-heading" data-element_type="widget">
                <h3 className="elementor-heading-title elementor-size-default">
                  <Link to={detailPath}>{room.name}</Link>
                </h3>
              </div>
            </div>

            <div className="elementor-element elementor-element-7444f7c e-con-full elementor-hidden-mobile e-flex e-con e-child" data-element_type="container">
              <div className="elementor-element elementor-element-c85c9ea elementor-view-default elementor-widget elementor-widget-icon" data-element_type="widget">
                <UserIcon />
              </div>
              <div className="elementor-element elementor-element-ee68149 elementor-widget elementor-widget-heading" data-element_type="widget">
                <p className="elementor-heading-title elementor-size-default">
                  <Link to={detailPath}>Adults : {room.capacity}</Link>
                </p>
              </div>
              <div className="elementor-element elementor-element-8ae0b68 elementor-view-default elementor-widget elementor-widget-icon" data-element_type="widget">
                <ExpandIcon />
              </div>
              <div className="elementor-element elementor-element-3de7937 elementor-widget elementor-widget-heading" data-element_type="widget">
                <p className="elementor-heading-title elementor-size-default">
                  <Link to={detailPath}>Size : {room.size} m²</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCardTemplate;
