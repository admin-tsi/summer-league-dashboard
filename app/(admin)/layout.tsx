import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <AdminPanelLayout>{children}</AdminPanelLayout>
    </SessionProvider>
  );
}
