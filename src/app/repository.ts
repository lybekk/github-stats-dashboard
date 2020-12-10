export interface Repository {
    id: number;
    name: string;
    owner: {
        login: string;
    }
    traffic: {
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
    stargazerCount: number;
    watchers: {
        totalCount: number;
    }
}
