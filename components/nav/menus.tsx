import { LayoutDashboardIcon, ListTodo, LayoutList, FileClock, CircuitBoard, Heater} from "lucide-react";

export type Menu = {
    label: string
    name: string
    icon: React.ReactNode
    submenu?: Submenu[]
    href: string
}

export type Submenu = {
    name: string
    icon: React.ReactNode
    href: string
}

export const doesPathnameContainMenuHref = ({pathname, menuHref}: {
    pathname: string, 
    menuHref: string
  }): boolean => {
    return pathname.includes(menuHref);
  };


export const admin_menus: Menu[] = [
    {
        label: "",
        name: "Dashboard",
        icon: <LayoutDashboardIcon size={15} className="mr-2" />,
        href: "/dashboard",
    },
    {
        label: "",
        name: "Projects",
        icon: <LayoutList size={15} className="mr-2" />,
        href: "/projects",
    },
    {
        label: "",
        name: "Review Work",
        icon: <ListTodo size={15} className="mr-2" />,
        href: "/review-work",
    },
    {
        label: "",
        name: "Add Admin",
        icon: <LayoutList size={15} className="mr-2" />,
        href: "/admin/register",
    },
    {
        label: "",
        name: "Work History",
        icon: <FileClock size={15} className="mr-2" />,
        href: "/work-history",
    },
    {
        label: "E-Waste",
        name: "Inventory",
        icon: <Heater size={15} className="mr-2" />,
        href: "/e-waste/inventory",
    },
    {
        label: "E-Waste",
        name: "Recovered Items",
        icon: <CircuitBoard size={15} className="mr-2" />,
        href: "/e-waste/recovered-items",
    },
    {
        label: "E-Waste",
        name: "Failure Reasons",
        icon: <CircuitBoard size={15} className="mr-2" />,
        href: "/e-waste/failure-reasons",
    },
];

export const contributor_menus: Menu[] = [
    {
        label: "",
        name: "Dashboard",
        icon: <LayoutDashboardIcon size={15} className="mr-2" />,
        href: "/dashboard",
    },
    {
        label: "",
        name: "Projects",
        icon: <LayoutList size={15} className="mr-2" />,
        href: "/projects",
    },
    {
        label: "",
        name: "My Projects",
        icon: <ListTodo size={15} className="mr-2" />,
        href: "/my-projects",
    },
    {
        label: "",
        name: "Work History",
        icon: <FileClock size={15} className="mr-2" />,
        href: "/work-history",
    },
    {
        label: "E-Waste",
        name: "Inventory",
        icon: <Heater size={15} className="mr-2" />,
        href: "/e-waste/inventory",
    },
    {
        label: "E-Waste",
        name: "Recovered Items",
        icon: <CircuitBoard size={15} className="mr-2" />,
        href: "/e-waste/recovered-items",
    },
];


export type HeaderLink = {
    name: string
    href: string
}

export const contributor_header_links: HeaderLink[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
    },
    {
        name: "My Projects",
        href: "/my-projects",
    },
    {
        name: "Work History",
        href: "/work-history",
    },
];

export const admin_header_links: HeaderLink[] = [
    {
        name: "Dashboard",
        href: "/dashboard",
    },
    {
        name: "Review Work",
        href: "/review-work",
    },
    {
        name: "Work History",
        href: "/work-history",
    },
];