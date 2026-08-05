import { ShieldCheck, AlertTriangle, Loader2, Video, XCircle } from "lucide-react";

interface RiskStatusBannerProps {
  riskLevel?: 'low' | 'medium' | 'high' | null;
  message?: string;
  isLoading?: boolean;
}

export default function RiskStatusBanner({
  riskLevel,
  message,
  isLoading,
}: RiskStatusBannerProps) {
  const isPending = isLoading || !riskLevel;
  const isVerified = riskLevel === 'low';
  const isFlagged = riskLevel === 'medium' || riskLevel === 'high';

  if (isPending) {
    return (
      <div className="relative overflow-hidden rounded-card border border-amber/30 bg-amber/5 p-6 transition-all">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber">
            <Loader2 size={20} className="animate-spin" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-paper">
              Risk Verification Pending...
            </h3>
            <p className="mt-1 text-sm text-mist">
              Checking telecom telemetry and safety records. Please wait.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="relative overflow-hidden rounded-card border border-teal/30 bg-teal/10 p-6 transition-all shadow-[0_0_20px_-5px_rgba(46,230,199,0.15)]">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal/20 text-teal">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-teal-soft">
              Verified Pro — Safe to Proceed
            </h3>
            <p className="mt-1 text-sm text-paper">
              {message || "This worker has passed all security clearances."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isFlagged) {
    return (
      <div className="relative overflow-hidden rounded-card border border-danger/40 bg-danger/10 p-6 transition-all shadow-[0_0_20px_-5px_rgba(255,92,82,0.15)]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/20 text-danger animate-pulse-ring">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-display text-base font-semibold text-danger-soft">
                Safety Alert: Elevated Risk Detected
              </h3>
              <p className="mt-1 max-w-lg text-sm text-paper">
                {message || "Automated systems have flagged potential risk factors."}
              </p>
            </div>
          </div>
          
          <div className="flex shrink-0 flex-col gap-2 sm:min-w-[160px]">
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-danger px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-danger-soft">
              <Video size={16} />
              Request Video Call
            </button>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-danger/30 bg-transparent px-4 py-2 text-sm font-semibold text-danger transition-colors hover:bg-danger/10">
              <XCircle size={16} />
              Decline Job Safely
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
