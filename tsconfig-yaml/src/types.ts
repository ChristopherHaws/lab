// Define the interface for our configuration structure based on the provided YAML example.
export interface TsConfigYaml {
	/**
	 * @example app1, app2, lib1, lib2, etc.
	 */
	projects: Record<ProjectName, ProjectConfig>;
	/**
	 * @example types, web, build, test, mocks, stories, etc.
	 */
	aspects: Record<AspectName, AspectConfig>;
	options: Record<string, BaseOptions>;
}

export type ProjectName = string;
export interface ProjectConfig {
	path: string;
	references?: string[];
	aspects?: string[];
}

export type AspectName = string;
export interface AspectConfig extends BaseOptions {
	//name: AspectName;
}

export interface BaseOptions {
	extends?: string[];
	include?: string[];
	exclude?: string[];
	types?: string[];
}
