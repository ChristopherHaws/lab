import type { CompilerOptions, ProjectReference } from 'typescript';

// File: src/types.ts
export type Project = {
	references: string[];
	environments: string[];
};

export type Environment = {
	extends?: string[];
	references?: string[];
	include: string[];
	types?: string[];
};

export interface TsConfigJson {
	compilerOptions: CompilerOptions;
	include?: string[];
	exclude?: string[];
	files?: string[];
	references?: ProjectReference[];
}

export type TsConfigYaml = {
	projects: Record<string, Project>;
	environments: Record<string, Environment>;
	options: Record<string, CompilerOptions>;
};
