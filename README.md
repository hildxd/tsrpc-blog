# tsrpc-blog
tsrpc-blog is a blog system based on tsrpc.

## Features
- [x] Login/Register
- [x] Post
- [x] Tag
- [ ] public session
- [ ] private session
- [ ] upload file to oss
- [ ] ci
- [ ] create deploy file


## Required environment
- Node.js 14+
- PostgreSQL 12+
- Redis 6+
- [argon2 dep](https://github.com/ranisalt/node-argon2#OSX)

PostgreSQL and Redis can be installed by Docker.
[My docker compose File](https://github.com/hildxd/docker-compose)


## How to run
1. Install dependencies

```bash
cd backend
pnpm i
cd front-end
pnpm i
```
2. Create database and tables

```bash
cd backend
npx prisma migrate dev --init
# add mock data
npx prisma db seed
```

3. Start server

```bash
cd backend
pnpm dev
cd front-end
pnpm dev
```

4. deploy  
...