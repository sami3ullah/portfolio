import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import profile from './profile.json';

export { profile };
export const resumeFile = '/Muhammad_Samiullah_Resume_2026.pdf';
const resumeHash = createHash('sha256')
  .update(readFileSync(resolve('public', resumeFile.slice(1))))
  .digest('hex')
  .slice(0, 12);
export const resumeUrl = `${resumeFile}?v=${resumeHash}`;
export const description = `${profile.name}, ${profile.title} in ${profile.location}. React, TypeScript, design systems, and complex enterprise interfaces. Building for the web since June 2019.`;
