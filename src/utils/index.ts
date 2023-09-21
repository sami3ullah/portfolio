/**
 * this function calculates the total years of experience from 2019,july to current date
 * @returns total years of experience
 */
export const getTotalExperience = () => {
  const startDate = new Date(2019, 6, 1); //my first job started in july 2019
  const currentDate = new Date();
  let diff = currentDate.valueOf() - startDate.valueOf();
  let years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));

  return years;
};
