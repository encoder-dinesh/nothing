import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Destinations from './pages/Destinations';
import BookRide from './pages/BookRide';
import Guides from './pages/Guides';
import Dashboard from './pages/Dashboard';

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onNavigate={setCurrentPage} />;
      case 'signin':
        return <SignIn onNavigate={setCurrentPage} />;
      case 'signup':
        return <SignUp onNavigate={setCurrentPage} />;
      case 'destinations':
        return <Destinations />;
      case 'rides':
        return <BookRide onNavigate={setCurrentPage} />;
      case 'guides':
        return <Guides onNavigate={setCurrentPage} />;
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      default:
        return <Home onNavigate={setCurrentPage} />;
    }
  };

  const showFooter = currentPage !== 'signin' && currentPage !== 'signup';

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
        <div className="flex-grow">
          {renderPage()}
        </div>
        {showFooter && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;
