import { useSidebar } from "../../ui/sidebar";
import { Logo as FullLogo } from "./Logo";
import { SmallLogo } from "./SmallLogo";

export function Logo() {
  const { open } = useSidebar();

  if (open) return <FullLogo />;

  return <SmallLogo />;
}
