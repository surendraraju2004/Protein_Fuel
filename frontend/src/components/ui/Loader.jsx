export default function Loader({ size = 'md', text = '' }) {
  const sizes = { sm: 'w-6 h-6', md: 'w-10 h-10', lg: 'w-16 h-16' }
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className={`loader-ring ${sizes[size]}`} />
      {text && <p className="text-white/50 text-sm font-inter">{text}</p>}
    </div>
  )
}
