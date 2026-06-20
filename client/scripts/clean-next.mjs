import { rmSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const nextDir = resolve(process.cwd(), ".next");

if (existsSync(nextDir)) {
  try {
    rmSync(nextDir, { recursive: true, force: true });
    console.log("Removed stale .next cache");
  } catch (error) {
    console.warn("WARNING: Could not fully remove the .next directory. A process may be locking these files.");
    console.warn("If you see compilation errors, please stop any running dev/build processes and try again.");
    console.warn("Details:", error.message);
  }
}
