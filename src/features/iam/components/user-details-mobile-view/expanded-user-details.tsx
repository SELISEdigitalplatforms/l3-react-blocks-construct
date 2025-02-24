import { Button } from 'components/ui/button';
import { IamData } from '../../services/user-service';

interface ExpandedUserDetailsProps {
  user: IamData;
  onResetPassword: (user: IamData) => void;
  onResendActivation: (user: IamData) => void;
}

const ExpandedUserDetails: React.FC<ExpandedUserDetailsProps> = ({
  user,
  onResetPassword,
  onResendActivation,
}) => {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium text-medium-emphasis">Email</h3>
          <p className="text-sm text-high-emphasis">{user.email}</p>
        </div>

        <div className="flex justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">Mobile no.</h3>
            <p className="text-sm text-high-emphasis">{user.phoneNumber || '-'}</p>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">Joined on</h3>
            <p className="text-sm text-high-emphasis">
              {new Date(user.createdDate).toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium text-medium-emphasis">Last log in</h3>
            <p className="text-sm text-high-emphasis">
              {user.lastLoggedInTime
                ? new Date(user.lastLoggedInTime).toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </p>
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex-1">
            <h3 className="text-sm  text-medium-emphasis">Status</h3>
            <h3 className={user.active ? 'text-success ' : 'text-error'}>
              {user.active ? 'Active' : 'Deactivated'}
            </h3>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-medium-emphasis">MFA</h3>
            <p className="text-sm text-high-emphasis">{user.mfaEnabled ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => onResetPassword(user)}
        >
          Reset Password
        </Button>
        <Button
          variant="default"
          size="sm"
          className="flex-1 bg-primary hover:bg-primary"
          onClick={() => onResendActivation(user)}
        >
          Activate User
        </Button>
      </div>
    </div>
  );
};

export default ExpandedUserDetails;
