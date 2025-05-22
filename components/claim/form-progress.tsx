interface FormProgressProps {
  progress: number
}

export function FormProgress({ progress }: FormProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium">Completion</p>
        <p className="text-sm text-muted-foreground">{progress}%</p>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div className="h-full bg-emerald-500 transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
