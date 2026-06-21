export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  highlights?: string[];
  image?: string;
  imageFull?: string;
  tags: string[];
  links: {
    live?: string;
    github?: string;
  };
  featured: boolean;
  published?: boolean;
  year: number;
  metrics?: Record<string, string>;
}
