import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  // Check for secret to confirm this is a valid request
  if (req.headers.authorization !== process.env.REVALIDATION_TOKEN) {
    return res.status(401).json({ message: "Invalid token" });
  }

  try {
    const { path } = req.body;

    if (!path || typeof path !== "string") {
      return res.status(400).json({ message: "Path must be a valid string" });
    }

    // Validate path format: should start with /p/talent/
    if (!path.startsWith("/p/talent/")) {
      return res.status(400).json({
        message: "Invalid path format. Path must start with /p/talent/",
      });
    }

    // Validate path segments
    const segments = path.split("/").filter(Boolean);
    if (segments.length !== 4) {
      // ['p', 'talent', 'name', 'program']
      return res.status(400).json({
        message:
          "Invalid path format. Expected format: /p/talent/{name}/{program}",
      });
    }

    // This should be the actual path of your page
    await res.revalidate(path);

    return res.json({
      revalidated: true,
      path,
      message: `Successfully revalidated page at ${path}`,
    });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    console.error("Error revalidating:", err);
    return res.status(500).json({
      message: "Error revalidating page",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
}
