# Redis Cache Setup

The app supports an optional Upstash Redis cache for frequently accessed journal reads. If Redis is not configured or temporarily unavailable, requests fall back to MongoDB.

## Configure Upstash

1. Create a Redis database in the Upstash console.
2. Copy the REST URL and REST token into `.env.local`:

```env
UPSTASH_REDIS_REST_URL=https://your-database.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-rest-token
```

3. Add the same environment variables to the production deployment.

## Cached Data

- Dashboard entry summaries
- Individual encrypted journal entries
- Paginated archive results
- Streak date lists
- Flashback entry snapshots

Journal content remains encrypted while stored in Redis. Cache entries expire after two minutes and are invalidated whenever a journal entry is saved, deleted, or scrubbed after media removal.
