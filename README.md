<p align="center">
  <img src="https://tigrmail.com/logo@3x.webp" alt="Tigrmail Logo" width="200" />
</p>

<p align="center">
  <a href="https://tigrmail.com">Website</a> |
  <a href="https://docs.tigrmail.com">API Docs</a>
</p>

# Tigrmail SDK

Tigrmail SDK is a Node.js library for automating email verification workflows. It allows you to generate temporary inboxes and poll for email messages with customizable filters. This library is ideal for testing email-based features or automating email verification processes.

> If you are working in a different programming language, you can still access all features by integrating directly with [our API](https://docs.tigrmail.com).


## Features

- Generate temporary inboxes.
- Poll for the next email message with advanced filtering options (e.g., by subject, sender email, or domain).
- Built-in error handling for API interactions.
- Automatic retry logic for HTTP requests.

## Installation
```bash
npm install -D tigrmail
```
or
```bash
yarn add -D tigrmail
```

## Usage

### Importing the Library

```typescript
import { Tigrmail } from 'tigrmail';
```

### Creating an Instance

To use the library, retrieve your API token from [our console](https://console.tigrmail.com) and create a `Tigrmail` instance using that token:

```typescript
const tigrmail = new Tigrmail({ token: 'your-api-token' });
```

### Generating a Temporary Inbox

```typescript
const emailAddress: string = await tigrmail.createEmailAddress();
console.log(emailAddress); // <random-email-address>@den.tigrmail.com
```

### Polling for the Next Email Message

You can poll for the next email message using filters:

```typescript
const message = await tigrmail.pollNextMessage({
  inbox: emailAddress,
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