import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="font-mono text-sm/6 text-center">
          <p className="mb-2 tracking-[-.01em]">Hi there!</p>
          <p className="tracking-[-.01em]">This app is under construction.</p>
        </div>
      </main>
      <footer className="row-start-3 text-sm/6 flex gap-[24px] flex-wrap items-center justify-center font-mono">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Developed with Next.js
        </a>
      </footer>
    </div>
  );
}
