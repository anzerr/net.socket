
import * as events from 'events';

class BaseClient {

	public compress: boolean;

    constructor();

    send(data: any): Promise<void>;

	handleMessage(payload): any;

	close(): void

}

declare namespace netSocket {

	class Client extends BaseClient {

        constructor(uri: string, compress?: boolean);

	}

	class ServerClient extends BaseClient {

        constructor(socket: any, key: string, compress?: string);

        id(): string;

	}

	class Server extends events {

		public socket: any;
		public compress: boolean;

        constructor(uri: string, compress?: boolean);

        close(): Promise<void>;

		handleMessage(payload: any, client: Client): Server;

		createClient(socket: any, key: string): ServerClient;

		key(): string;

    }

}

export as namespace netSocket;
export = netSocket;