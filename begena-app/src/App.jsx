import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import RegistrationForm from './components/RegistrationForm'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      <Hero />
      <About />
      <RegistrationForm />
      <Footer />
    </div>
  )
}

export default App
