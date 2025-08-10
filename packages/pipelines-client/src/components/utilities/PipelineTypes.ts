
export interface PipelineStageStaticData {
    id: number,
    key: string,
    value: string
}

export interface PipelineStageReMappings {
    id: number,
    key: string,
    value: string
}

export interface PipelineStage {
    id: number,
    name: string,
    description: string,
    icon: string,
    deleted: boolean,
    deleteDate: Date,
    pipelineUuid: string,
    previousQueue: string,
    queue: string,
    defaultTarget: string,
    targets: string[],
    staticData: PipelineStageStaticData[],
    reMappings: PipelineStageReMappings[]
}

export interface Pipeline {
    uuid: string,
    name: string,
    stages: PipelineStage[]
}


