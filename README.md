# blog-app-by-chatgpt

ChatGPT にブログアプリのバックエンドを作成させてみました。

# instration

```shell
$ npm install typescript -D
$ npm install express
$ npm install @types/express -D
$ npm install prisma -D
$ npm install jsonwebtoken cookie-parser cors multer

$ npm i -D @types/cookie-parser @types/cors

$ npm i -D nodemon ts-node @types/node
$ npm i -D @types/bcrypt

$ npm install -D jest ts-jest @types/jest

```

```shell
$ npm install express cors helmet morgan prisma --save
$ npm install -D typescript @types/express @types/cors @types/helmet @types/morgan

$ npm install prisma -D
```

```shell
$ npm i jsonwebtoken bcrypt
$ npm i -D @types/jsonwebtoken @types/bcrypt
$ npm i -D @types/bcrypt
```

## prisma

```shell
# sqliteを使う
$ npx prisma init --datasource-provider sqlite


$ npx prisma migrate dev --schema=./src/database/prisma/schema.prisma
$ npx prisma migrate reset --schema=./src/database/prisma/schema.prisma
$ npx prisma studio --schema=./src/database/prisma/schema.prisma

```

```shell
.
├── dist
│   ├── ...
│   └── ...
├── node_modules
│   ├── ...
│   └── ...
├── src
│   ├── controllers
│   │   ├── authController.ts
│   │   └── postController.ts
│   ├── database
│   │   ├── migrations
│   │   └── prisma
│   │       ├── schema.prisma
│   │       └── seed.ts
│   ├── middleware
│   │   ├── errorHandler.ts
│   │   └── requireAuth.ts
│   ├── models
│   │   ├── postModel.ts
│   │   └── userModel.ts
│   ├── routes
│   │   ├── authRoutes.ts
│   │   └── postRoutes.ts
│   ├── app.ts
│   └── server.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── yarn.lock

```
