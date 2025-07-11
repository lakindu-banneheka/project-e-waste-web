'use client'
import { CircleUser, Menu } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { SidebarMenu } from "./sidebar"
import { ModeToggle } from "../theme/theme-toggle"
import { UserRole } from "@/types/User"
import { admin_header_links, contributor_header_links, HeaderLink } from "./menus"
import LogoImage from "@/assets/logo/logo"

export const Header = () => {
  const router = useRouter();
  const { data } = useSession();
  const isLoggedIn: boolean = data? true: false;
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
    router.refresh();
  };

    return (
        <>
          <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-10 min-w-[480px]">
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
              <SheetContent side="left" className="w-[240px] h-full">
                <SheetHeader className="h-full" >
                    <SheetTitle className='text-left text-xl font-bold ml-3'>
                      <Link
                        href="#"
                        className="flex items-center gap-2 text-lg font-semibold md:text-base"
                      >
                        <div className="flex justify-center w-36 items-center" >
                            <LogoImage
                                alt="E-WASTE PROJECT LOGO"
                            />
                        </div>

                      </Link>
                    </SheetTitle>
                    <SheetDescription className="h-full" >
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
                <LogoImage
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
                    key={link.name}
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                ))}
            </nav>
              <ModeToggle />
              { isLoggedIn
                ? <DropdownMenu>
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
                : <>
                  <Button
                    variant={'link'}
                    onClick={()=>router.push('/auth/login')}
                  >
                    Login
                  </Button>
                </>
              }
              
            </div>
          </header>
        </>
    )
}