import { gsap } from "gsap";

let isConfigured = false;

/** Applies the application's restrained defaults before any GSAP timeline runs. */
export function configureGsap() {
  if (isConfigured) {
    return;
  }

  gsap.config({ nullTargetWarn: false });
  gsap.defaults({ duration: 0.5, ease: "power2.out", overwrite: "auto" });
  isConfigured = true;
}
