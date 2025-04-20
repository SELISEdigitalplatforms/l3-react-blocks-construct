import { clients } from 'lib/https';
import { User } from 'types/user.type';
import { CreateUserFormType, ProfileFormType } from '../utils/utils';
import API_CONFIG from '../../../config/api';

/**
 * Fetches the account details of the currently authenticated user.
 *
 * @returns {Promise<User>} The user's account data.
 *
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const account = await getAccount();
 */

export const getAccount = async (): Promise<User> => {
  const res = await clients.get<{ data: User }>('/iam/v1/User/GetAccount');
  return res.data;
};

/**
 * Creates a new user account with the provided form data.
 *
 * @param {CreateUserFormType} data - The form data used to create the user account.
 *
 * @returns {Promise<{ itemId: string, errors: unknown, isSuccess: boolean }>}
 * The response containing the itemId, any errors, and the success status of the creation.
 *
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const response = await createAccount(formData);
 */

export const createAccount = (data: CreateUserFormType) => {
  return clients.post<{
    itemId: string;
    errors: unknown;
    isSuccess: boolean;
  }>('/iam/v1/User/Create', JSON.stringify(data));
};

/**
 * Updates the account profile of the currently authenticated user with the provided data.
 *
 * @param {ProfileFormType} data - The form data used to update the user's profile.
 *
 * @returns {Promise<{ itemId: string, errors: unknown, isSuccess: boolean }>}
 * The response containing the itemId, any errors, and the success status of the update.
 *
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const response = await updateAccount(profileData);
 */
export const updateAccount = (data: ProfileFormType) => {
  return clients.post<{
    itemId: string;
    errors: unknown;
    isSuccess: boolean;
  }>('/iam/v1/user/UpdateAccount', JSON.stringify(data));
};

/**
 * Changes the password for the currently authenticated user.
 *
 * @param {Object} params - The password change parameters.
 * @param {string} params.newPassword - The new password to set.
 * @param {string} params.oldPassword - The current password to authenticate the change.
 *
 * @returns {Promise<any>} The response from the server after attempting to change the password.
 *
 * @throws {Error} If the request fails or the server returns an error.
 *
 * @example
 * const response = await changePassword({ oldPassword: 'oldPass', newPassword: 'newPass' });
 */
export const changePassword = async ({
  newPassword,
  oldPassword,
}: {
  newPassword: string;
  oldPassword: string;
}) => {
  const payload = {
    newPassword,
    oldPassword,
    projectKey: API_CONFIG.blocksKey,
  };

  return clients.post('/iam/v1/Account/ChangePassword', JSON.stringify(payload));
};
