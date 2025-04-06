import { mailtiger } from '../src';

// Mock fetch
global.fetch = jest.fn();

describe('mailtiger', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should return email address and verification link from API', async () => {
    const mockResponse = {
      email: 'test@email.com',
      verificationLink: 'http://example.com',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { emailAddress, verificationLinkPromise } = mailtiger({
      linkSelector: 'a.confirm-button',
      token: 'test-token',
    });

    const email = await emailAddress;
    expect(email).toBe('test@email.com');
    
    const link = await verificationLinkPromise;
    expect(link).toBe('http://example.com');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.mailtiger.com/verify',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
  });

  it('should handle API errors for both email and link', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { emailAddress, verificationLinkPromise } = mailtiger({
      linkSelector: 'a.confirm-button',
      token: 'test-token',
    });

    await expect(emailAddress).rejects.toMatchObject({
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });

    await expect(verificationLinkPromise).rejects.toMatchObject({
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  });

  it('should respect maximum retry delay', async () => {
    const mockResponse = {
      email: 'test@email.com',
      verificationLink: 'http://example.com',
    };

    // Simulate multiple failures with retries
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Server error occurred'))
      .mockRejectedValueOnce(new Error('Server error occurred'))
      .mockRejectedValueOnce(new Error('Server error occurred'))
      .mockRejectedValueOnce(new Error('Server error occurred'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

    const { verificationLinkPromise } = mailtiger({
      linkSelector: 'a.confirm-button',
      token: 'test-token',
      maxRetries: 4,
    });

    // Advance timers for exponential backoff
    jest.advanceTimersByTime(1000); // First retry after 1s
    jest.advanceTimersByTime(2000); // Second retry after 2s
    jest.advanceTimersByTime(4000); // Third retry after 4s
    jest.advanceTimersByTime(30000); // Fourth retry after 30s (max delay)

    const link = await verificationLinkPromise;
    expect(link).toBe('http://example.com');
    expect(global.fetch).toHaveBeenCalledTimes(5);
  });

  it('should throw an error when token is not provided', () => {
    expect(() => {
      mailtiger({
        linkSelector: 'a.confirm-button',
        token: '',
      });
    }).toThrow('Token is required');
  });

  it('should validate configuration parameters', () => {
    expect(() => {
      mailtiger({
        linkSelector: 'a.confirm-button',
        token: 'test-token',
        maxRetries: -1,
      });
    }).toThrow('maxRetries must be a non-negative number');

    expect(() => {
      mailtiger({
        linkSelector: 'a.confirm-button',
        token: 'test-token',
        timeout: 0,
      });
    }).toThrow('timeout must be a positive number');
  });

  it('should handle specific API errors with detailed messages', async () => {
    const testCases = [
      { status: 401, expectedMessage: 'Invalid or expired token', expectedCode: 'INVALID_TOKEN' },
      { status: 404, expectedMessage: 'Link selector not found', expectedCode: 'LINK_NOT_FOUND' },
      { status: 500, expectedMessage: 'Server error occurred', expectedCode: 'SERVER_ERROR' },
    ];

    for (const { status, expectedMessage, expectedCode } of testCases) {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status,
      });

      const { verificationLinkPromise } = mailtiger({
        linkSelector: 'a.confirm-button',
        token: 'test-token',
      });

      await expect(verificationLinkPromise).rejects.toMatchObject({
        message: expectedMessage,
        code: expectedCode,
        status,
      });
    }
  });

  it('should retry on server errors with exponential backoff', async () => {
    const mockResponse = {
      email: 'test@email.com',
      verificationLink: 'http://example.com',
    };

    // First two attempts fail with server error
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Server error occurred'))
      .mockRejectedValueOnce(new Error('Server error occurred'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

    const { verificationLinkPromise } = mailtiger({
      linkSelector: 'a.confirm-button',
      token: 'test-token',
      maxRetries: 2,
    });

    // Advance timers for exponential backoff
    jest.advanceTimersByTime(1000); // First retry after 1s
    jest.advanceTimersByTime(2000); // Second retry after 2s

    const link = await verificationLinkPromise;
    expect(link).toBe('http://example.com');
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should handle timeouts', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(resolve, 6000))
    );

    const { verificationLinkPromise } = mailtiger({
      linkSelector: 'a.confirm-button',
      token: 'test-token',
      timeout: 5000,
    });

    jest.advanceTimersByTime(5000);

    await expect(verificationLinkPromise).rejects.toMatchObject({
      message: 'Request timed out after 5000ms',
      code: 'TIMEOUT',
    });
  });

  it('should handle network errors', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new TypeError('Failed to fetch'));

    const { verificationLinkPromise } = mailtiger({
      linkSelector: 'a.confirm-button',
      token: 'test-token',
    });

    await expect(verificationLinkPromise).rejects.toMatchObject({
      message: 'Network connection failed',
      code: 'NETWORK_ERROR',
    });
  });

  it('should create a new email address', async () => {
    const mockResponse = {
      email: 'test@mailtiger.com',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const { createEmail } = mailtiger({
      token: 'test-token',
    });

    const email = await createEmail();
    expect(email).toBe('test@mailtiger.com');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.mailtiger.com/emails',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
  });

  it('should get emails without filters', async () => {
    const mockEmails = [
      {
        id: '1',
        subject: 'Test Subject',
        sender: 'sender@example.com',
        body: 'Test Body',
        receivedAt: '2024-03-20T12:00:00Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmails),
    });

    const { getEmails } = mailtiger({
      token: 'test-token',
    });

    const emails = await getEmails();
    expect(emails).toEqual(mockEmails);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.mailtiger.com/emails',
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          'Authorization': 'Bearer test-token',
        }),
      })
    );
  });

  it('should get emails with subject filter', async () => {
    const mockEmails = [
      {
        id: '1',
        subject: 'Test Subject',
        sender: 'sender@example.com',
        body: 'Test Body',
        receivedAt: '2024-03-20T12:00:00Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmails),
    });

    const { getEmails } = mailtiger({
      token: 'test-token',
    });

    const emails = await getEmails({ subject: 'Test Subject' });
    expect(emails).toEqual(mockEmails);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.mailtiger.com/emails?subject=Test%20Subject',
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('should get emails with sender filter', async () => {
    const mockEmails = [
      {
        id: '1',
        subject: 'Test Subject',
        sender: 'sender@example.com',
        body: 'Test Body',
        receivedAt: '2024-03-20T12:00:00Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmails),
    });

    const { getEmails } = mailtiger({
      token: 'test-token',
    });

    const emails = await getEmails({ sender: 'sender@example.com' });
    expect(emails).toEqual(mockEmails);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.mailtiger.com/emails?sender=sender%40example.com',
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('should get emails with both filters', async () => {
    const mockEmails = [
      {
        id: '1',
        subject: 'Test Subject',
        sender: 'sender@example.com',
        body: 'Test Body',
        receivedAt: '2024-03-20T12:00:00Z',
      },
    ];

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockEmails),
    });

    const { getEmails } = mailtiger({
      token: 'test-token',
    });

    const emails = await getEmails({ 
      subject: 'Test Subject',
      sender: 'sender@example.com',
    });
    expect(emails).toEqual(mockEmails);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.mailtiger.com/emails?subject=Test%20Subject&sender=sender%40example.com',
      expect.objectContaining({
        method: 'GET',
      })
    );
  });

  it('should handle API errors', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { getEmails } = mailtiger({
      token: 'test-token',
    });

    await expect(getEmails()).rejects.toMatchObject({
      message: 'Invalid or expired token',
      code: 'INVALID_TOKEN',
    });
  });

  it('should retry on server errors', async () => {
    const mockEmails = [
      {
        id: '1',
        subject: 'Test Subject',
        sender: 'sender@example.com',
        body: 'Test Body',
        receivedAt: '2024-03-20T12:00:00Z',
      },
    ];

    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Server error occurred'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockEmails),
      });

    const { getEmails } = mailtiger({
      token: 'test-token',
      maxRetries: 1,
    });

    jest.advanceTimersByTime(1000); // First retry after 1s

    const emails = await getEmails();
    expect(emails).toEqual(mockEmails);
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });
}); 