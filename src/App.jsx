import { Routes, Route } from 'react-router-dom'
import Header from './components/layout/Header.jsx'
import Footer from './components/layout/Footer.jsx'
import ScrollManager from './components/layout/scrollmanager.jsx'
import RouteMeta from './components/layout/RouteMeta.jsx'
import SoftDrift from './components/layout/SoftDrift.jsx'
import CompassCrew from './components/layout/CompassCrew.jsx'
import RequireAuth from './auth/RequireAuth.jsx'
import HomePage from './pages/HomePage.jsx'
import PersonalityPage from './pages/PersonalityPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PrivacyPage from './pages/PrivacyPage.jsx'
import TermsPage from './pages/TermsPage.jsx'
import RiasecPage from './pages/RiasecPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx'
import ResetPasswordPage from './pages/ResetPasswordPage.jsx'
import AccountPage from './pages/AccountPage.jsx'
import ReportPage from './pages/ReportPage.jsx'


export default function App() {
  return (
    <>
      <SoftDrift />
      <ScrollManager />
      <RouteMeta />
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header />
      <main id="main">
        {/* Each Route says: "when the address is X, show page Y" */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/personality" element={<PersonalityPage />} />
          <Route path="/career-interests" element={<RiasecPage />}
 />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/privacy"
            element={<PrivacyPage />}
          />
          <Route
            path="/terms"
            element={<TermsPage />}
          />
          <Route
            path="/account"
            element={
              <RequireAuth>
                <AccountPage />
              </RequireAuth>
            }
          />
          <Route
            path="/report"
            element={
              <RequireAuth>
                <ReportPage />
              </RequireAuth>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <CompassCrew />
    </>
  )
}