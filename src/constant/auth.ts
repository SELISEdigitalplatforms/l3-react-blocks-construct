export enum GRANT_TYPES {
  password = 'password',
  social = 'social',
  clientCredential = 'client-credential',
  oidc = 'authorization_code',
}

export const GRANT_TYPES_OPTIONS: { id: GRANT_TYPES; label: string; value: string }[] = [
  { id: GRANT_TYPES.password, label: 'Email/Password', value: GRANT_TYPES.password },
  { id: GRANT_TYPES.social, label: 'Social Login', value: GRANT_TYPES.social },
  {
    id: GRANT_TYPES.clientCredential,
    label: 'Client Credential',
    value: GRANT_TYPES.clientCredential,
  },
];
