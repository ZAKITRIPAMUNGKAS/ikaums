import { ServerProtectedRoute } from '@/components/ProtectedRouteGate';

export default function MemberAppPage() {
  return (
    <ServerProtectedRoute
      variant="member"
      requiredRole="member"
      renderAuthorized={async () => {
        const { default: MemberProfileClient } = await import(
          './MemberProfileClient'
        );
        return <MemberProfileClient />;
      }}
    />
  );
}
