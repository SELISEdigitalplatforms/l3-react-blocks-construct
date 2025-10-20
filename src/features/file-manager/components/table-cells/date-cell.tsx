import { CustomtDateFormat } from '@/lib/custom-date-formatter';

export const DateCell = ({ date }: { date: Date | null | undefined }) => {
  if (!date) return <span className="text-muted-foreground">-</span>;

  return (
    <div className="flex items-center">
      <span className="text-sm">{CustomtDateFormat(date)}</span>
    </div>
  );
};
