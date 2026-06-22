import { rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const nextCacheDir = resolve(process.cwd(), ".next", "cache");

if (existsSync(nextCacheDir)) {
  try {
    rmSync(nextCacheDir, { recursive: true, force: true });
    console.log("Removed stale .next cache");
  } catch (error) {
    console.warn("WARNING: Could not fully remove the Next cache. A process may be locking these files.");
    console.warn("If you see compilation errors, please stop any running dev/build processes and try again.");
    console.warn("Details:", error.message);
  }
}
