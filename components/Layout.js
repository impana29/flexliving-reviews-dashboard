export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <h1 className="text-2xl font-semibold">Flex Living — Reviews Dashboard</h1>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">{children}</main>
      <footer className="text-center text-sm p-4 text-slate-500">© Flex Living</footer>
    </div>
  );
}
