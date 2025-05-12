import { Button } from 'components/ui/button';
import { RefreshCcw } from 'lucide-react';
import temporaryUnavailable from 'assets/images/unavailable.svg';

/*testing from own branch*/
export default function ServiceUnavailable() {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-12">
        <img src={temporaryUnavailable} alt="" />
        <div className="flex flex-col items-center">
          <h1 className="text-high-emphasis font-bold text-[32px] leading-[48px]">
            This page is temporarily unavailable.
          </h1>
          <p className="mt-3 mb-6 text-medium-emphasis font-semibold text-2xl">
            Scheduled maintenance is in progress. Everything will be back to normal soon.
          </p>
          <Button className="font-bold text-sm">
            Reload Page
            <RefreshCcw />
          </Button>
        </div>
      </div>
    </div>
  );
}
