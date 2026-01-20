import { NavLink, Outlet } from 'react-router-dom';
import { FiActivity, FiBarChart2, FiSmartphone, FiShield, FiWifi } from 'react-icons/fi';
import clsx from 'classnames';

const navItems = [
  { to: '/', label: 'Visão Geral', icon: FiBarChart2, end: true },
  { to: '/devices', label: 'Dispositivos', icon: FiSmartphone },
];

function Layout() {
  return (
    <div className="relative min-h-screen bg-void text-ghost">
      {/* Background effects */}
      <div className="pointer-events-none fixed inset-0 opacity-70">
        <div className="absolute -top-40 right-[-10%] h-96 w-96 rounded-full bg-cyber-400/20 blur-[100px]" />
        <div className="absolute top-1/3 left-[-15%] h-80 w-80 rounded-full bg-pulse/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[20%] h-72 w-72 rounded-full bg-cyber-600/30 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-72 flex-col border-r border-cyber-400/10 bg-space/90 backdrop-blur-2xl lg:flex">
          {/* Logo section */}
          <div className="px-6 pt-8 pb-6">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyber-400 via-cyber-500 to-pulse shadow-glow">
                <FiActivity className="text-void" size={28} />
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-2xl animate-ping bg-cyber-400/30" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold tracking-tight text-gradient-cyber">Monitor de Dados</h1>
                <p className="text-[10px] uppercase tracking-[0.35em] text-mist font-medium">Painel de Controle</p>
              </div>
            </div>

            {/* Status card */}
            <div className="mt-6 rounded-2xl glass-card glow-border p-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-3 w-3 rounded-full bg-pulse" />
                  <div className="absolute inset-0 rounded-full bg-pulse animate-ping opacity-50" />
                </div>
                <span className="text-xs font-medium text-pulse uppercase tracking-wider">Sistema Online</span>
              </div>
              <p className="mt-3 text-xs text-mist leading-relaxed">
                Monitoramento ativo em tempo real de consumo de dados móveis.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-2 flex-1 px-4 pb-8 space-y-1.5">
            <p className="px-3 mb-3 text-[10px] uppercase tracking-[0.3em] text-steel font-semibold">Navegação</p>
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'group flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300',
                    isActive
                      ? 'bg-gradient-to-r from-cyber-400/20 via-cyber-500/15 to-transparent text-cyber-300 shadow-glow-sm border-l-2 border-cyber-400'
                      : 'text-mist hover:bg-cyber-400/5 hover:text-ghost border-l-2 border-transparent'
                  )
                }
              >
                <div className={clsx(
                  'flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-300',
                  'bg-cyber-400/10 group-hover:bg-cyber-400/20'
                )}>
                  <Icon size={18} className="text-cyber-400" />
                </div>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer info */}
          <div className="px-6 pb-8 pt-4 border-t border-cyber-400/10">
            <div className="flex items-center gap-3 mb-4">
              <FiShield className="text-cyber-400" size={16} />
              <span className="text-[10px] uppercase tracking-[0.25em] text-steel font-semibold">Segurança</span>
            </div>
            <p className="text-xs text-mist leading-relaxed">
              Dados criptografados e transmissão segura. Alertas e tendências inteligentes.
            </p>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-cyber-400/10 bg-void/90 backdrop-blur-2xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FiWifi className="text-cyber-400" size={14} />
                  <span className="text-[10px] uppercase tracking-[0.35em] text-steel font-semibold">Painel de Controle</span>
                </div>
                <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
                  Monitor de <span className="text-gradient-cyber">Dados</span>
                </h1>
                <p className="mt-1.5 text-sm text-mist">
                  Acompanhe o uso de franquias e redes móveis em todas as linhas.
                </p>
              </div>

              <div className="flex flex-shrink-0 items-center gap-4">
                {/* Live indicator */}
                <div className="hidden items-center gap-2.5 rounded-full border border-pulse/30 bg-pulse/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-pulse sm:flex">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-pulse opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-pulse" />
                  </span>
                  <span>Tempo Real</span>
                </div>

                {/* User badge */}
                <div className="hidden items-center gap-3 rounded-2xl glass-card px-4 py-2.5 sm:flex">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyber-400 to-cyber-600 flex items-center justify-center">
                    <span className="text-void font-bold text-sm">A</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-ghost">Admin</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-steel">Conta Corporativa</p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="scrollbar-thin flex-1 overflow-y-auto">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
              <Outlet />
            </div>
          </main>

          {/* Mobile navigation */}
          <nav className="fixed bottom-4 left-1/2 z-30 flex w-[min(100%-2rem,420px)] -translate-x-1/2 items-center justify-around rounded-2xl border border-cyber-400/20 bg-space/95 px-4 py-3 shadow-glow backdrop-blur-2xl lg:hidden">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'flex flex-col items-center gap-1.5 rounded-xl px-4 py-2 font-medium transition-all duration-300',
                    isActive
                      ? 'text-cyber-400'
                      : 'text-mist hover:text-ghost'
                  )
                }
              >
                <div className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-xl transition-all',
                  'bg-cyber-400/10'
                )}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] uppercase tracking-wider">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Layout;
