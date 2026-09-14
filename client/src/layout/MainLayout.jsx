import { Outlet, useLocation } from 'react-router-dom';
import LuxuryTopBar from '../components/common/LuxuryTopBar';
import TemplateHeader from '../components/template/TemplateHeader';
import TemplateFooter from '../components/template/TemplateFooter';

const MOTELA_EXACT_PATHS = [
  '/',
  '/rooms',
  '/about',
  '/prices',
  '/services',
  '/contact',
  '/coming-soon',
  '/shop',
  '/blog',
];

const isMotelaThemePage = (pathname) => {
  if (MOTELA_EXACT_PATHS.includes(pathname)) return true;
  // Match dynamic routes like /rooms/single-room, /blog/post-1, /shop/product-1
  if (pathname.startsWith('/shop/') || pathname.startsWith('/blog/')) {
    return true;
  }
  if (pathname.startsWith('/rooms/')) {
    return true;
  }
  return false;
};

const MainLayout = () => {
  const location = useLocation();
  const isMotela = isMotelaThemePage(location.pathname);

  return (
    <>
      <LuxuryTopBar />
      {!isMotela && <TemplateHeader />}
      <main>
        <Outlet />
      </main>
      {!isMotela && <TemplateFooter />}
    </>
  );
};

export default MainLayout;
