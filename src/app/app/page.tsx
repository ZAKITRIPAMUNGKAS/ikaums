import { ServerProtectedRoute } from '@/components/ProtectedRouteGate';
import { getCmsData } from '@/lib/cms-store';

export default function MemberAppPage() {
  return (
    <ServerProtectedRoute
      variant="member"
      requiredRole="member"
      renderAuthorized={async () => {
        const [cmsData, { default: MemberProfileClient }] = await Promise.all([
          getCmsData(),
          import('./MemberProfileClient'),
        ]);
        return <MemberProfileClient initialAgendas={cmsData.agendas || []} />;
      }}
    />
  );
}
