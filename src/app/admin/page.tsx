import { ServerProtectedRoute } from '@/components/ProtectedRouteGate';

export default function AdminPage() {
  return (
    <ServerProtectedRoute
      variant="admin"
      requiredRole="admin"
      renderAuthorized={async () => {
        const { default: AdminDashboardClient } = await import(
          './AdminDashboardClient'
        );
        return <AdminDashboardClient />;
      }}
    />
  );
}
