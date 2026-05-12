import admin from "firebase-admin";
import { readFileSync } from "node:fs";
import path from "node:path";

class NotificationService {
  private _serviceAccount = JSON.parse(
    readFileSync(
      path.resolve(
        "./social-media-linkup-firebase-adminsdk-fbsvc-f309e8a66c.json",
      ),
    ) as unknown as string,
  );

  private _client: admin.app.App;

  constructor() {
    this._client = admin.initializeApp({
      credential: admin.credential.cert(this._serviceAccount),
    });
  }

  async sendNotification({
    token,
    data,
  }: {
    token: string;
    data: { title: string; body: string };
  }) {
    return await this._client.messaging().send({ token, data });
  }

  async sendNotifications({
    tokens,
    data,
  }: {
    tokens: string[];
    data: { title: string; body: string };
  }) {
    return await Promise.all(
      tokens.map((token) => this.sendNotification({ token, data })),
    );
  }
}

export default new NotificationService();