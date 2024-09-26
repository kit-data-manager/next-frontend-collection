import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/components/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex h-30 shrink-0 items-end place-content-between rounded-lg p-4`}
    >
      <GlobeAltIcon className="h-8 w-8 lg:h-16 lg:w-16 rotate-[15deg]" />
    </div>
  );
}
