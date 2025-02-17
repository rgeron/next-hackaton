"use client";

import { signOutAction } from "@/app/actions/auth";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import { createClient } from "@/utils/supabase/client";
import { Building2, Menu, Search, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function HeaderAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (!hasEnvVars) {
    return (
      <div className="flex gap-4 items-center">
        <Badge variant={"default"} className="font-normal pointer-events-none">
          Please update .env.local file with anon key and url
        </Badge>
        <div className="flex gap-2">
          <Button asChild size="sm" variant={"outline"} disabled>
            <Link href="/sign-in">Sign in</Link>
          </Button>
          <Button asChild size="sm" variant={"default"} disabled>
            <Link href="/sign-up">Sign up</Link>
          </Button>
        </div>
      </div>
    );
  }

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

  return user ? (
    <div className="flex items-center gap-4">
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-4 mr-4">
        {menuItems.map((item) => (
          <Button key={item.href} asChild variant="ghost" size="sm">
            <Link href={item.href} className="flex items-center gap-2">
              {item.icon}
              {item.label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Mobile Menu */}
      <div className="md:hidden mr-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {menuItems.map((item) => (
              <DropdownMenuItem key={item.href} asChild>
                <Link
                  href={item.href}
                  className="w-full cursor-pointer flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
