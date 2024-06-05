import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface BreadcrumProps {
    breadcrumValues: string[],
    max: number;
}

export function BreadcrumbWithCustomSeparator({breadcrumValues, max}: BreadcrumProps) { 

    const onClick = (value: string) => {

    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                { breadcrumValues.map((value, index) => (
                    <>
                        <BreadcrumbItem>
                        <BreadcrumbLink>
                            <BreadcrumbPage
                                onClick={()=>onClick(value)}
                            >
                                {value}
                            </BreadcrumbPage>
                        </BreadcrumbLink>
                        </BreadcrumbItem>
                        { max > (index + 1)
                            ? <BreadcrumbSeparator />
                            : <></>
                        }
                    </>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    )
}
