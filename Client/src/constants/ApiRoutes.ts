export const ADMIN_BASE_ROUTE = "admin";
export const USER_BASE_ROUTE = "user";
export const GARAGE_BASE_ROUTE = "staff";
export const MECHANIC_BASE_ROUTE = "superadmin";
export const AUTH_BASE_ROUTE = "auth";

export const API_ROUTES = {
  CART: {
    ADD: "/user/cart",
    GET: (userId: string, restaurantId: string) =>
      `/user/cart/${userId}/${restaurantId}`,
    UPDATE_QUANTITY: "/user/cart/update-quantity",
    DELETE: (cartId: string, restaurantId: string) =>
      `/user/cart/${cartId}/${restaurantId}`,
  },

  SUPERADMIN_RESTAURANT: {
    CHANGE_STATUS: (restaurantId: string, action: "block" | "unblock") =>
      `/superadmin/restaurant/${restaurantId}/${action}`,
  },

   VARIANT: {
    ADD: "/user/varients",

    GET_ALL: (page: number, limit: number, search: string) =>
      `/user/varients?page=${page}&limit=${limit}&search=${search}`,

    DELETE: (variantId: string) => `/user/varients/${variantId}`,

    EDIT: (variantId: string) => `/user/varients/${variantId}`,
  },

  ADMIN_TABLE: {
    ADD: "/admin/table",

    EDIT: (tableId: string) => `/admin/table/${tableId}`,

    GET_ALL: (
      restaurantId: string,
      page: number,
      limit: number,
      search: string
    ) =>
      `/admin/table/${restaurantId}?page=${page}&limit=${limit}&search=${search}`,

    CHANGE_AVAILABILITY: (tableId: string) => `/admin/table/${tableId}`,

    DELETE: (tableId: string) => `/admin/table/${tableId}`,
  },

   SUPERADMIN_USER: {
    GET_ALL: (
      page: number,
      limit: number,
      search: string
    ) => `/superadmin/user?page=${page}&limit=${limit}&search=${search}`,

    CHANGE_STATUS: (userId: string) =>
      `/superadmin/user/${userId}/status`,
  },

  ADMIN_ITEMS: {
    GET_ONE: (itemId: string) => `/admin/items/${itemId}`,
  },

  AI: {
    ASK: "/user/ai",
  },

  TABLE: {
    CHECK: "/user/check-table",
  },

  CATEGORY: {
    GET_ALL: (
      restaurantId: string,
      page?: number,
      limit?: number,
      search?: string,
    ) =>
      `/admin/category/${restaurantId}?search=${search ?? ""}&page=${page ?? 1}&limit=${limit ?? 10}`,

    ADD: "/admin/category",

    DELETE: (restaurantId: string, categoryId: string) =>
      `/admin/category/${restaurantId}/${categoryId}`,

    EDIT: (restaurantId: string, categoryId: string) =>
      `/admin/category/${restaurantId}/${categoryId}`,
  },

  SUBCATEGORY: {
    GET_ALL: (
      restaurantId: string,
      page: number,
      limit: number,
      search: string,
    ) =>
      `/admin/subcategory/${restaurantId}?search=${search}&page=${page}&limit=${limit}`,

    ADD: "/admin/subcategory",

    DELETE: (subcategoryId: string) => `/admin/subcategory/${subcategoryId}`,

    EDIT: (subcategoryId: string) => `/admin/subcategory/${subcategoryId}`,
  },

  ITEMS: {
    GET_ALL: (
      restaurantId: string,
      page: number,
      limit: number,
      search: string,
    ) =>
      `/admin/restaurants/items/${restaurantId}?search=${search}&page=${page}&limit=${limit}`,

    ADD: "/admin/items",

    DELETE: (itemId: string) => `/admin/items/${itemId}`,

    EDIT: (itemId: string) => `/admin/items/${itemId}`,

    CHANGE_STATUS: (itemId: string) => `/admin/items/${itemId}/status`,

    GET_MENU_ITEMS: (restaurantId: string) => `/admin/items/${restaurantId}`,
  },

  ORDERS: {
    PAYMENT: "/user/order/payment",

    GET_ALL: (userId: string, page: number, limit: number, search?: string) =>
      `/user/orders?userId=${userId}&page=${page}&limit=${limit}&search=${
        search ?? ""
      }`,

    GET_ONE: (orderId: string) => `/user/orders/${orderId}`,

    CANCEL: (orderId: string) => `/user/orders/${orderId}/cancell`,

    ESTIMATE: (orderId: string) => `/user/orders/${orderId}/estimate`,
  },

  STAFF_AUTH: {
    LOGIN: "/staff/auth/login",
    FORGOT_PASSWORD: "/staff/auth/forgot-password",
  },

   WALLET: {
    GET: (userId: string) => `/user/wallet?userId=${userId}`,
    PAY: "/user/wallet/pay",
  },

  ADMIN_STAFF: {
    ADD: "/admin/staff",
    GET_ALL: (
      restaurantId: string,
      page?: number,
      limit?: number,
      search?: string,
    ) =>
      `/admin/staff/${restaurantId}?page=${page ?? 1}&limit=${limit ?? 10}${
        search ? `&search=${encodeURIComponent(search)}` : ""
      }`,
    DELETE: (staffId: string) => `/admin/staff/${staffId}`,
    EDIT: (staffId: string) => `/admin/staff/${staffId}`,
    CHANGE_STATUS: (staffId: string) => `/admin/staff/${staffId}`,
  },

  STAFF_OPERATIONS: {
    GET_TOTAL_ORDERS: (restaurantId: string) =>
      `/staff/getOrders/${restaurantId}`,

    UPDATE_ITEM_STATUS: "/staff/update-item",

    ASSIGN_CHEF: (orderId: string, itemId: string) =>
      `/staff/orders/${orderId}/item/${itemId}/assign-cheff`,

    GET_ASSIGNED_ITEMS: (restaurantId: string, chefId: string) =>
      `/staff/getAssignedItems/${restaurantId}/${chefId}`,

    ASSIGN_ORDER: (orderId: string) => `/staff/assignOrder/${orderId}`,

    CHANGE_ORDER_STATUS: (orderId: string) =>
      `/staff/order/updatestatus/${orderId}`,

    GET_STAFF: (staffId: string) => `/staff/getstaff/${staffId}`,

    CHANGE_PASSWORD: "/staff/change-password",
  },

  PROFILE: {
    EDIT: (userId: string) => `/user/profile/${userId}`,
    VERIFY_EMAIL_OTP: "/user/profile/verify-email-otp",
    CHANGE_PASSWORD: (userId: string) => `/user/profile/${userId}`,
    UPLOAD_IMAGE: (userId: string) => `/user/profile/${userId}/image`,
  },

  FEEDBACK: {
    ADD: "/user/feedback",
    GET_ITEM_RATINGS: (restaurantId: string) =>
      `/user/feedback/items/${restaurantId}`,
  },

  NOTIFICATION: {
    GET_ALL: (recipientId: string, model?: string) =>
      `/notification/getnotification/${recipientId}/${model}`,
    MARK_AS_READ: (notificationId?: string) =>
      `/notification/${notificationId}`,
  },

  PLAN: {
    CREATE: "/superadmin/plan",
    GET_ALL: (page?: number, limit?: number) =>
      `/superadmin/plan?page=${page}&limit=${limit}`,
    EDIT: (id: string) => `/superadmin/plan/${id}`,
    DELETE: (id: string) => `/superadmin/plan/${id}`,
  },

  SUBSCRIPTION: {
    CREATE_PAYMENT: "/admin/create-payment",
    PAYMENT_SESSION: (sessionId: string) =>
      `/admin/payment/session/${sessionId}`,
    GET_ACTIVE_PLAN: (restaurantId: string) => `/admin/getplan/${restaurantId}`,
    UPGRADE: "/admin/subscription/upgrade",
  },

  INSTRUCTION: {
    ADD: "/user/instruction",
  },
};
