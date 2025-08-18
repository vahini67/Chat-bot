Chat-bot app

This project presents a secure, scalable chatbot application leveraging modern cloud tools and automation workflows. It features user authentication via email using Bolt and Nhost Auth, ensuring that only signed-in users can access chat functionalities. All data interactions—including chat creation, messaging, and real-time updates—are handled exclusively through Hasura GraphQL queries, mutations, and subscriptions, with strict row-level security and permission controls so users can only access their own information.

A robust backend workflow integrates Hasura Actions with n8n automation, enabling dynamic chatbot conversations. When a user sends a message, it is first stored in the database, then an authenticated Hasura Action triggers n8n to verify chat ownership, securely call the OpenRouter AI model, persist the bot’s reply, and deliver the response back to the client—all without exposing sensitive API credentials or using insecure protocols. The entire frontend operates through GraphQL, eliminating REST endpoints and safeguarding against unauthorized access.

This architecture ensures a seamless, real-time chat experience, strict data privacy, and flexible chatbot intelligence—demonstrating best practices in cloud authentication, database permissions, workflow automation, and API security for modern web applications.
