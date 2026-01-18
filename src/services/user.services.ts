import dbConnect from "@/lib/db";
import User from "@/models/Users";
import bcrypt from "bcryptjs"; // npm install bcryptjs

export const UserService = {
  // 1. Get Users with Search, Pagination & Stats
  async getUsers(page: number = 1, limit: number = 10, search: string = "", roleFilter: string = "") {
    await dbConnect();
    const skip = (page - 1) * limit;

    // Build Query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (roleFilter && roleFilter !== "all") {
      query.role = roleFilter;
    }

    // Parallel Execution: Fetch List + Calculate Dashboard Stats
    const [users, totalDocs, stats] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Passwords excluded by default in schema

      User.countDocuments(query),

      // Aggregation for the Top Cards
      User.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            active: [{ $match: { isActive: true } }, { $count: "count" }],
            admins: [{ $match: { role: "admin" } }, { $count: "count" }],
            authors: [{ $match: { role: "author" } }, { $count: "count" }]
          }
        }
      ])
    ]);

    const formattedStats = {
      total: stats[0].total[0]?.count || 0,
      active: stats[0].active[0]?.count || 0,
      admins: stats[0].admins[0]?.count || 0,
      authors: stats[0].authors[0]?.count || 0,
    };

    return {
      users,
      pagination: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit),
        currentPage: page,
      },
      stats: formattedStats
    };
  },

  // 2. Create User
  async createUser(data: any) {
    await dbConnect();
    const existing = await User.findOne({ email: data.email });
    if (existing) throw new Error("Email already in use");

    const hashedPassword = await bcrypt.hash(data.password, 10);
    return await User.create({ ...data, password: hashedPassword });
  },

  // 3. Update User
  async updateUser(id: string, data: any) {
    await dbConnect();
    
    // Hash password if provided
    if (data.password && data.password.trim() !== "") {
      data.password = await bcrypt.hash(data.password, 10);
    } else {
      delete data.password; // Prevent overwriting with empty string
    }

    return await User.findByIdAndUpdate(id, data, { new: true }).lean();
  },

  // 4. Delete User
  async deleteUser(id: string) {
    await dbConnect();
    return await User.findByIdAndDelete(id);
  }
};