import { ReactNode } from 'react';
import { Button } from '@/components/ui-kit/button';

interface ErrorStateProps {
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonIcon?: ReactNode;
}

export const CustomErrorView = ({
  image,
  title,
  description,
  buttonText,
  buttonIcon,
}: Readonly<ErrorStateProps>) => {
  return (
    <div className="flex justify-center items-center w-full">
      <div className="flex flex-col gap-12">
        <img src={image} alt="error state" />
        <div className="flex flex-col items-center">
          <h1 className="text-high-emphasis font-bold text-[32px] leading-[48px]">{title}</h1>
          <p className="mt-3 mb-6 text-medium-emphasis font-semibold text-2xl">{description}</p>
          <Button className="font-bold text-sm">
            {buttonText}
            {buttonIcon}
          </Button>
        </div>
      </div>
    </div>
  );
};
