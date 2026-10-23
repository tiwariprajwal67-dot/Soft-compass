import { createContext } from 'react'

// Holds "who is signed in right now". Read it with useAuth().
export const AuthContext = createContext(null)