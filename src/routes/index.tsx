import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "@/components/zira/phone";
import { ZiraApp } from "@/components/zira/zira-app";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (isPending || !user) {
    return (
      <Phone>
        <div className="flex flex-1 flex-col items-center justify-center gap-3">
          {isPending ? (
            <>
              <div className="h-16 w-16 animate-pulse rounded-full bg-line" />
              <p className="text-sm text-mist">Opening Zira…</p>
            </>
          ) : (
            <RedirectToSignIn />
          )}
        </div>
      </Phone>
    );
  }
  return <ZiraApp user={user} />;
}
