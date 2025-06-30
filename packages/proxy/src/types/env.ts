import type { configTransportSchema } from "@/validations";
import type { z } from "zod";

export type BaseEnv = {
  Variables: {
    servers: (z.infer<typeof configTransportSchema> & {
      slug: string;
    })[];
  };
};
