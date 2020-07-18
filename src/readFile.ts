import * as fs from 'fs';

const readFile = (path: string): string => {
  return fs.readFileSync(path, 'UTF8').toString();
};

export default readFile;
