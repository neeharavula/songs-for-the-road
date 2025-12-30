"use client";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full flex items-center justify-between p-8 font-mono text-xs">
      <button>INFO</button>
      <button>© {currentYear}</button>
    </footer>
  );
}
