'use client'
import { CircleUser, Menu, Package2, Search } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import logo from '@/assets/logo/ewaste_logo 1.png';
import { SidebarMenu } from "./sidebar"
import { ModeToggle } from "../theme/theme-toggle"
import { UserRole } from "@/types/User"
import { admin_header_links, contributor_header_links, HeaderLink } from "./menus"

export const Header = () => {
  const router = useRouter();
  const { data } = useSession();
  const role = data?.user.role;
  let header_links: HeaderLink[] = [];

  if(role === UserRole.Contributor) {
    header_links = contributor_header_links;
  } else if(role === UserRole.Admin) {
    header_links = admin_header_links;
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

    return (
        <>
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
            <Sheet>
              <SheetTrigger asChild className="md:hidden" >
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px]">
                <SheetHeader>
                    <SheetTitle className='text-left text-xl font-bold ml-3'>
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                      >
                        <div className="flex justify-center w-36 items-center" >
                            <Image
                                src={logo}
                                alt="E-WASTE PROJECT LOGO"
                            />
                        </div>

                      </Link>
                    </SheetTitle>
                    <SheetDescription>
                        <SidebarMenu />
                    </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <div className="flex justify-center w-36 items-center" >
                  <Image
                      src={logo}
                      alt="E-WASTE PROJECT LOGO"
                  />
              </div>

            </Link>
            <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
              <div className="ml-auto flex-1 sm:flex-initial">
              </div>
              <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
                { header_links.map((link)=>(
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
            </nav>
              <ModeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="icon" className="rounded-full">
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={handleLogout}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
        </>
    )
}