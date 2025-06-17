import type { BaseSyntheticEvent } from "react";

export function eventHandler(
  func: (event?: BaseSyntheticEvent) => void,
  options?: { preventDefault?: boolean },
) {
  return (event?: BaseSyntheticEvent) => {
    if (event != null) {
      if ("key" in event && event.key !== "Enter")
        // On keyboard, work only when enter is pressed
        return;

      if (options?.preventDefault) {
        // Prevent the default browser behavior for the event
        event.preventDefault();
        // Stop the event from propagating to parent elements
        event.stopPropagation();
      }
    }

    // Call the function
    func(event);
  };
}
