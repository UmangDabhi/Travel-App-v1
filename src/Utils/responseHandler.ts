interface Response<T = any> {
    status: number;
    message: string;
    result?: T;
}

export function responseHandler<T>(statusCode: number, message: string, data?: T): any {
    const res: Response<T> = {
        status: statusCode,
        message: message,
    };
    if (data) {
        res.result = data;
    }
    return res;
}
