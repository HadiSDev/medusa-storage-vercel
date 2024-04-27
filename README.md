# medusa-storage-vercel

Handle file uploads with vercel

[Medusa Website](https://medusajs.com/) | [Medusa Repository](https://github.com/medusajs/medusa)

## Features

- Upload files to `assets/` (Only Support Public uploads).
- Get file signed url
- Delete file

---

## Prerequisites

- [Node.js v17 or greater](https://nodejs.org/en)
- [A Medusa backend](https://docs.medusajs.com/development/backend/install)
- Vercel Blob Storage Setup
- Vercel storage bucket.

---

## How to Install

1\. Run the following command in the directory of the Medusa backend:

```bash
npm install medusa-storage-vercel
```

2\. Set the following environment variables in `.env`:

```dotenv
BLOB_READ_WRITE_TOKEN=<vercel_blob_secret_xxxxxxxxxx....>
BUCKET_NAME=<bucket_name>
```

3\. In `medusa-config.js` add the following at the end of the `plugins` array:

```js
const plugins = [
  // ...
  {
    resolve: `medusa-storage-vercel`,
    options: {
      blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN,
      bucketName: process.env.BUCKET_NAME,
    },
  },
];
```

---

## Test the Plugin

1\. Run the following command in the directory of the Medusa backend to run the backend:

```bash
npm start
```

2\. Try to change a product image.

---

## Additional Resources

- [Vercel Blob SDK](https://vercel.com/docs/storage/vercel-blob/using-blob-sdk)
