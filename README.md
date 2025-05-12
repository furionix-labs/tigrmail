<p align="center">
  <img src="https://tigrmail.com/logo@3x.webp" alt="Tigrmail Logo" width="200" />
</p>

<p align="center">
  <a href="https://tigrmail.com">Visit our website</a>
</p>

# Tigrmail SDK

Tigrmail SDK is a Node.js library designed for email verification workflows. It allows you to generate temporary inboxes and poll for email messages with customizable filters. This library is ideal for testing email-based features or automating email verification processes.

## Features

- Generate temporary inboxes.
- Poll for the next email message with advanced filtering options (e.g., by subject, sender email, or domain).
- Built-in error handling for API interactions.
- Automatic retry logic for HTTP requests.

## Installation
```bash
# Using npm
npm install tigrmail

# Using yarn
yarn add tigrmail
```

## Usage

### Importing the Library

```typescript
import { Tigrmail } from 'tigrmail';
```

### Creating an Instance

To use the library, you need to create an instance of `Tigrmail` with your API token:

```typescript
const tigrmail = new Tigrmail({ token: 'your-api-token' });
```

### Generating a Temporary Inbox

```typescript
const inbox = await tigrmail.generateInbox(); // <random-email-address>@den.tigrmail.com
```

### Polling for the Next Email Message

You can poll for the next email message using filters:

```typescript
const message = await tigrmail.pollNextMessage({
  inbox,
  subject: { contains: 'Verification' },
  from: { email: 'noreply@example.com' },
});

console.log(`Received email: ${message.subject}`);
```

## Error Handling

The library throws `TigrmailError` for API-related issues. You can catch and handle these errors as follows:

```typescript
try {
  const inbox = await tigrmail.generateInbox();
} catch (error) {
  if (error instanceof TigrmailError) {
    console.error('Error:', error.generalMessage);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## License

This project is licensed under the MIT License.