
export interface Tool {
  name: string;
  description: string;
  path: string;
}

export const TOOLS: Tool[] = [
  {
    name: 'Together CFO SEO Analyzer',
    description: 'Analyze and improve your website’s SEO, speed, and metadata with AI-powered suggestions.',
    path: 'seo-analyzer',
  },
  // {
  //   name: 'Future Tool Example',
  //   description: 'A brief description of what this new amazing tool does for our users.',
  //   path: '/future-tool',
  // },
];
