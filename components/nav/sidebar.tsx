'use client'
// source: https://github.com/Yudian00/shadcn-sidebar/tree/main
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, User  } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { admin_menus, contributor_menus, doesPathnameContainMenuHref, Menu } from "./menus";
import { signOut, useSession } from "next-auth/react";
import { UserRole } from "@/types/User";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";


export function SidebarMenu() {
    const router = useRouter();
    const pathname = usePathname();
    const { data } = useSession();
    const isLoggedIn: boolean = data? true: false;
    const role = data?.user.role;
    let menus: Menu[] = [];

    if(role === UserRole.Contributor) {
        menus = contributor_menus;
    } else if(role === UserRole.Admin) {
        menus = admin_menus;
    };

    const uniqueLabels = Array.from(new Set(menus.map((menu) => menu.label)));

    const handleLogout = async () => {
        await signOut();
        router.push('/auth/login');
        router.refresh();
    };

    return (
        <ScrollArea className="h-full lg:w-48 sm:w-full rounded-md flex flex-col">
            <div className="md:px-4 sm:p-0 mt-5 flex-grow">
                {uniqueLabels.map((label, index) => (
                    <React.Fragment key={label}>
                        {label && (
                            <p className={`mx-4 mb-3 text-xs text-left tracking-wider font-bold text-slate-300 ${index > 0 ? 'mt-10' : ''}`}>
                                {label}
                            </p>
                        )}
                        {menus
                            .filter((menu) => menu.label === label)
                            .map((menu) => (
                                <React.Fragment key={menu.name}>
                                    {menu.submenu && menu.submenu.length > 0 ? (
                                        <Accordion
                                            key={menu.name}
                                            type="single"
                                            className="mt-[-10px] mb-[-10px] p-0 font-normal"
                                            collapsible
                                        >
                                            <AccordionItem value="item-1" className="m-0 p-0 font-normal">
                                                <AccordionTrigger>
                                                    <a key={menu.name} className={`w-full flex justify-start text-xs font-normal h-10 bg-background my-2 items-center p-4 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-background rounded-md ${doesPathnameContainMenuHref({pathname, menuHref: menu.href})?'bg-primary dark:bg-primary dark:text-black text-white font-bold':''}`}>
                                                        <div className={cn("flex justify-between w-full [&[data-state=open]>svg]:rotate-180")}>
                                                            <div className="flex">
                                                                <div className="w-6">{menu.icon}</div>
                                                                {menu.name}
                                                            </div>
                                                            <ChevronDownIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
                                                        </div>
                                                    </a>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {menu.submenu.map((submenu) => (
                                                        <Link key={submenu.name} href={submenu.href} className={`text-gray-400 mt-0 mb-0 flex text-xs h-10 bg-white dark:bg-background dark:hover:bg-primary dark:hover:text-background my-2 items-center p-4 hover:bg-primary hover:text-white rounded-md ${doesPathnameContainMenuHref({pathname, menuHref: menu.href})?'bg-primary dark:bg-primary dark:text-black text-white font-bold':''}`}>
                                                            <div className="w-6">{submenu.icon}</div>
                                                            {submenu.name}
                                                        </Link>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        </Accordion>
                                    ) : (
                                        <div key={menu.name}>
                                            <Link href={menu.href} className={`flex text-xs h-10 dark:bg-background my-2 items-center p-4 hover:bg-primary dark:hover:bg-primary dark:hover:text-background hover:text-white rounded-md ${doesPathnameContainMenuHref({pathname, menuHref: menu.href})?'bg-primary dark:bg-primary dark:text-black text-white font-bold':'bg-white'}`}>
                                                <div className="w-6">{menu.icon}</div>
                                                {menu.name}
                                            </Link>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                    </React.Fragment>
                ))}
            </div>
            { isLoggedIn
                ?<div className="mt-auto p-3" >
                    <Button 
                        className="w-full" 
                        variant={'secondary'} 
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
                :<div className="flex justify-center items-center w-full p-3" >
                    <Button 
                        className="w-full" 
                        variant={'secondary'} 
                        onClick={()=> router.push('/auth/login')}
                    >
                        Login
                    </Button>
                </div>
            }
            
        </ScrollArea>
    );
}

