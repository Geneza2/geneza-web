import * as migration_20250725_090635 from './20250725_090635';

export const migrations = [
  {
    up: migration_20250725_090635.up,
    down: migration_20250725_090635.down,
    name: '20250725_090635'
  },
];
