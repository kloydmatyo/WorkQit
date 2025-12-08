# Quick Reference Card

## 🚀 Start Everything

```bash
# 1. Start Docker containers
docker-compose -f docker-compose.dev.yml up -d

# 2. Start workers (new terminal)
npm run workers

# 3. Start Next.js (new terminal)
npm run dev
```

## 🛑 Stop Everything

```bash
# Stop workers: Ctrl+C
# Stop Next.js: Ctrl+C
# Stop containers:
docker-compose -f docker-compose.dev.yml down
```

## 🔗 Access Points

| Service | URL | Credentials |
|---------|-----|-------------|
| App | http://localhost | - |
| NGINX Health | http://localhost/nginx-health | - |
| Redis Test | http://localhost/api/cache/test | - |
| RabbitMQ Test | http://localhost/api/queue/test | - |
| RabbitMQ UI | http://localhost:15672 | workqit / workqit123 |

## 📊 Check Status

```bash
# All containers
docker-compose -f docker-compose.dev.yml ps

# Logs
docker-compose -f docker-compose.dev.yml logs -f [service]
# services: nginx, nextjs, redis, rabbitmq
```

## 💾 Redis Commands

```bash
# Access CLI
docker exec -it workqit-redis-dev redis-cli

# Common commands
KEYS *              # List all keys
GET key             # Get value
DEL key             # Delete key
FLUSHALL            # Clear all
```

## 📬 Queue a Job

```typescript
import { jobs } from '@/lib/rabbitmq';

// Email
await jobs.sendEmail({ to, subject, body });

// Student sync
await jobs.syncStudents({ source, batchSize });

// Notification
await jobs.sendNotification({ userId, type, message });

// Assessment
await jobs.scoreAssessment({ assessmentId, userId, answers });
```

## 🗄️ Cache Data

```typescript
import { cache } from '@/lib/redis';

// Set (with 5 min TTL)
await cache.set('key', data, 300);

// Get
const data = await cache.get('key');

// Delete
await cache.del('key');

// Increment
await cache.increment('counter', 60);
```

## 🔒 Rate Limit

```typescript
import { rateLimit, rateLimitResponse } from '@/middleware/rateLimit';

const limit = await rateLimit(request, {
  windowMs: 60000,
  maxRequests: 10
});

if (!limit.success) {
  return rateLimitResponse(limit.remaining, limit.resetTime);
}
```

## 🧪 Test Commands

```bash
# Test queue
npm run test:queue

# Test Redis
curl http://localhost/api/cache/test

# Test RabbitMQ
curl http://localhost/api/queue/test

# Test NGINX
curl http://localhost/nginx-health
```

## 🐛 Quick Fixes

```bash
# Restart service
docker-compose -f docker-compose.dev.yml restart [service]

# Clear Redis
docker exec -it workqit-redis-dev redis-cli FLUSHALL

# Rebuild containers
docker-compose -f docker-compose.dev.yml up -d --build

# Kill port 80
netstat -ano | findstr :80
taskkill /PID <PID> /F
```

## 📦 Containers

| Container | Port | Purpose |
|-----------|------|---------|
| workqit-nginx-dev | 80 | Reverse proxy |
| workqit-nextjs-dev | 3000 | Next.js app |
| workqit-redis-dev | 6379 | Cache |
| workqit-rabbitmq-dev | 5672, 15672 | Message queue |

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `lib/redis.ts` | Redis client & helpers |
| `lib/rabbitmq.ts` | RabbitMQ client & helpers |
| `middleware/rateLimit.ts` | Rate limiting |
| `workers/index.ts` | All workers |
| `docker-compose.dev.yml` | Dev containers |
| `.env.local` | Environment variables |

## 📝 Environment Variables

```env
REDIS_URL=redis://localhost:6379
RABBITMQ_URL=amqp://workqit:workqit123@localhost:5672
```

## 🔄 Common Workflows

### Deploy New Feature
1. Code changes
2. Test locally
3. Commit & push
4. Deploy to production
5. Run migrations if needed
6. Restart workers

### Add New Queue Job
1. Add job type to `lib/rabbitmq.ts`
2. Create worker in `workers/`
3. Add to `workers/index.ts`
4. Restart workers

### Add API Caching
1. Import `cache` from `@/lib/redis`
2. Check cache before DB query
3. Set cache after DB query
4. Set appropriate TTL

---

**Need help?** Check the full documentation:
- [FINAL_SETUP.md](./FINAL_SETUP.md)
- [NGINX_SETUP.md](./NGINX_SETUP.md)
- [REDIS_SETUP.md](./REDIS_SETUP.md)
- [RABBITMQ_SETUP.md](./RABBITMQ_SETUP.md)
