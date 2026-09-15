import { Outlet } from 'react-router-dom';
import LuxuryTopBar from '../components/common/LuxuryTopBar';
import TemplateHeader from '../components/template/TemplateHeader';
import Footer from '../components/footer/Footer';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <LuxuryTopBar />
      <TemplateHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
