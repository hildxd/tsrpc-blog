import { create } from "zustand";
import apiClient from "../http";
import { ResGetUserInfo } from "../shared/protocols/user/PtlGetUserInfo";

interface UserState {
  user?: ResGetUserInfo;
  getUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: undefined,
  getUser: async () => {
    const data = await apiClient.callApi("user/GetUserInfo", {});
    if (data.isSucc) {
      set((state) => ({ ...state, user: data.res }));
    }
  },
}));

export default useUserStore;
