export function SettingsPageTitle({ title }: { title: string }) {
  return (
    <span className="text-xl font-semibold text-stone-500">
      {title}

      <hr className="mt-3 h-px w-full bg-stone-200/70" />
    </span>
  )
}
