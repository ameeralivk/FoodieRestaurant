import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { userType } from "../../types/userTypes";

interface UserAuthState {
  user: userType | null;
}

interface UserLoginPayload {
  user: userType;
}

const initialState: UserAuthState = {
  user: null,
};

const userAuthSlice = createSlice({
  name: "userAuth",
  initialState,
  reducers: {
    userLoginAction: (state, action: PayloadAction<UserLoginPayload>) => {
      const { user } = action.payload;
      state.user = { ...user };
    },
    userLogoutAction: (state) => {
      state.user = null;
    },
    updateUserStatus: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.status = action.payload;
      }
    },
    setRestaurantName: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.restaurantName = action.payload;
      }
    },
    updateUser: (state, action: PayloadAction<Partial<userType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setRestaurantId: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.restaurantId = action.payload;
      }
    },
    setTableNo: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.tableNo = action.payload;
      }
    },
    updateUserField: (
      state,
      action: PayloadAction<{ key: keyof userType; value: any }>,
    ) => {
      if (state.user) {
        state.user[action.payload.key] = action.payload.value;
      }
    },
  },
});

export const {
  userLoginAction,
  userLogoutAction,
  updateUserStatus,
  updateUser,
  setRestaurantId,
  setTableNo,
  updateUserField,
  setRestaurantName,
} = userAuthSlice.actions;

export default userAuthSlice.reducer;
