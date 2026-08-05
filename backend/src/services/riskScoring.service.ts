export interface RiskProfileInput {
  kycStatus: 'unverified' | 'pending' | 'verified';
  simSwapFlag: boolean;
  communityRating: string | number; // Decimal comes back as string from pg
  createdAt: Date;
}

export class RiskScoringService {
  /**
   * Pure function to calculate a risk score (0-100) based on user signals.
   */
  static calculateRiskScore(user: RiskProfileInput): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];

    // 1. KYC Status Check
    if (user.kycStatus === 'unverified') {
      score += 40;
      reasons.push('Unverified KYC');
    } else if (user.kycStatus === 'pending') {
      score += 15;
      reasons.push('Pending KYC verification');
    }

    // 2. SIM Swap Check
    if (user.simSwapFlag) {
      score += 35;
      reasons.push('Recent SIM swap detected');
    }

    // 3. Community Rating Check
    const rating = typeof user.communityRating === 'string' 
      ? parseFloat(user.communityRating) 
      : user.communityRating;
      
    if (rating < 3.0) {
      score += 20;
      reasons.push('Very low community rating (< 3.0)');
    } else if (rating < 4.0) {
      score += 10;
      reasons.push('Low community rating (< 4.0)');
    }

    // 4. Account Age Check
    const daysSinceCreation = (new Date().getTime() - user.createdAt.getTime()) / (1000 * 3600 * 24);
    if (daysSinceCreation < 7) {
      score += 10;
      reasons.push('New account (< 7 days old)');
    }

    // Clamp maximum score at 100
    if (score > 100) score = 100;

    return { score, reasons };
  }

  /**
   * Fallback rule-based risk classification
   */
  static mapScoreToRiskLevel(score: number): 'low' | 'medium' | 'high' {
    if (score <= 30) return 'low';
    if (score <= 60) return 'medium';
    return 'high';
  }
}
