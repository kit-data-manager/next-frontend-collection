import {HiOutlineHome} from "react-icons/hi";
import {Breadcrumb} from "flowbite-react";
import {BreadcrumbEntry, theme} from "@/components/Breadcrumbs/Breadcrumbs.d";

export default function Breadcrumbs({
  breadcrumbs,
}: {
  breadcrumbs: BreadcrumbEntry[];
}) {

    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    return (
      <Breadcrumb theme={theme.root}>
          {breadcrumbs.map((breadcrumb, index) => {
              if (index === 0) {
                  return (<Breadcrumb.Item key={index} href={`${basePath}${breadcrumb.href}`} icon={HiOutlineHome} theme={theme.item} className={breadcrumb.active ? "underline":""}>
                      {breadcrumb.label}
                  </Breadcrumb.Item>)
              } else {
                  return (<Breadcrumb.Item key={index} href={`${basePath}${breadcrumb.href}`} theme={theme.item} className={breadcrumb.active ? "underline":""}>
                      {breadcrumb.label}
                  </Breadcrumb.Item>)
              }
          })}
      </Breadcrumb>
  );
}
