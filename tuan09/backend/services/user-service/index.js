import {
  HttpError,
  createJsonServer,
  defineRoute,
  ok,
  requireFields,
  startService,
} from "../../shared/http.js";

const PORT = Number(process.env.PORT || 8081);
const HOST = process.env.HOST || "0.0.0.0";

const users = [
  {
    id: "u1",
    name: "Nguyễn Văn Trường",
    email: "truong@example.com",
    password: "123456",
    phone: "0901000001",
  },
  {
    id: "u2",
    name: "Trần Thanh Huy",
    email: "huy@example.com",
    password: "123456",
    phone: "0901000002",
  },
  {
    id: "u3",
    name: "Lê Minh Sang",
    email: "sang@example.com",
    password: "123456",
    phone: "0901000003",
  },
  {
    id: "u4",
    name: "Phạm Thị Hiền",
    email: "hien@example.com",
    password: "123456",
    phone: "0901000004",
  },
];

const routes = [
  defineRoute("GET", "/health", () => ok({ success: true, service: "user-service" })),

  defineRoute("POST", "/login", ({ body, log }) => {
    requireFields(body, ["email", "password"]);
    log("LOGIN attempt", { email: body.email });

    const user = users.find(
      (item) => item.email === body.email && item.password === body.password,
    );

    if (!user) {
      log("LOGIN failed", { email: body.email });
      throw new HttpError(401, "Email hoặc mật khẩu không đúng");
    }

    log("LOGIN success", { userId: user.id, email: user.email });

    return ok({
      success: true,
      user: sanitizeUser(user),
      token: `demo-token-${user.id}`,
    });
  }),

  defineRoute("GET", "/users/:id", ({ params, log }) => {
    log("VALIDATE user", { userId: params.id });
    const user = users.find((item) => item.id === params.id);

    if (!user) {
      log("VALIDATE user failed", { userId: params.id });
      throw new HttpError(404, "Không tìm thấy người dùng");
    }

    log("VALIDATE user success", { userId: user.id, email: user.email });

    return ok({
      success: true,
      user: sanitizeUser(user),
    });
  }),
];

function sanitizeUser(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

startService(createJsonServer({ serviceName: "user-service", routes }), {
  name: "User Service",
  host: HOST,
  port: PORT,
});
