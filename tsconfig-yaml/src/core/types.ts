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

export type TsConfig = {
	extends?: string[];
	references?: string[];
	include: string[];
	complierOptions: TsConfigCompilerOptions;
};

export type TsConfigCompilerOptions = {
	outDir?: string;
	target?: string;
	module?: string;
	lib?: string[];
	jsx?: string;
	strict?: boolean;
	types?: string[];
};

export type TsConfigYaml = {
	projects: Record<string, Project>;
	environments: Record<string, Environment>;
	options: Record<string, TsConfigCompilerOptions>;
};
