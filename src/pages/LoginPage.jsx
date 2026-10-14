import { useNavigate } from 'react-router-dom'
import Login from '../components/login/Login'

export default function LoginPage() {
  const navigate = useNavigate()

  return (
    <Login
      brand="Soft Compass"
      showDemo={true}
      onSuccess={() => {
        // After successful login → go home
        navigate('/')
      }}
      onGuest={() => {
        // Continue as guest → just go to the home page
        navigate('/')
      }}
      onForgot={() => alert('Forgot password – coming soon')}
      onSignup={() => alert('Create account – coming soon')}
    />
  )
}