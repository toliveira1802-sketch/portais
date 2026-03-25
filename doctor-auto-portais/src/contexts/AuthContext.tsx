import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { supabase, loginConsultor, logoutConsultor } from "../lib/supabase"

interface AuthState { consultor: any | null; company: any | null; loading: boolean }
interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ consultor: null, company: null, loading: true })

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        try {
          const { data: c } = await supabase
            .from("colaboradores_portal_consultor")
            .select("*")
            .eq("auth_user_id", session.user.id)
            .single()
          if (c) {
            const { data: company } = await supabase
              .from("companies")
              .select("nome, slug, cor_primaria, cidade, estado")
              .eq("id_companies", c.empresa_id)
              .single()
            setState({ consultor: c, company, loading: false })
            return
          }
        } catch {}
      }
      setState(s => ({ ...s, loading: false }))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === "SIGNED_OUT") setState({ consultor: null, company: null, loading: false })
    })
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { consultor } = await loginConsultor(email, password)
    setState({ consultor, company: consultor.companies, loading: false })
  }

  const logout = async () => {
    await logoutConsultor()
    setState({ consultor: null, company: null, loading: false })
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth fora do AuthProvider")
  return ctx
}
