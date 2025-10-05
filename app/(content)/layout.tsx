import { DashboardLayout } from "@/components/dashboard-layout";

export default function ContentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
