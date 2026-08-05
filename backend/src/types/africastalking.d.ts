declare module 'africastalking' {
  interface Credentials {
    apiKey: string;
    username: string;
  }

  interface SMSSendOptions {
    to: string[];
    message: string;
    from?: string;
    enqueue?: boolean;
    keyword?: string;
    linkId?: string;
    retryDurationInHours?: number;
  }

  interface SMSRecipient {
    number: string;
    cost: string;
    status: string;
    statusCode: number;
    messageId: string;
  }

  interface SMSSendResponse {
    SMSMessageData: {
      Message: string;
      Recipients: SMSRecipient[];
    };
  }

  interface SMSService {
    send(options: SMSSendOptions): Promise<SMSSendResponse>;
  }

  interface AfricasTalkingInstance {
    SMS: SMSService;
    VOICE: unknown;
    USSD: unknown;
    AIRTIME: unknown;
    PAYMENTS: unknown;
    APPLICATION: unknown;
  }

  function africastalking(credentials: Credentials): AfricasTalkingInstance;

  export = africastalking;
}
