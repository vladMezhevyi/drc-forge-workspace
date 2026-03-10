import z from 'zod';

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().positive().max(65536).default(3000),
  CLIENT_URL: z.url(),
  GITHUB_TOKEN: z.string().min(1),
  GITHUB_API_URL: z.url(),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
