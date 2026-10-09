// This layout completely overrides the parent admin layout for the login page.
// No sidebar, no header, no navigation — just the bare login screen.
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
