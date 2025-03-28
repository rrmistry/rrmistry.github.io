import { readFileSync } from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';

export interface Blog {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description?: string;
}
