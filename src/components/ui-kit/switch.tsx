import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { cn } from '../../lib/utils';

function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'relative h-[24px] w-[44px] cursor-pointer rounded-full bg-neutral-200 data-[state=checked]:bg-primary',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'block size-[20px] translate-x-0.5 cursor-pointer rounded-full bg-white transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[19.5px] data-[state=unchecked]:bg-blocks-primary-500'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
