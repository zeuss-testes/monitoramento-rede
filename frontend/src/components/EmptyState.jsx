import { FiInbox } from 'react-icons/fi';

function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-2xl glass-card glow-border px-8 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyber-400/10 border border-cyber-400/20">
        <FiInbox className="text-cyber-400" size={28} />
      </div>
      <div>
        <h3 className="font-display text-xl font-bold text-ghost">{title}</h3>
        {description ? <p className="mt-2 max-w-lg text-sm text-mist">{description}</p> : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export default EmptyState;
