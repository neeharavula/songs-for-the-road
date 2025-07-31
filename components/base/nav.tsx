export default function Nav() {
  return (
    <nav className="w-full flex items-center justify-between p-8 font-mono text-sm">
      <button>ADD A MEMORY</button>
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <button>SONGS FOR THE ROAD</button>
      </div>
      <button>PASSPORT</button>
    </nav>
  );
}
