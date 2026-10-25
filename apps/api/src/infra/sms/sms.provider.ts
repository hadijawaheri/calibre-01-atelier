export abstract class SmsProvider {
  abstract sendOtp(mobile: string, code: string): Promise<void>;
}
