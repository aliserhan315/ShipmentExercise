import User from "../models/User";

function toSafeUser(user: User) {
  return {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    location: user.location,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export const UserService = {
  async getById(id: number) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }
    return toSafeUser(user);
  },

  async updateProfile(
    id: number,
    data: {
      firstName?: string;
      lastName?: string;
      phone?: string;
      location?: string;
    }
  ) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.firstName === "string") {
      user.firstName = data.firstName.trim();
    }
    if (typeof data.lastName === "string") {
      user.lastName = data.lastName.trim();
    }
    if (typeof data.phone === "string") {
      user.phone = data.phone.trim();
    }
    if (typeof data.location === "string") {
      user.location = data.location.trim();
    }

    await user.save();
    return toSafeUser(user);
  },
};
