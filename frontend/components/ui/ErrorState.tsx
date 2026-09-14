import GremAvatar from "./GremAvatar";
import { RefreshCw } from "lucide-react";

const MESSAGES: Record<string, string> = {
  invalid_solana_address: "That doesn't look like a valid Solana address.",
  invalid_token_mint: "That doesn't look like a valid token mint address.",
  not_found: "GREM couldn't find this wallet.",
  no_token_data: "No market data found.",
  network_error: "GREM lost the trail. Try again.",
  provider_unavailable: "GREM lost the trail. Try again.",
};

export default function ErrorState({
  code = "network_error",
  onRetry,
  testid = "error-state",
}: {
  code?: string;
  onRetry?: () => void;
  testid?: string;
}) {
  const msg = MESSAGES[code] ?? "GREM lost the trail. Try again.";
  return (
    <div data-testid={testid} className="panel pixel-corner p-10 sm:p-14" style={{ borderColor: "rgba(239,68,68,0.28)" }}>
      <div className="flex flex-col items-center text-center">
        <div style={{ filter: "hue-rotate(280deg) saturate(0.7)" }}>
          <GremAvatar size={64} />
        </div>
        <h3 className="mt-6 display text-lg font-bold text-white">{msg}</h3>
        {onRetry && (
          <button data-testid="error-retry" onClick={onRetry} className="btn btn-ghost mt-6">
            <RefreshCw size={16} /> Try again
          </button>
        )}
      </div>
    </div>
  );
}
