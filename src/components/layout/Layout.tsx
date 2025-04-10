
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:pl-64">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center lg:hidden">
                <MobileNav />
                <h1 className="text-xl font-semibold">Laikipia Attendance</h1>
              </div>
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
