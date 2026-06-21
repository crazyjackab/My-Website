export function getAdminSecret(): string | undefined {
  return process.env.ADMIN_SECRET;
}

export function isAdminAuthorized(request: Request): boolean {
  const secret = getAdminSecret();
  if (!secret) return false;

  const auth = request.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;

  const url = new URL(request.url);
  return url.searchParams.get("secret") === secret;
}
