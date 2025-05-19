import { useEffect, useState } from "react"

export default function AnimatedDots({text}: {text: string}) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return <span className="text-center">{text}{dots}</span>
}
