import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { UserNav } from "@/components/admin-panel/user-nav";
import { ModeToggle } from "@/components/mode-toggle";

interface NavbarProps {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export function Navbar({
  title,
  firstName,
  lastName,
  email,
  role,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <ModeToggle />
          <UserNav
            firstName={firstName}
            lastName={lastName}
            email={email}
            role={role}
          />
        </div>
      </div>
    </header>
  );
}
