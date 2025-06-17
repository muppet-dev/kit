import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export type LogoSmall = ComponentProps<"svg">;

export function LogoSmall({ className, ...props }: LogoSmall) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      viewBox="0 0 465 261"
      className={cn("size-8", className)}
    >
      <title>Muppet</title>
      <defs>
        <linearGradient
          id="theme"
          x1="0.75"
          y1="2.938"
          x2="78.969"
          y2="81.156"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#00afde" />
          <stop offset="1" stopColor="#c7e758" />
        </linearGradient>
      </defs>
      <path
        transform="translate(-10 -150) scale(16)"
        d="M2.907 25.6v-11.627h-2.187v-4.373h4.48v2.613h1.173q0.853-1.387 2.213-2.147t3.36-0.76q1.92 0 3.293 0.68t2.2 2.013h0.107q1.84-2.693 5.467-2.693 3.093 0 4.907 1.8t1.813 4.867v9.627h-4.427v-8.773q0-3.573-3.387-3.573t-3.387 3.573v8.773h-4.427v-8.773q0-3.573-3.44-3.573-1.653 0-2.493 0.88t-0.84 2.693v8.773h-4.427z"
      />
      <rect fill="url(#theme)" width="78" height="78" />
    </svg>
  );
}
