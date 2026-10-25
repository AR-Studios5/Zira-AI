import { createFileRoute } from "@tanstack/react-router";
import { ZiraApp } from "@/components/zira/zira-app";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  // Create a fake user directly on the page
  const dummyUser = {
    id: "admin-123",
    displayName: "Admin",
    primaryEmail: "admin@example.com",
    profileImageUrl: null,
    isDevFallback: true,
  };

  // Instantly load the main chat app, ignoring all authentication
  return <ZiraApp user={dummyUser} />;
}
