import {
  HttpError,
  createJsonServer,
  defineRoute,
  ok,
  requestJson,
  requireFields,
  startService,
} from "../../shared/http.js";

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";

const serviceUrls = {
  user: process.env.USER_SERVICE_URL || "http://10.11.58.156:8081",
  tour: process.env.TOUR_SERVICE_URL || "http://10.11.58.22:8082",
  booking: process.env.BOOKING_SERVICE_URL || "http://10.11.58.16:8083",
  payment: process.env.PAYMENT_SERVICE_URL || "http://10.11.58.16:8084",
};

const routes = [
  defineRoute("GET", "/health", ({ log }) => {
    log("HEALTH check", { dependencies: serviceUrls });
    return ok({
      success: true,
      service: "orchestrator-service",
      dependencies: serviceUrls,
    });
  }),

  defineRoute("POST", "/login", async ({ body, log, requestId }) => {
    requireFields(body, ["email", "password"]);
    log("FORWARD login to User Service", { userService: serviceUrls.user, email: body.email });
    const result = await requestJson(`${serviceUrls.user}/login`, post(body, requestId));
    log("LOGIN orchestration completed", { userId: result.user?.id, email: result.user?.email });
    return ok(result);
  }),

  defineRoute("GET", "/tours", async ({ log, requestId }) => {
    log("FORWARD list tours to Tour Service", { tourService: serviceUrls.tour });
    const result = await requestJson(`${serviceUrls.tour}/tours`, { requestId });
    log("LIST tours completed", { count: result.tours?.length || 0 });
    return ok(result);
  }),

  defineRoute("GET", "/tours/:id", async ({ params, log, requestId }) => {
    log("FORWARD tour detail to Tour Service", {
      tourService: serviceUrls.tour,
      tourId: params.id,
    });
    const result = await requestJson(`${serviceUrls.tour}/tours/${params.id}`, { requestId });
    log("GET tour detail completed", { tourId: result.tour?.id });
    return ok(result);
  }),

  defineRoute("POST", "/book-tour", async ({ body, log, requestId }) => {
    requireFields(body, ["userId", "tourId", "quantity"]);

    const quantity = Number(body.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      throw new HttpError(400, "Số lượng phải là số dương");
    }

    log("BOOK TOUR orchestration started", {
      requestId,
      userId: body.userId,
      tourId: body.tourId,
      quantity,
      paymentMethod: body.paymentMethod || "CASH",
    });

    log("STEP 1/5 - Validate user via User Service", {
      url: `${serviceUrls.user}/users/${body.userId}`,
    });
    const userResult = await requestJson(`${serviceUrls.user}/users/${body.userId}`, { requestId });
    log("STEP 1/5 - User valid", {
      userId: userResult.user.id,
      email: userResult.user.email,
    });

    log("STEP 2/5 - Get tour information via Tour Service", {
      url: `${serviceUrls.tour}/tours/${body.tourId}`,
    });
    const tourResult = await requestJson(`${serviceUrls.tour}/tours/${body.tourId}`, { requestId });
    const tour = tourResult.tour;
    log("STEP 2/5 - Tour loaded", {
      tourId: tour.id,
      price: tour.price,
      availableSlots: tour.availableSlots,
    });

    if (tour.availableSlots < quantity) {
      log("BOOK TOUR stopped - not enough slots", {
        requestedQuantity: quantity,
        availableSlots: tour.availableSlots,
      });
      throw new HttpError(400, "Tour không còn đủ chỗ trống", {
        availableSlots: tour.availableSlots,
      });
    }

    const totalAmount = tour.price * quantity;
    log("STEP 3/5 - Create booking via Booking Service", {
      url: `${serviceUrls.booking}/bookings`,
      totalAmount,
    });
    const bookingResult = await requestJson(
      `${serviceUrls.booking}/bookings`,
      post({
        userId: body.userId,
        tourId: body.tourId,
        quantity,
        totalAmount,
      }, requestId),
    );
    log("STEP 3/5 - Booking created", {
      bookingId: bookingResult.booking.id,
      status: bookingResult.booking.status,
    });

    log("STEP 4/5 - Process payment via Payment Service", {
      url: `${serviceUrls.payment}/payments`,
      bookingId: bookingResult.booking.id,
      amount: totalAmount,
    });
    const paymentResult = await requestJson(
      `${serviceUrls.payment}/payments`,
      post({
        bookingId: bookingResult.booking.id,
        amount: totalAmount,
        method: body.paymentMethod || "CASH",
      }, requestId),
    );
    log("STEP 4/5 - Payment completed", {
      paymentId: paymentResult.payment.id,
      status: paymentResult.payment.status,
    });

    const finalBookingStatus =
      paymentResult.payment.status === "SUCCESS" ? "CONFIRMED" : "PAYMENT_FAILED";

    log("STEP 5/5 - Update booking status via Booking Service", {
      url: `${serviceUrls.booking}/bookings/${bookingResult.booking.id}/status`,
      finalBookingStatus,
    });
    const updatedBookingResult = await requestJson(
      `${serviceUrls.booking}/bookings/${bookingResult.booking.id}/status`,
      patch({ status: finalBookingStatus }, requestId),
    );
    log("STEP 5/5 - Booking status updated", {
      bookingId: updatedBookingResult.booking.id,
      status: updatedBookingResult.booking.status,
    });

    log("BOOK TOUR orchestration finished", {
      success: paymentResult.payment.status === "SUCCESS",
      bookingId: updatedBookingResult.booking.id,
      paymentStatus: paymentResult.payment.status,
      finalBookingStatus,
    });

    return ok({
      success: paymentResult.payment.status === "SUCCESS",
      message:
        paymentResult.payment.status === "SUCCESS"
          ? "Đặt tour thành công"
          : "Đã tạo booking nhưng thanh toán thất bại",
      user: userResult.user,
      tour,
      booking: updatedBookingResult.booking,
      payment: paymentResult.payment,
      confirmation:
        paymentResult.payment.status === "SUCCESS"
          ? `Tour ${tour.name} đã được đặt thành công cho ${userResult.user.name}.`
          : null,
    });
  }),
];

function post(body, requestId = null) {
  return {
    method: "POST",
    body: JSON.stringify(body),
    requestId,
  };
}

function patch(body, requestId = null) {
  return {
    method: "PATCH",
    body: JSON.stringify(body),
    requestId,
  };
}

startService(createJsonServer({ serviceName: "orchestrator-service", routes }), {
  name: "Orchestrator Service",
  host: HOST,
  port: PORT,
});
