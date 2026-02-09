import { PrismaClient, User } from "@prisma/client";
import { comparePassword, hashPassword } from "../../lib/argon.js";
import { ApiError } from "../../utils/api-error.js";
import jwt from "jsonwebtoken";
import { CreateUserBody } from "../../types/user.js";

const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
};

export class AuthService {
  //   prisma: PrismaClient;
  constructor(private prisma: PrismaClient) {
    // this.prisma = prisma;
  }

  register = async (body: CreateUserBody) => {
    //1. Cek avaibilitas email
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    //2. Kalau sudah dipakai throw error
    if (user) {
      throw new ApiError("Email Already Exist", 400);
    }

    //3. Lookup referrer if referralCode is provided
    let referredByUserId: number | null = null;
    if (body.referralCode) {
      const referrer = await this.prisma.user.findFirst({
        where: { referralCode: body.referralCode },
      });

      if (!referrer) {
        throw new ApiError("Referral code not found", 400);
      }
      referredByUserId = referrer.id;
    }

    //4. Hash Password dari body.password
    const hashedPassword = await hashPassword(body.password);

    //5. Generate Unique Referral Code for new user
    let newReferralCode: string;
    let isCodeUnique = false;
    do {
      newReferralCode = generateReferralCode();
      const existingCode = await this.prisma.user.findFirst({
        where: { referralCode: newReferralCode },
      });
      if (!existingCode) isCodeUnique = true;
    } while (!isCodeUnique);

    //6. Create user baru
    const newUser = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword,
        role: body.role,
        referralCode: newReferralCode,
        referredByUserId: referredByUserId,
        point: 0,
        avatar: body.avatar,
      },
    });

    //7. If referred, reward referrer and new user
    if (referredByUserId) {
      // Award points to referrer
      await this.prisma.point.create({
        data: {
          userId: referredByUserId,
          amount: 10000,
          description: "Referral Reward",
          type: "EARNED",
          expiredAt: new Date(new Date().setMonth(new Date().getMonth() + 3)),
        },
      });

      await this.prisma.user.update({
        where: { id: referredByUserId },
        data: { point: { increment: 10000 } },
      });

      // Create coupon for new user
      await this.prisma.coupon.create({
        data: {
          userId: newUser.id,
          code: `REF-${newReferralCode}`,
          discountAmount: 50000,
          expiredAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });
    }

    //8. Return Message Register Success
    return { message: "Register Success" };
  };

  login = async (body: Pick<User, "email" | "password">) => {
    //1. Cek Emailnya ada ga
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });
    //2. Kalo ga ada, throw error
    if (!user) {
      throw new ApiError("Invalid Credential", 400);
    }
    //3. Cek Passwordnya ada ga
    const isPassMatch = await comparePassword(body.password, user.password);
    //4. Kalo ga ada, throw error
    if (!isPassMatch) {
      throw new ApiError("Invalid Credential", 400);
    }
    //5. Generate Token dengan jwt->jsonwebtoken
    const payload = { id: user.id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: "2h",
    });
    //6. Return data usernya
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, accessToken };
  };

  getProfile = async (userId: number) => {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      omit: { password: true },
      include: {
        points: {
          orderBy: { createdAt: 'desc' },
          take: 10, // Recent point history
        },
      },
    });

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    return user;
  };
}
