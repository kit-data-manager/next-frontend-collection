import {inter, lusitana} from '@/components/fonts';
import React, {Suspense} from "react";
import {CardsSkeleton} from "@/components/skeletons";
import {getServerSession, Session} from "next-auth";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import SiteSearch from "@/components/search/site-search";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {SearchX, ShieldCheck} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import SystemStats from "@/components/SystemStats/SystemStats";
import {Acl, DataResource, Permission} from "@/lib/definitions";
import {userCanEdit} from "@/lib/event-utils";

export default async function Page() {
    let session:Session | undefined = undefined;
    let authError = false;
    try {
        session = await getServerSession(authOptions) as Session;
    } catch (error) {
        authError = true;
    }

    let username = (!authError && session && session.user) ? session.user.name : "Anonymous User";
    const searchEnabled = process.env.NEXT_PUBLIC_SEARCH_BASE_URL != undefined;
    const welcome =  process.env.NEXT_PUBLIC_WELCOME ?  process.env.NEXT_PUBLIC_WELCOME : "<strong>Welcome" + username + ".</strong> This is an instance of the"+
    "<a href='https://nextjs.org/learn/'>"+
        
                                </Alert>
                            </div>
                        }
                    </div>
        </main>
);
}
