import { NavLink, Outlet } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiSmartphone, FiSettings } from 'react-icons/fi';
import clsx from 'classnames';

const navItems = [
  { to: '/', label: 'Visão Geral', icon: FiBarChart2, end: true },
  { to: '/devices', label: 'Dispositivos', icon: FiSmartphone },
];

function Layout() {
  return (
    <div className="relative min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute -top-40 right-[-10%] h-80 w-80 rounded-full bg-primary-500/30 blur-3xl" />
        <div className="absolute top-1/3 left-[-15%] h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] h-64 w-64 rounded-full bg-primary-700/40 blur-3xl" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <aside className="hidden w-72 flex-col border-r border-white/5 bg-slate-950/70 bg-gradient-to-b from-slate-950/80 via-slate-900/70 to-slate-950/40 backdrop-blur-2xl lg:flex">
          <div className="px-8 pt-10 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary-500 via-primary-400 to-accent shadow-card">
                <FiActivity className="text-slate-950" size={24} />
              </div>
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">Pulse</p>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/60">Monitor de dados</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white/70">
              <p className="font-medium text-white">Painel em tempo real</p>
              <p className="mt-1 text-white/60">Acompanhe consumo, limites e redes em uma única visão.</p>
            </div>
          </div>
          <nav className="mt-2 flex-1 px-6 pb-8 space-y-2">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-primary-500/30 via-primary-500/20 to-accent/20 text-white shadow-card ring-1 ring-primary-400/40'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white/80 group-hover:bg-white/10">
                  <Icon size={18} />
                </div>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="px-6 pb-10 pt-4 text-xs text-white/50">
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Resumo</p>
            <p className="mt-2 text-white/70">Monitoramento em tempo real de consumo de dados móveis, com alertas e tendências inteligentes.</p>
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/80 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">Painel de controle</p>
                <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">Monitor de Dados</h1>
                <p className="mt-1 text-sm text-white/60">
                  Acompanhe o uso de franquias e redes móveis em todas as linhas em um só lugar.
                </p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-3">
                <div className="hidden items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.25em] text-emerald-200 sm:flex">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.35)]" />
                  <span>Atualizado em tempo real</span>
                </div>
                <div className="hidden items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/70 sm:flex">
                  <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-primary-500 via-primary-400 to-accent" />
                  <div>
                    <p className="font-medium text-white">Admin</p>
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/50">Conta corporativa</p>
                  </div>
                  <FiSettings className="ml-2 text-white/50" size={16} />
                </div>
              </div>
            </div>
          </header>
          <main className="scrollbar-thin flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
              <Outlet />
            </div>
          </main>

          <nav className="fixed bottom-4 left-1/2 z-30 flex w-[min(100%-2rem,420px)] -translate-x-1/2 items-center justify-between rounded-2xl border border-white/10 bg-slate-950/90 px-4 py-2.5 text-xs shadow-card backdrop-blur-2xl lg:hidden">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 font-medium transition-colors',
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  )
                }
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
                  <Icon size={18} />
                </div>
                <span className="text-[11px]">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Layout;
