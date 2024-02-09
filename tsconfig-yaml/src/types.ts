// Define the interface for our configuration structure based on the provided YAML example.
export interface TsConfigYaml {
	projects: Record<string, ProjectConfig>;
	subprojects: Record<string, SubprojectConfig>;
	options: Record<string, BaseOptions>;
}

export interface ProjectConfig {
	path: string;
	references?: string[];
	subprojects?: string[];
}

export interface SubprojectConfig extends BaseOptions {
	extends?: string[];
}

export interface BaseOptions {
	include?: string[];
	exclude?: string[];
	types?: string[];
}
