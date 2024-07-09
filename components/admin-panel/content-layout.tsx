import { Navbar } from "@/components/admin-panel/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
  firstame: string;
  lastName: string;
  email: string;
  role: string;
}

export function ContentLayout({
  title,
  children,
  firstame,
  lastName,
  email,
  role,
}: ContentLayoutProps) {
  return (
    <div>
      <Navbar
        title={title}
        firstName={firstame}
        lastName={lastName}
        email={email}
        role={role}
      />
      <div className="container pt-8 pb-8 px-4 sm:px-8 bg-background min-w-full">
        {children}
      </div>
    </div>
  );
}
