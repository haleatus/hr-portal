import { IAdmin } from "@/interfaces/admin.interface";
import { create } from "zustand";

interface AdminState {
  admins: IAdmin[] | null;

  setAdmins: (admins: IAdmin[]) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  admins: null,

  setAdmins: (admins) => set({ admins }),
}));
