import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/constants/api.constants';
import { setCsrfToken } from '@/lib/axios';

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: string;
  active: boolean;
}

export interface CsrfResponse {
  token: string;
  headerName: string;
}

export const authService = {
  /**
   * Initializes CSRF token cookie via Spring Security CookieCsrfTokenRepository
   */
  async initCsrf(): Promise<CsrfResponse> {
    const res = await apiClient.get<CsrfResponse>(API_ENDPOINTS.AUTH.CSRF);
    if (res.data?.token) {
      setCsrfToken(res.data.token);
    }
    return res.data;
  },

  /**
   * Authenticates administrator credentials and establishes session cookie
   */
  async login(email: string, password: string): Promise<AdminUser> {
    // Ensure CSRF token is set before sending unsafe POST request
    try {
      await this.initCsrf();
    } catch {
      // ignore if already initialized
    }

    const res = await apiClient.post<AdminUser>(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });

    // Refresh and sync CSRF token for the authenticated session
    try {
      await this.initCsrf();
    } catch {
      // ignore
    }

    return res.data;
  },

  /**
   * Restores session state by fetching the authenticated administrator
   */
  async getCurrentAdmin(): Promise<AdminUser> {
    const res = await apiClient.get<AdminUser>(API_ENDPOINTS.AUTH.ME);
    return res.data;
  },

  /**
   * Terminates session on the Spring Boot server
   */
  async logout(): Promise<void> {
    await apiClient.post<void>(API_ENDPOINTS.AUTH.LOGOUT);
  },

  /**
   * Changes the password for the currently authenticated administrator.
   */
  async changePassword(currentPassword: string, newPassword: string, confirmNewPassword: string): Promise<void> {
    await apiClient.post<void>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      currentPassword,
      newPassword,
      confirmNewPassword,
    });
  },

  /**
   * Requests a password recovery OTP sent to the admin's email.
   */
  async forgotPassword(email: string): Promise<string> {
    try {
      await this.initCsrf();
    } catch {
      // ignore
    }
    const res = await apiClient.post<void>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return res.message || 'If the account exists, password reset instructions have been sent.';
  },

  /**
   * Verifies the 6-digit OTP and returns a single-use reset token.
   */
  async verifyResetOtp(email: string, otp: string): Promise<{ resetToken: string; expiresInSeconds: number }> {
    try {
      await this.initCsrf();
    } catch {
      // ignore
    }
    const res = await apiClient.post<{ resetToken: string; expiresInSeconds: number }>(
      API_ENDPOINTS.AUTH.VERIFY_RESET_OTP,
      { email, otp }
    );
    return res.data;
  },

  /**
   * Completes password reset using single-use reset token.
   */
  async resetPassword(
    email: string,
    resetToken: string,
    newPassword: string,
    confirmNewPassword: string
  ): Promise<void> {
    try {
      await this.initCsrf();
    } catch {
      // ignore
    }
    await apiClient.post<void>(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      email,
      resetToken,
      newPassword,
      confirmNewPassword,
    });
  },
};

