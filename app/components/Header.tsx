import Link from "next/link"

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 p-4 z-50">
      <nav className="flex gap-4">
        <Link href="/">Ryuta Kobayashi Profile</Link>
        <Link href="/about">About</Link>
      </nav>
    </header>
  )
}
