// https://docs.gitlab.com/ee/user/project/integrations/webhook_events.html#pipeline-events

interface PipelineHook {
    object_kind: string;
    object_attributes: ObjectAttributes;
    merge_request: MergeRequest;
    user: User;
    project: Project;
    commit: Commit;
    source_pipeline: SourcePipeline;
    builds: Build[];
}

interface ObjectAttributes {
    id: number;
    ref: string;
    tag: boolean;
    sha: string;
    before_sha: string;
    source: string;
    status: string;
    stages: string[];
    created_at: Date;
    finished_at: Date;
    duration: number
    variables: Variable[];
}

interface Variable {
    key: string;
    value: string;
}

interface MergeRequest {
    id: number;
    iid: number;
    title: string;
    source_branch: string;
    source_project_id: number;
    target_branch: string;
    target_project_id: number;
    state: string;
    merge_status: string;
    url: string;
}

interface User {
    id: number;
    name: string;
    username: string;
    avatar_url: string;
    email: string;
}

interface ProjectShort {
    id: number;
    web_url: string;
    path_with_namespace: string;
}

interface Project extends ProjectShort {
    name: string;
    description: string;
    avatar_url: string;
    git_ssh_url: string;
    git_http_url: string;
    namespace: string;
    visibility_level: number;
    default_branch: string;
}

interface Commit {
    id: string;
    message: string;
    timestamp: Date;
    url: string;
    author: Author;
}

interface Author {
    name: string;
    email: string;
}

interface SourcePipeline {
    project: ProjectShort;
    pipeline_id: number;
    job_id: number;
}

interface Build {
    id: number;
    stage: string;
    name: string;
    status: string;
    created_at: Date;
    started_at: Date;
    finished_at: Date;
    when: string;
    manual: boolean;
    allow_failure: boolean;
    user: User;
    runner: string;
    artifacts_file: ArtifactsFile;
    environment: Environment;
}

interface ArtifactsFile {
    filename: string;
    size: number;
}

interface Environment {
    name: string;
    action: string;
    deployment_tier: string;
}
