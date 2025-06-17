import {
  type AuthResult,
  auth,
} from "@modelcontextprotocol/sdk/client/auth.js";
import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Spinner } from "../../components/ui/spinner";
import {
  InspectorOAuthClientProvider,
  SESSION_KEYS,
} from "../../providers/connection/auth";
import {
  generateOAuthErrorDescription,
  parseOAuthCallbackParams,
} from "./utils";

type OAuthCallbackProps = {
  onConnect: (serverUrl: string) => void;
};

export default function OAuthCallback({ onConnect }: OAuthCallbackProps) {
  const hasProcessedRef = useRef(false);
  const navigate = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const handleCallback = async () => {
      // Skip if we've already processed this callback
      if (hasProcessedRef.current) {
        return;
      }
      hasProcessedRef.current = true;

      const notifyError = (description: string) =>
        void toast.error(description);

      const params = parseOAuthCallbackParams(window.location.search);
      if (!params.successful) {
        return notifyError(generateOAuthErrorDescription(params));
      }

      const serverUrl = sessionStorage.getItem(SESSION_KEYS.SERVER_URL);
      if (!serverUrl) {
        return notifyError("Missing Server URL");
      }

      let result: AuthResult;
      try {
        // Create an auth provider with the current server URL
        const serverAuthProvider = new InspectorOAuthClientProvider(serverUrl);

        result = await auth(serverAuthProvider, {
          serverUrl,
          authorizationCode: params.code,
        });
      } catch (error) {
        console.error("OAuth callback error:", error);
        return notifyError(`Unexpected error occurred: ${error}`);
      }

      if (result !== "AUTHORIZED") {
        return notifyError(
          `Expected to be authorized after providing auth code, got: ${result}`,
        );
      }

      // Finally, trigger auto-connect
      toast.success("Successfully authenticated with OAuth");
      onConnect(serverUrl);
    };

    handleCallback().finally(() => navigate("/"));
  }, [onConnect]);

  return (
    <div className="flex flex-col gap-2 items-center justify-center h-screen select-none">
      <Spinner className="size-8 min-w-8 min-h-8" />
      <p className="text-lg font-medium text-muted-foreground">
        Processing OAuth callback
      </p>
    </div>
  );
}
