import { signOutAction } from "@/app/actions/auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from "@/utils/supabase/server";
import { Building2, Menu, Search, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export async function HeaderAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const menuItems = [
    {
      href: "/protected/search-profile",
      label: "Search Profiles",
      icon: <Search className="h-4 w-4" />,
    },
    {
      href: "/protected/search-team",
      label: "Search Teams",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/protected/team",
      label: "My Team",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      href: "/protected/profile",
      label: "My Profile",
      icon: <UserCircle className="h-4 w-4" />,
    },
  ];

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-4">
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 mr-4">
        {menuItems.map(({ href, label, icon }) => (
          <Button asChild variant="ghost" size="sm" key={label}>
            <Link href={href} className="flex items-center gap-2">
              {icon}
              {label}
            </Link>
          </Button>
        ))}
      </div>
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-2 mt-4">
              {menuItems.map(({ href, label, icon }) => (
                <Button asChild variant="ghost" size="sm" key={label}>
                  <Link
                    href={href}
                    className="flex items-center gap-2 justify-start"
                  >
                    {icon}
                    {label}
                  </Link>
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <form action={signOutAction}>
        <Button type="submit" variant="outline" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
