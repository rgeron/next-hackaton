import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <div className="flex flex-col gap-8 items-center py-16">
      <h1 className="text-4xl md:text-5xl font-bold text-center">
        HEC Paris Hackathon 2025 
      </h1>
      <p className="text-3xl lg:text-4xl !leading-tight mx-auto max-w-2xl text-center">
        Find your dream team for the{" "}
        <span className="font-bold bg-clip-text">April 5-6 Hackathon</span> at
        HEC Paris Campus
      </p>
      <p className="text-xl text-muted-foreground max-w-xl text-center">
        Connect with talented developers, designers, and business minds.
        Register now to join teams or create your own.
      </p>
      <div className="flex gap-4">
        <Button asChild size="lg" variant="default">
          <Link href="/sign-up">Sign up now</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-4" />
    </div>
  );
}
