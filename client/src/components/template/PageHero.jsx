const PageHero = ({ title, subtitle, image = '/images/hero/hero-lobby.jpg', children }) => (
  <section className="motela-hero">
    <img src={image} alt="" className="motela-hero__image" />
    <div className="motela-hero__inner">
      <h1 className="motela-hero__title">{title}</h1>
      {subtitle && <p className="motela-hero__subtitle">{subtitle}</p>}
      {children}
    </div>
  </section>
);

export default PageHero;
