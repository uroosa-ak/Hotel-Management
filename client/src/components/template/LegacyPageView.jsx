import LegacyPage from './LegacyPage';
import { getLegacyPage } from '../../legacy';

/**
 * Renders one of the Motela template's pages by name (the marketing pages that
 * have no data behind them - about, services, contact, home).
 */
const LegacyPageView = ({ name }) => {
  const page = getLegacyPage(name);

  if (!page) {
    return (
      <div className="motela-empty">
        <p className="motela-text">This page is not available.</p>
      </div>
    );
  }

  return <LegacyPage html={page.html} scripts={page.scripts} bodyClass={page.bodyClass} />;
};

export default LegacyPageView;
