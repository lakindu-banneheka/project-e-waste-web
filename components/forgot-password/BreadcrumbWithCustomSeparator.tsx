import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Tabs } from "@/types/forgot-password-tabs";

interface BreadcrumProps {
    breadcrumValues: Tabs[],
    max: number;
    setBreadcrumbValues: React.Dispatch<React.SetStateAction<Tabs[]>>
    isDisabled?: boolean;
}

export function BreadcrumbWithCustomSeparator({breadcrumValues, max, setBreadcrumbValues, isDisabled=false}: BreadcrumProps) { 

    const onClick = (value: Tabs) => {
        let newBreadCrumValues: Tabs[] = [];

        if(!isDisabled){
            let i = 0;
            // Iterate through the breadcrumValues and add items to newBreadCrumValues until a mismatch is found
            do {
                newBreadCrumValues.push(breadcrumValues[i]);
                i++;
            } while (i < breadcrumValues.length && breadcrumValues[i] === value);

            // If the new breadcrumb values are empty, set it to [Tabs.EMAIL]
            if (newBreadCrumValues.length === 0) {
                setBreadcrumbValues([Tabs.EMAIL]);
            } else {
                setBreadcrumbValues(newBreadCrumValues);
            }
        }
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
                                className="hover:underline no-underline transition-all duration-300 cursor-pointer"
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
