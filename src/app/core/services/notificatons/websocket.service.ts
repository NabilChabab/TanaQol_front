import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { webSocketUrl } from '../../../app.constants';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private client!: Client;
  private rideRequestSubject = new Subject<any>();
  private connectedSubject = new BehaviorSubject<boolean>(false);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    console.log('[WS] Initializing WebSocket client');

    this.client = new Client({
      webSocketFactory: () => new SockJS(webSocketUrl),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('[WS-DEBUG] ' + str),
    });

    this.client.onStompError = (frame) => {
      console.error('[WS] STOMP error:', frame);
    };

    this.client.onWebSocketError = (error) => {
      console.error('[WS] WebSocket error:', error);
      this.connectedSubject.next(false);
    };

    this.client.onDisconnect = () => {
      console.log('[WS] WebSocket disconnected');
      this.connectedSubject.next(false);
    };
  }

  public connect(userId: string): void {
    console.log('[WS] Attempting to connect WebSocket for user:', userId);

    if (!userId) {
      console.error('[WS] Cannot connect WebSocket: No user ID provided');
      return;
    }

    // Reset connection if already active
    if (this.client.active) {
      console.log('[WS] Client already active, deactivating first');
      this.client.deactivate();

      // Reinitialize the client
      setTimeout(() => {
        this.initializeClient();
        this.setupConnection(userId);
      }, 500);
    } else {
      this.setupConnection(userId);
    }
  }

  private setupConnection(userId: string): void {
    this.client.onConnect = (frame) => {
      console.log('[WS] WebSocket connected successfully:', frame);
      this.connectedSubject.next(true);
      this.reconnectAttempts = 0;

      try {
        // Subscribe to the user-specific queue
        console.log('[WS] Subscribing to:', `/user/${userId}/queue/ride-requests`);

        const subscription = this.client.subscribe(
          `/user/${userId}/queue/ride-requests`,
          (message) => {
            console.log('[WS] Received message:', message);

            if (message.body) {
              try {
                const notification = JSON.parse(message.body);
                console.log('[WS] Parsed notification:', notification);
                this.rideRequestSubject.next(notification);
              } catch (error) {
                console.error('[WS] Error parsing message:', error);
              }
            }
          }
        );

        console.log('[WS] Subscription active:', subscription.id);
      } catch (error) {
        console.error('[WS] Error in subscription process:', error);
      }
    };

    // Activate client connection
    try {
      console.log('[WS] Activating WebSocket client');
      this.client.activate();
    } catch (error) {
      console.error('[WS] Error activating client:', error);
      this.handleReconnect(userId);
    }
  }

  private handleReconnect(userId: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[WS] Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

      setTimeout(() => {
        this.initializeClient();
        this.setupConnection(userId);
      }, 3000);
    } else {
      console.error('[WS] Max reconnect attempts reached. Giving up.');
    }
  }

  public onRideRequest(): Observable<any> {
    return this.rideRequestSubject.asObservable();
  }

  public connectionStatus(): Observable<boolean> {
    return this.connectedSubject.asObservable();
  }

  public disconnect(): void {
    if (this.client && this.client.active) {
      console.log('[WS] Disconnecting WebSocket client');
      this.client.deactivate();
      this.connectedSubject.next(false);
    }
  }

  public isConnected(): boolean {
    return this.client && this.client.active;
  }

  // Test method to manually emit a notification (for debugging)
  public emitTestNotification(): void {
    const testNotification = {
      rideId: 'test-ws-123',
      pickupLocation: 'WebSocket Test Pickup',
      destination: 'WebSocket Test Destination',
      price: 50.25
    };

    console.log('[WS] Emitting test notification:', testNotification);
    this.rideRequestSubject.next(testNotification);
  }
}