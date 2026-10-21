import { Suspense } from "react";

import { SandboxGateway } from "@/features/orders";

export default function SandboxGatewayPage() {
  return (
    <Suspense>
      <SandboxGateway />
    </Suspense>
  );
}
