export interface EmailConfig {
  id: number;
  host: string;
  port: number;
  username: string;
  passwordConfigured: boolean;
  smtpAuth: boolean;
  smtpStarttls: boolean;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateEmailConfigPayload {
  host: string;
  port: number;
  username: string;
  password?: string;
  smtpAuth: boolean;
  smtpStarttls: boolean;
  fromEmail: string;
  fromName: string;
  enabled: boolean;
}

export interface SendTestEmailPayload {
  recipientEmail: string;
}

