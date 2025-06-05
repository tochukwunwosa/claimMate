import Image from "next/image"
import Link from "next/link"

export default function Logo() {
  return <Link href="/" className={("h-12 flex items-center gap-2")}>
    <div className="size-8 flex items-center">
      <Image src={'/logos/claimmate-logo-sm.png'} width={40} height={40} alt="ClaimMate logo" className='size-8' />
    </div>

    <div className="w-24 flex items-center">
      <Image src={'/logos/claimmate-logo-text.png'} width={250} height={40} alt="ClaimMate logo" className='w-full' />
    </div>
  </Link>
}