// import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

// export default [
//   // =====================
//   // Main Public Layout
//   // =====================
//   layout("components/layout/main-layout.tsx", [
//     index("routes/landing-page.tsx"),

//     route("/events", "routes/events-page.tsx"),
//     route("/events/:eventId", "routes/event-detail-page.tsx"),

//     route("/checkout", "routes/checkout-page.tsx"),
//     route("/payment/:transactionId", "routes/payment-page.tsx"),
//     route("/transactions", "routes/transactions-page.tsx"),
//   ]),

//   // =====================
//   // Dashboard Layout
//   // =====================
//   layout("components/layout/dashboard-layout.tsx", [
//     ...prefix("/dashboard", [index("routes/dashboard/dashboard-page.tsx")]),
//   ]),

//   // =====================
//   // Auth Routes (No Layout)
//   // =====================
//   route("/login", "routes/auth/login-page.tsx"),
//   route("/register", "routes/auth/register-page.tsx"),

//   // =====================
//   // 404
//   // =====================
//   route("*", "routes/not-found.tsx"),
// ] satisfies RouteConfig;