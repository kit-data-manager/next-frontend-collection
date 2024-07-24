import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div
      className={`${lusitana.className} flex h-30 shrink-0 items-end place-content-between rounded-lg bg-blue-500 p-4 md:h-30 text-white`}
    >
      <GlobeAltIcon className="h-16 w-16 rotate-[15deg] " />
      <p className="text-[44px]">Acme</p>
    </div>
  );
}
