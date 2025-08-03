import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Register from './pages/Register';
import Login from './pages/Login';
import Collection from './pages/Collection';
import ViewNft from './pages/ViewNft';
import UserUpload from './pages/UserUpload';



function App() {
  const location = useLocation();
  useEffect(()=> {
    window.scrollTo(0,0)}, [location.pathname]
  )
  return (
    <AuthProvider>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/nft" element={<ViewNft />} />
          <Route path="/user-create" element={<UserUpload />} />
          {/* Add more routes here as needed */}
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
