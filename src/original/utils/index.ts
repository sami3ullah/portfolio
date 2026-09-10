import { wholeYearsSince } from '../../utils/dates.mjs';
import profile from '../../data/profile.json';

export const getTotalExperience = () => wholeYearsSince(profile.careerStart);

export const isMobileViewport = () => {
  return window.innerWidth < 768;
};

export const isTabletViewport = () => {
  return window.innerWidth >= 768 && window.innerWidth < 992;
};

export const isDesktopViewport = () => {
  return window.innerWidth >= 992;
};
