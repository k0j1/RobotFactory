sed -i '1i import { VersionCheckService } from "../services/VersionCheckService";' src/core/GameEngine.ts
awk '/private saveState\(\) \{/ { print; print "    if (VersionCheckService.isMismatch()) {\n      console.warn(\"[GameEngine] Version mismatch detected. Saving is blocked.\");\n      return;\n    }"; next }1' src/core/GameEngine.ts > temp.ts && mv temp.ts src/core/GameEngine.ts
