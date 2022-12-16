import {io, Socket} from 'socket.io-client';

class ClientSocket {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3010');
  }

  public on(eventName: string, callback: Function) {
    this.socket.on(eventName, callback as any);
  }

  public emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
}

export default new ClientSocket();