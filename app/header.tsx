'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'

export function Header() {
  return (
    <header className="mb-6 flex items-center justify-between">
      <div>
        <Link href="/" className="text-[11px] font-medium tracking-tighter text-zinc-900 dark:text-white">
          Vasuki Sunder
        </Link>
        <TextEffect
          as="p"
          preset="fade"
          per="char"
          className="text-[10px] font-normal tracking-tight text-zinc-500 dark:text-zinc-400"
          delay={0.5}
        >
          Product Designer
        </TextEffect>
      </div>
    </header>
  )
}
