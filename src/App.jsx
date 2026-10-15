import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollManager from './components/layout/scrollmanager.jsx'
import HomePage from './pages/HomePage.jsx'
import PersonalityPage from './pages/PersonalityPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import RiasecPage from './pages/RiasecPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import CompassCrew from './components/layout/CompassCrew.jsx'
import SoftDrift from './components/layout/SoftDrift.jsx'

export default function App() {
  return (
    <>
      <ScrollManager />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <CompassCrew />
      <SoftDrift />
      <main id="main">
        {/* Each Route says: "when the address is X, show page Y" */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/personality" element={<PersonalityPage />} />
          <Route path="/career-interests" element={<RiasecPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}