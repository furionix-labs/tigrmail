# Mailtiger

A package for email verification and management.

## Installation

```bash
npm install mailtiger
```

## Usage

```typescript
import { mailtiger } from 'mailtiger';

const { createEmail, getEmails } = mailtiger({
  token: 'your-api-token',
  maxRetries: 3, // Optional: number of retry attempts (default: 3)
  timeout: 5000, // Optional: request timeout in milliseconds (default: 5000)
});

// Create a new email address
const email = await createEmail();
console.log(email); // e.g., 'test@mailtiger.com'

// Get all emails
const allEmails = await getEmails();

// Get emails with subject filter
const emailsBySubject = await getEmails({ subject: 'Welcome' });

// Get emails with sender filter
const emailsBySender = await getEmails({ sender: 'support@example.com' });

// Get emails with both filters
const filteredEmails = await getEmails({ 
  subject: 'Welcome',
  sender: 'support@example.com',
});
```

## API

### `mailtiger(config: MailtigerConfig)`

#### Parameters

- `config`: Configuration object
  - `token`: API token for authentication (required)
  - `maxRetries`: Optional number of retry attempts (default: 3)
  - `timeout`: Optional request timeout in milliseconds (default: 5000)

#### Returns

An object containing:
- `createEmail`: Function that creates a new email address
- `getEmails`: Function that retrieves emails with optional filters

### `createEmail(): Promise<string>`

Creates a new email address and returns it.

### `getEmails(params?: EmailSearchParams): Promise<Email[]>`

Retrieves emails with optional filters.

#### Parameters

- `params`: Optional search parameters
  - `subject`: Filter emails by subject
  - `sender`: Filter emails by sender

#### Returns

An array of `Email` objects with the following structure:
```typescript
interface Email {
  id: string;
  subject: string;
  sender: string;
  body: string;
  receivedAt: string;
}
```

#### API Endpoints

The package makes requests to the following endpoints:
- `POST /emails`: Create a new email address
- `GET /emails`: Get all emails
- `GET /emails?subject=...`: Get emails by subject
- `GET /emails?sender=...`: Get emails by sender
- `GET /emails?subject=...&sender=...`: Get emails by both subject and sender

#### Error Handling

The package provides detailed error handling with specific error codes:

- `INVALID_TOKEN` (401): Invalid or expired token
- `NOT_FOUND` (404): Resource not found
- `SERVER_ERROR` (5xx): Server error occurred
- `NETWORK_ERROR`: Network connection failed
- `TIMEOUT`: Request timed out

#### Retry Logic

The package implements automatic retry logic with exponential backoff for:
- Server errors (5xx)
- Network errors
- Timeout errors

Retry attempts follow this pattern:
1. First retry: 1 second delay
2. Second retry: 2 seconds delay
3. Third retry: 4 seconds delay
...and so on, up to a maximum delay of 30 seconds

## License

MIT 