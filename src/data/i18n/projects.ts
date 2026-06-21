import { buildProjectHelpers } from "./projects.types";
import { projectSources } from "./projects.generated";

const helpers = buildProjectHelpers(projectSources);

export const getLocalizedProjects = helpers.getLocalizedProjects;
export const getLocalizedProjectBySlug = helpers.getLocalizedProjectBySlug;
export const getAllLocalizedProjectSlugs = helpers.getAllLocalizedProjectSlugs;
export const getAllProjectSources = helpers.getAllProjectSources;

export type { ProjectSource } from "./projects.types";
