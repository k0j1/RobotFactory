const fs = require('fs');
let code = fs.readFileSync('src/core/models.ts', 'utf-8');

const interfaceAutoDispatch = `export interface AutoDispatch {
  id: string;
  robotId: string;
  locationId: string;
  dispatchedAt: number;
  lastCollectedAt: number;
  logs: string[];
}

export interface GameState`;

code = code.replace(/export interface GameState/, interfaceAutoDispatch);
code = code.replace(/currentInterior: string;\n\}/, "currentInterior: string;\n  autoDispatches: AutoDispatch[];\n}");

fs.writeFileSync('src/core/models.ts', code);
