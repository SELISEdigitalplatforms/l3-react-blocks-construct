export interface ChangePasswordPayload {
  newPassword: string;
  oldPassword: string;
  projectKey?: string;
}
