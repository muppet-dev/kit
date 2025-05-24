import { Link } from "react-router";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pl-8 lg:pr-0 xl:px-16">
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
        <p className="font-display font-semibold">404</p>
        <div>
          <h1 className="font-display text-[2rem] leading-[2.5rem] tracking-tight">
            Page not found
          </h1>
          <p className="text-muted-foreground text-[0.875rem] leading-[1.5rem]">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        <Link to="/">
          <Button variant="ghost">Go back home</Button>
        </Link>
      </div>
    </div>
  );
}
