export interface ApiClientOptions {
	baseUrl: string;
	headers?: HeadersInit;
	fetcher?: typeof fetch;
}

export class ApiError extends Error {
	constructor(
		message: string,
		readonly status: number,
		readonly body?: unknown,
	) {
		super(message);
		this.name = "ApiError";
	}
}

export const createApiClient = ({ baseUrl, headers, fetcher = fetch }: ApiClientOptions) => {
	const root = baseUrl.replace(/\/$/, "");

	const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
		const response = await fetcher(`${root}${path}`, {
			...init,
			headers: { Accept: "application/json", ...headers, ...init.headers },
		});
		const body: unknown = await response.json().catch(() => undefined);

		if (!response.ok) {
			const message =
				(body as { message?: string } | undefined)?.message ??
				(response.statusText || "Request failed");
			throw new ApiError(message, response.status, body);
		}
		return body as T;
	};

	return {
		request,
		get: <T>(path: string, init?: RequestInit) => request<T>(path, { ...init, method: "GET" }),
		post: <T>(path: string, data?: unknown, init?: RequestInit) =>
			request<T>(path, {
				...init,
				method: "POST",
				headers: { "Content-Type": "application/json", ...init?.headers },
				body: JSON.stringify(data),
			}),
	};
};

export type ApiClient = ReturnType<typeof createApiClient>;
