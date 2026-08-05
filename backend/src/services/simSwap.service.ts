/**
 * SimSwapService — Telecom Telemetry Provider (Mock Driver for V1 MVP)
 *
 * Production contract:
 *   The Africa's Talking Insights API returns a boolean indicating whether
 *   the given MSISDN has had a SIM swap within a configurable lookback window
 *   (default: 72 hours). This class mirrors that exact interface so swapping
 *   in the real API call is a one-line change inside checkSimSwap().
 *
 * Demo rules (deterministic for live demo reliability):
 *   FLAGGED  → +254700000000  (primary demo "bad actor" number)
 *            → any number ending in 999  (e.g. +254711111999)
 *            → any number ending in 000  (e.g. +254722000000)
 *   CLEAN    → everything else
 */

export class SimSwapService {
  /**
   * Designated demo numbers that always return a SIM-swap flag.
   * Add / remove entries here to control demo scenarios without
   * touching any other file.
   */
  private static readonly FLAGGED_NUMBERS: ReadonlySet<string> = new Set([
    '+254700000000', // primary demo "bad actor" seed
    '+254000000000', // secondary demo seed
  ]);

  /**
   * Suffix rules: if the local-number portion ends with one of these
   * digit sequences the SIM is considered recently swapped.
   */
  private static readonly FLAGGED_SUFFIXES: ReadonlyArray<string> = ['999', '000'];

  /**
   * Checks whether the given phone number has had a recent SIM swap.
   *
   * @param phoneNumber - E.164 formatted MSISDN (e.g. "+254712345678")
   * @returns           - true  → SIM was recently swapped (elevated risk)
   *                     false → SIM is stable (normal)
   *
   * TODO (Production):  Replace the mock body below with a real AT Insights
   *   API call.  The method signature and return type must not change.
   *
   *   const at = africastalking({ apiKey: process.env.AT_API_KEY!, username: process.env.AT_USERNAME! });
   *   const result = await at.Insights.checkSimSwap({ phoneNumbers: [phoneNumber] });
   *   return result[0]?.simSwapped ?? false;
   */
  static async checkSimSwap(phoneNumber: string): Promise<boolean> {
    // Normalise: strip whitespace, ensure consistent format
    const normalised = phoneNumber.trim();

    // 1. Exact-match lookup (O(1))
    if (SimSwapService.FLAGGED_NUMBERS.has(normalised)) {
      console.log(`[SimSwapService] FLAGGED (exact match): ${normalised}`);
      return true;
    }

    // 2. Suffix-pattern lookup — strips country prefix, checks local digits
    const digitsOnly = normalised.replace(/^\+/, '');
    const isFlaggedSuffix = SimSwapService.FLAGGED_SUFFIXES.some((suffix) =>
      digitsOnly.endsWith(suffix)
    );

    if (isFlaggedSuffix) {
      console.log(`[SimSwapService] FLAGGED (suffix pattern): ${normalised}`);
      return true;
    }

    // 3. Default — SIM is stable
    console.log(`[SimSwapService] CLEAN: ${normalised}`);
    return false;
  }
}
