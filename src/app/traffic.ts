export interface Traffic {
    count: number;
    uniques: number;
    views: [
        {
            timestamp: string;
            count: number;
            uniques: number;
        }
    ]
}
