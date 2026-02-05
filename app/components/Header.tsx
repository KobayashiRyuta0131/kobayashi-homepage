import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-gray-900 p-4 z-50 text-white">
      <nav className="flex flex-wrap gap-4 text-sm">
        <Link href="/" className="font-semibold">
          Ryuta Kobayashi Profile
        </Link>
        <Link href="/basic-info">基本情報</Link>
        <Link href="/experience">職務経歴</Link>
        <Link href="/skills">スキル</Link>
        <Link href="/qualifications">資格</Link>
        <Link href="/education">学歴</Link>
      </nav>
    </header>
  );
}
