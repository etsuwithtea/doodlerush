import Dashboard from '@/components/ui/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-black">
      <Dashboard />
    </main>
  );
}
