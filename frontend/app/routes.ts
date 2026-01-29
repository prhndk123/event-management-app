import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // =====================
  // Main Public Layout
  // =====================
  layout("components/layout/main-layout.tsx", [
    index("routes/landing-page.tsx"),

    route("/events", "routes/events-page.tsx"),
    route("/events/:eventId", "routes/event-detail-page.tsx"),

    route("/checkout", "routes/checkout-page.tsx"),
    route("/payment/:transactionId", "routes/payment-page.tsx"),
    route("/transactions", "routes/transactions-page.tsx"),
  ]),

  // =====================
  // Dashboard Layout
  // =====================
  layout("components/layout/dashboard-layout.tsx", [
    ...prefix("/dashboard", [
      index("routes/dashboard/dashboard-page.tsx"),
      route("events", "routes/dashboard/events-page.tsx"),
      route("transactions", "routes/dashboard/transactions-page.tsx"),
      route("attendees", "routes/dashboard/attendees-page.tsx"),
      route("vouchers", "routes/dashboard/vouchers-page.tsx"),
      route("statistics", "routes/dashboard/statistics-page.tsx"),
      route("settings", "routes/dashboard/settings-page.tsx"),
    ]),
  ]),

  // =====================
  // Auth (No Layout)
  // =====================
  route("/login", "routes/auth/login-page.tsx"),
  route("/register", "routes/auth/register-page.tsx"),

  // =====================
  // 404
  // =====================
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
