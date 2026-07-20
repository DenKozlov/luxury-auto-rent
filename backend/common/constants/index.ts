export const INVITATION_TTL_DAYS = 7;

export enum InvitationStatus {
  Pending = 'PENDING',
  Accepted = 'ACCEPTED',
  Revoked = 'REVOKED',
  Expired = 'EXPIRED',
}

export enum EmailSubjectEnum {
  Deactivation = 'deactivation',
  Reactivation = 'reactivation',
  Invitation = 'invitation',
}
