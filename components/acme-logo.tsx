import {GlobeAltIcon} from '@heroicons/react/24/outline';
import {lusitana} from '@/components/fonts';
import Image from "next/image";

export default function AcmeLogo({logoUrl}: {
  logoUrl: string | undefined;
}){
  return (
      <div
          className={`${lusitana.className} flex h-32 shrink-0 items-center justify-center pl-2`}
      >

      {logoUrl ?
          <Image src={logoUrl} alt={logoUrl} width={64} height={64} className="h-16 w-16 rounded-r-lg"/> :
      <GlobeAltIcon className="h-8 w-8 lg:h-16 lg:w-16 rotate-15" />
      }
    </div>
  );
}
