/**
 * Checks if a user is either the worker or the client on a specific gig.
 */
export const canAccessGig = (userId: string, gig: { workerId: string; clientId: string }): boolean => {
  return userId === gig.workerId || userId === gig.clientId;
};

/**
 * Checks if a user is trying to access their own user profile.
 */
export const canAccessUserProfile = (userId: string, targetUserId: string): boolean => {
  return userId === targetUserId;
};
