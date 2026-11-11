import { ServerProtectedRoute } from '@/components/ProtectedRouteGate';

export default function DirektoriPage() {
  return (
    <ServerProtectedRoute
      variant="direktori"
      requiredRole="member"
      renderAuthorized={async () => {
        const { default: DirektoriClient } = await import('./DirektoriClient');
        return <DirektoriClient />;
      }}
    />
  );
}
