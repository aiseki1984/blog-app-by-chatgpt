import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { createRegisterHandler } from "../userController";

jest.mock("jsonwebtoken");
jest.mock("bcrypt");

describe("register", () => {
  let req: Request;
  let res: Response;
  let prisma: PrismaClient;
  let register: ReturnType<typeof createRegisterHandler>;

  beforeEach(() => {
    req = {
      body: {},
    } as Request;
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    } as unknown as Response;
    prisma = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    } as unknown as PrismaClient;
    register = createRegisterHandler(prisma);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("test-salt");
    (bcrypt.hash as jest.Mock).mockResolvedValue("test-hashed-password");
    (jwt.sign as jest.Mock).mockReturnValue("test-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user", async () => {
    req.body = {
      name: "Test User",
      email: "test@example.com",
      password: "test-password",
    };

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: 1,
      name: req.body.name,
      email: req.body.email,
      password: "test-hashed-password",
    });

    await register(req, res);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: req.body.email },
    });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password, "test-salt");
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: "test-hashed-password",
      },
    });
    expect(jwt.sign).toHaveBeenCalledWith(
      { userId: 1 },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
    expect(res.cookie).toHaveBeenCalledWith("token", "test-token", {
      httpOnly: true,
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "User registered successfully.",
      user: {
        id: 1,
        name: req.body.name,
        email: req.body.email,
        password: "test-hashed-password",
      },
    });
  });

  // 他のテストケースをここに追加
});
