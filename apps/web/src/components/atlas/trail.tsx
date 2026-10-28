import Link from "next/link";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

/** Where an entry sits in the atlas: the sections above it as links, the entry itself last. */
export function Trail({ trail }: { trail: readonly { name: string; path: string }[] }) {
  return (
    <Breadcrumb aria-label="مسیر صفحه">
      <BreadcrumbList>
        {trail.map((crumb, index) => (
          <Fragment key={crumb.path}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {index === trail.length - 1 ? (
                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={crumb.path}>{crumb.name}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
