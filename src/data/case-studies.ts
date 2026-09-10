// Editorial summaries of the confirmed career record, portfolio, and owner updates.
// Do not infer ownership or technical choices from product screenshots.
export const caseStudies = [
  {
    employer: 'Innoscripta AG',
    title: 'One component library. Every microfrontend.',
    focus: 'Design systems / Enterprise interfaces',
    problem:
      'Microfrontend applications needed a shared UI foundation. A transfer pricing workflow also needed to move beyond spreadsheets.',
    contribution:
      'I owned the company-wide UI component library and built the transfer pricing frontend, including multi-entity data models, validation-heavy forms, calculation results, and audit trails.',
    decisions:
      'I brought design tokens, theming, accessibility, and Storybook documentation into the shared library so teams could build on the same components.',
    outcome:
      'The library was consumed by every microfrontend application, eliminating duplicated component code. The transfer pricing platform replaced a spreadsheet-based process.',
    stack: ['Design tokens', 'Storybook', 'Microfrontends', 'Accessibility'],
    number: '01',
    graphic: 'components',
  },
  {
    employer: 'REI Blackbook',
    title: 'Real estate, working together.',
    focus: 'Real estate / SaaS platform',
    problem:
      'Running a real estate business meant juggling disconnected systems. REI Blackbook brings that work into one place.',
    contribution:
      'I helped build REI Blackbook’s product interfaces, bringing investors’ day-to-day business workflows into a single platform.',
    decisions:
      'Connect everyday workflows through a shared interface, reducing the friction of moving between separate tools.',
    outcome:
      'Less tool switching. Less technical overhead. One place for investors to manage their day-to-day work.',
    stack: ['Real estate', 'SaaS', 'Product interfaces', 'Connected workflows'],
    number: '02',
    graphic: 'real-estate',
  },
  {
    employer: 'LAAM',
    title: 'Built from scratch. PKR 2M+ in daily sales.',
    focus: 'E-commerce / Platform development',
    problem:
      'LAAM needed a system to run its e-commerce business from the ground up, along with better tools for understanding sales as it grew.',
    contribution:
      'I built LAAM’s system from scratch, working directly with leadership to help the business reach PKR 2 million+ in daily sales. I also built internal analytics dashboards and mentored junior engineers as the team grew.',
    decisions:
      'I established frontend conventions as the team scaled and replaced manual reporting with dedicated analytics views, giving leadership faster access to sales data.',
    outcome:
      'The system supported the business as it grew to PKR 2 million+ in daily sales. The dashboards also halved sales-analysis turnaround time.',
    stack: [
      'Platform development',
      'Analytics dashboards',
      'Frontend conventions',
      'Engineer mentoring',
    ],
    number: '03',
    graphic: 'analytics',
  },
] as const;
