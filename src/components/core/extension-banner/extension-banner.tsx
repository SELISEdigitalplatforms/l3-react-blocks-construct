import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui-kit/button';
import { SquareArrowOutUpRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ExtensionBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const location = useLocation();
  const { t } = useTranslation();

  if (location.pathname !== '/login') return null;

  const isBannerAllowedToVisible = [
    'construct.seliseblocks.com',
    'stg-construct.seliseblocks.com',
    'dev-construct.seliseblocks.com',
  ].some((domain) => window.location.hostname === domain);

  return (
    isBannerAllowedToVisible &&
    showBanner && (
      <div className="sm:relative w-full flex items-center sm:justify-between bg-surface py-3 px-4">
        <div className="flex w-full items-center justify-center gap-2">
          <span className="text-sm">
            {t('EXPERIENCE_UILM_CAPABILITIES_CONSTRUCT')}{' '}
            <a
              href="https://selisegroup.com/blocks/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold underline hover:text-primary"
            >
              {t('LEARN_MORE')}
            </a>
          </span>
          <a
            href="https://chromewebstore.google.com/detail/ehnhmdghlkaeaiinoahgipdeogkikjem?utm_source=item-share-cb"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm" className="!gap-0">
              <span className="capitalize font-bold text-sm hidden sm:inline">
                {t('GET_EXTENSION')}
              </span>
              <SquareArrowOutUpRight className="h-4 w-4 sm:ml-2" />
            </Button>
          </a>
        </div>
        <div className="sm:absolute sm:top-4 sm:right-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowBanner(false)}
            className="h-fit w-fit p-1 rounded hover:bg-neutral-100 text-medium-emphasis"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  );
};
