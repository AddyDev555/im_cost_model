import { Suspense } from "react";
import VerifyClient from "./verify-clinet";

export const dynamic = "force-dynamic";

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Verifying…</div>}>
            <VerifyClient />
        </Suspense>
    );
}
