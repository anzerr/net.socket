
import * as events from 'events';

declare namespace netSocket {

	class BaseClient {

		public compress: boolean;

	    constructor();

	    send(data: any): Promise<void>;

		handleMessage(payload): any;

		on(event: string, cd: any): Server;

		once(event: string, cd: any): Server;

		removeListener(event: string, cd: any): Server;

		removeAllListeners(event: string): Server;

		close(): void

	}

	class Client extends BaseClient {

        constructor(uri: string, compress?: boolean);

	}

	class ServerClient extends BaseClient {

        constructor(socket: any, key: string, compress?: string);

        id(): string;

	}

	class Server {

		public socket: any;
		public compress: boolean;

        constructor(uri: string, compress?: boolean);

        close(): Promise<void>;

		handleMessage(payload: any, client: Client): Server;

		createClient(socket: any, key: string): ServerClient;

		on(event: string, cd: any): Server;

		once(event: string, cd: any): Server;

		removeListener(event: string, cd: any): Server;

		removeAllListeners(event: string): Server;

		key(): string;

    }

}

export as namespace netSocket;
export = netSocket;