import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

// Mock Supabase
vi.mock("../lib/supabase", () => ({
  supabase: {
    from: () => ({
      select: () => ({ eq: () => ({ eq: () => ({ order: () => ({ data: [], error: null }) }) }) }),
    }),
    auth: { getSession: () => Promise.resolve({ data: { session: null } }), onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }) },
  },
  loginConsultor: vi.fn(),
  logoutConsultor: vi.fn(),
  getClientes: vi.fn().mockResolvedValue([]),
  getVeiculosByCliente: vi.fn().mockResolvedValue([]),
  getOrdensServico: vi.fn().mockResolvedValue([]),
  createOrdemServico: vi.fn(),
  createCliente: vi.fn(),
  createVeiculo: vi.fn(),
  getDashboardStats: vi.fn().mockResolvedValue({ osAbertas: 0, osHoje: 0, clientesNoMes: 0, faturamentoMes: 0 }),
}))

describe("SelecionarPerfil", () => {
  it("renderiza tela de selecao de perfil", async () => {
    const { default: App } = await import("../App")
    render(<App />)
    expect(screen.getByText("Acessar Sistema")).toBeInTheDocument()
    expect(screen.getByText("Consultor")).toBeInTheDocument()
    expect(screen.getByText("Developer")).toBeInTheDocument()
  })

  it("mostra todos os 4 portais", async () => {
    const { default: App } = await import("../App")
    render(<App />)
    expect(screen.getByText("Consultor")).toBeInTheDocument()
    expect(screen.getByText("Gestao")).toBeInTheDocument()
    expect(screen.getByText("Mecanico")).toBeInTheDocument()
    expect(screen.getByText("Developer")).toBeInTheDocument()
  })
})

describe("useIsMobile", () => {
  it("retorna false em desktop", async () => {
    const { useIsMobile } = await import("../lib/useIsMobile")
    // window.innerWidth default is 1024 in jsdom
    const { renderHook } = await import("@testing-library/react")
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })
})
