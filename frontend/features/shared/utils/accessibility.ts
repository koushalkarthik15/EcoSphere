/**
 * Accessibility Utilities (WCAG 2.1 AA/AAA Compliance)
 * Shared utilities for focus trapping, keyboard navigation, and screen reader announcements.
 */

/**
 * Traps focus within a container element (useful for dialogs/modals)
 */
export const trapFocus = (e: React.KeyboardEvent<HTMLElement>, containerRef: React.RefObject<HTMLElement>) => {
  if (!containerRef.current) return;
  
  const focusableEls = containerRef.current.querySelectorAll(
    'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex="0"]'
  );
  
  if (focusableEls.length === 0) return;
  
  const firstEl = focusableEls[0] as HTMLElement;
  const lastEl = focusableEls[focusableEls.length - 1] as HTMLElement;
  
  if (e.key === "Tab") {
    if (e.shiftKey) {
      if (document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    }
  }
};

/**
 * Directs an auditory announcement to a hidden live-region for screen readers
 */
export const announceToScreenReader = (message: string, politeness: "polite" | "assertive" = "polite") => {
  const containerId = `sr-announcer-${politeness}`;
  let announcer = document.getElementById(containerId);
  
  if (!announcer) {
    announcer = document.createElement("div");
    announcer.id = containerId;
    announcer.setAttribute("aria-live", politeness);
    announcer.setAttribute("aria-atomic", "true");
    announcer.classList.add("sr-only"); // Standard Tailwind/CSS utility to hide screen-readers visual space
    document.body.appendChild(announcer);
  }
  
  announcer.textContent = "";
  setTimeout(() => {
    if (announcer) announcer.textContent = message;
  }, 100);
};

/**
 * Formats clean keyboard event callbacks
 */
export const handleKeyboardAction = (callback: () => void, targetKeys: string[] = ["Enter", " "]) => {
  return (e: React.KeyboardEvent<HTMLElement>) => {
    if (targetKeys.includes(e.key)) {
      e.preventDefault();
      callback();
    }
  };
};
