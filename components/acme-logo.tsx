import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/components/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex h-30 shrink-0 items-end place-content-between rounded-lg p-4 md:h-30`}
    >
      <GlobeAltIcon className="h-16 w-16 rotate-[15deg] " />
    </div>
  );
}
