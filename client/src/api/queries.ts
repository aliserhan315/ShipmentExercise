import api from "./api";

export const AuthAPI = {
  async register(payload: any) {
    const { data } = await api.post("auth/register", payload);
    return data.data; 
  },

  async login(payload: any) {
    const { data } = await api.post("/auth/login", payload);
    return data.data; 
  },

  async refresh(refreshToken: string) {
    const { data } = await api.post("/auth/refresh", { refreshToken });
    return data.data;
  },

  async logout(refreshToken?: string) {
    try {
      await api.post("/auth/logout", refreshToken ? { refreshToken } : {});
    } catch {
        console.log("Logout failed");
    }
  },
};

export const UserAPI = {
  async me() {
    const { data } = await api.get("/users/me");
    return data.data; 
  },

  async updateMe(payload: any) {
    const { data } = await api.put("/users/me", payload);
    return data.data;
  },
};

export const ShipmentAPI = {
  async list(params?: { status?: string; search?: string }) {
    const { data } = await api.get("/shipments", { params });
    return data.data;
  },

  async get(id: number | string) {
    const { data } = await api.get(`/shipments/${id}`);
    return data.data; 
  },

  async create(payload: any) {
    const { data } = await api.post("/shipments", payload);
    return data.data;
  },

  async update(id: number | string, payload: any) {
    const { data } = await api.patch(`/shipments/${id}`, payload);
    return data.data;
  },

  async cancel(id: number | string) {
    const { data } = await api.delete(`/shipments/${id}`);
    return data.data; 
  },
};
