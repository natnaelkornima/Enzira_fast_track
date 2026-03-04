import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './lib/LanguageContext';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import MarqueeGallery from './components/MarqueeGallery'
import RegistrationForm from './components/RegistrationForm'
import Footer from './components/Footer'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import CheckStatus from './components/CheckStatus'

function App() {
  return (
    <Router>
      <LanguageProvider>
        <div className="min-h-screen bg-dark-950">
          <Routes>
            <Route path="/" element={
              <>
                <Navbar />
                <Hero />
                <About />
                <MarqueeGallery />
                <RegistrationForm />
                <Footer />
              </>
            } />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/status" element={<CheckStatus />} />
          </Routes>
        </div>
      </LanguageProvider>
    </Router>
  )
}

export default App

