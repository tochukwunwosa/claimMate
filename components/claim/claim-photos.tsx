import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import React from "react"

export function ClaimPhotos({ photos }: { photos: string[] }) {
  if (!photos || photos.length === 0) return null

  return (
    <div>
      <h3 className="text-lg font-medium">Photos</h3>
      <Separator className="my-2" />
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo, index) => (
          <div key={index} className="relative aspect-square overflow-hidden rounded-md">
            <Image
              src={photo || "/placeholder.svg"}
              width={500}
              height={500}
              alt={`Claim photo ${index + 1}`}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
