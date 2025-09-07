import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { TEmail } from '../../types/email.types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { parseISO, format } from 'date-fns';
import CustomAvatar from 'components/blocks/custom-avatar/custom-avatar';

/**
 * EmailViewResponseType Component
 *
 * Displays the sender's information, recipient details, and provides a dropdown menu
 * to view more information about the email, such as sender, recipient, subject, date,
 * and email body. Typically used in the context of an email view to show metadata about
 * the selected email.
 *
 * Features:
 * - Displays sender's name with avatar
 * - Shows recipient details and subject
 * - Formats and displays email date and time
 * - Dropdown menu with additional email metadata (from, to, cc, subject, date)
 * - Responsive layout for both mobile and desktop views
 *
 * Props:
 * @param {TEmail} selectedEmail - The selected email object containing details such as sender, subject, and metadata
 *
 * @returns {JSX.Element} The component displaying the email metadata, sender information, and the dropdown for more options
 *
 * @example
 * // Basic usage
 * <EmailViewResponseType selectedEmail={selectedEmail} />
 */

interface EmailViewResponseTypeProps {
  selectedEmail: TEmail;
}

const EmailViewResponseType = ({ selectedEmail }: Readonly<EmailViewResponseTypeProps>) => {
  const { t } = useTranslation();

  function formatDateTime(dateString: string) {
    const formattedDate = format(parseISO(dateString), 'EEE, dd.MM.yyyy, HH:mm');
    return formattedDate;
  }

  return (
    <div className="flex justify-start items-center gap-2 h-fit ">
      <div className="flex justify-center items-center gap-4">
        <CustomAvatar
          name={
            Array.isArray(selectedEmail.sender)
              ? selectedEmail.sender.join(', ')
              : selectedEmail.sender
          }
          alt="Profile avatar"
          height={48}
          width={48}
        />
        <div>
          <p className="text-high-emphasis line-clamp-1">{selectedEmail.sender}</p>
          <div className="flex gap-1">
            <div className="text-sm text-medium-emphasis">
              {t('MAIL_TO')}{' '}
              <span className="text-high-emphasis font-semibold">{t('MAIL_ME')}</span> {t('AND')}{' '}
              <span className="text-high-emphasis font-semibold">2 {t('OTHERS')}</span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ChevronDown className="h-5 w-5 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[387px]">
                <div className="py-2 ps-2 pe-4">
                  <div className="flex  text-sm gap-2">
                    <div className="flex gap-4">
                      <p className="w-10 h-[22px] text-right text-low-emphasis">{t('FROM')}: </p>
                      <p className="text-high-emphasis">{selectedEmail.sender}</p>
                    </div>
                    <p className="text-medium-emphasis">{`<${selectedEmail.email}>`}</p>
                  </div>
                  <div className="flex  text-sm gap-2">
                    <div className="flex gap-4">
                      <p className="w-10 h-[22px] text-right text-low-emphasis">{t('MAIL_TO')}: </p>
                      <p className="text-high-emphasis">{t('MAIL_ME')}</p>
                    </div>
                    <p className="text-medium-emphasis">{`<demo@blocks.construct>`}</p>
                  </div>
                  <div className="flex  text-sm gap-2">
                    <div className="flex gap-4">
                      <p className="w-10 h-[22px] text-right text-low-emphasis">cc: </p>
                      <p className="text-high-emphasis">Tchanman</p>
                    </div>
                    <p className="text-medium-emphasis">{`<tochanman@gmail.com>`}</p>
                  </div>
                  <div className="flex  text-sm gap-2">
                    <div className="flex gap-4">
                      <p className="w-10 h-[22px] text-right text-low-emphasis">{t('DATE')}: </p>
                      <p className="text-high-emphasis">{`${formatDateTime(selectedEmail.date)}`}</p>
                    </div>
                  </div>
                  <div className="flex  text-sm gap-2">
                    <div className="flex gap-4">
                      <p className="w-10 h-[22px] text-right text-low-emphasis">{t('SUBJECT')}: </p>
                      <p className="text-high-emphasis">{selectedEmail.subject}</p>
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailViewResponseType;
