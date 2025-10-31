export const UserDetailItem = ({
  label,
  icon: Icon,
  value,
  allowLineBreak = false,
}: {
  label: string;
  icon: React.ComponentType<any>;
  value: string;
  allowLineBreak?: boolean;
}) => (
  <div className="flex items-start space-x-4">
    <div className="text-base font-thin text-medium-emphasis w-24">{label}</div>
    <div className={`flex ${allowLineBreak ? 'items-start' : 'items-center'} gap-2`}>
      <Icon className="w-5 h-5 text-high-emphasis mt-0.5" />
      <div
        className={`text-base font-normal text-high-emphasis ${allowLineBreak ? 'break-words' : ''}`}
      >
        {value}
      </div>
    </div>
  </div>
);
