export type Match = {
    id: number,
    child_count: number,
    group_id: number,
    metadata?: {},
    number: number,
    opponent1: Opponent,
    opponent2: Opponent,
    round_id: number,
    stage_id: number,
    status: number,
}

type Opponent = {
    id: number,
    position: number,
    result?: string,
}