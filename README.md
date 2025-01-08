This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, set up your environment variables:

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Generate a secure token for revalidation:
```bash
openssl rand -base64 32
```

3. Update the `REVALIDATION_TOKEN` in your `.env.local` with the generated token.

Then, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## On-Demand Revalidation

This project implements on-demand revalidation for static pages. This allows you to trigger a rebuild of specific pages without redeploying the entire site.

### How to Use

To revalidate a page, send a POST request to the revalidation endpoint:

```bash
curl -X POST \
  -H "Authorization: your-revalidation-token" \
  -H "Content-Type: application/json" \
  -d '{"path": "/p/talent/john-doe/super-bulk"}' \
  http://localhost:3000/api/revalidate
```

Replace `your-revalidation-token` with the token from your `.env.local` file.

### API Response

The endpoint will respond with:
- `200 OK` - Successfully revalidated the page
- `401 Unauthorized` - Invalid or missing token
- `405 Method Not Allowed` - Only POST requests are allowed
- `400 Bad Request` - Missing path parameter
- `500 Internal Server Error` - Revalidation failed

### Security

The revalidation endpoint is protected by a token that must be included in the `Authorization` header. This token should be kept secure and only shared with trusted services that need to trigger revalidations.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
