function SectionHeader({ title, subtitle }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <div className="h-4 w-1 rounded-full bg-gradient-to-b from-cyber-400 to-pulse" />
        <h2 className="font-display text-xl font-bold text-ghost sm:text-2xl">{title}</h2>
      </div>
      {subtitle ? (
        <p className="text-sm text-mist leading-relaxed ml-4">{subtitle}</p>
      ) : null}
    </div>
  );
}

export default SectionHeader;
