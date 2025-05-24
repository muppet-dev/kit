import type { transportSchema } from "@muppet-kit/shared";
import type { z } from "zod";

export type BaseEnv = {
  Variables: {
    servers: (z.infer<typeof transportSchema> & {
      id: number;
      name: string;
      status: string;
    })[];
  };
};
