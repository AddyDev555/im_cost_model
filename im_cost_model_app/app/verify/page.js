import VerifyClient from "./verify-clinet";
import { Suspense } from "react";

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    Verifying…
                </div>
            }
        >
            <VerifyClient />
        </Suspense>
    );
}
