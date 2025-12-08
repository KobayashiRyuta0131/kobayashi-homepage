import Header from "../app/components/Header"
import Footer from "../app/components/Footer"
import Image from "next/image"
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa"

export default function HomePage() {
  return (
    <>
    <Header />
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900">
      {/* Hero Section */}
      <section className="text-center mt-20">
        {/* 顔写真 */}
        <Image
          src="/KobayashiRyutaShikaku.jpg" // public/profile.jpg に画像を置く
          alt="プロフィール写真"
          width={160}
          height={160}
          className="rounded-full shadow-lg mx-auto" />

        {/* 名前と肩書 */}
        <h4 className="mt-6 text-sm font-bold">Kobayashi Ryuta</h4>
        <h1 className="mt-3 text-4xl font-bold">小林龍汰</h1>
        <p className="mt-2 text-xl text-gray-600">フルスタックエンジニア</p>

        {/* SNSリンク */}
        <div className="flex justify-center gap-6 mt-6 text-2xl">
          <a
            href="https://github.com/KobayashiRyuta0131"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-700"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/ryutakobayashi/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-700"
          >
            <FaLinkedin />
          </a>
          <a
            href="https://www.facebook.com/ryuta.kobayashi.779"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-sky-500"
          >
            <FaFacebook />
          </a>
        </div>
      </section>
    </main>
    <Footer />
    </>
  )
}