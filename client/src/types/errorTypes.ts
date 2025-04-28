export type ErrorWithResponse = {
    response?: {
        status?: number;
        data?: {
            error?: string;
        };
    };
    status?: number;
};