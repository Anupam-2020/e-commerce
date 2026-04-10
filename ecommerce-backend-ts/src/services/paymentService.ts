import * as orderRepository from "../repositories/orderRepository";

export const processPayment = async (orderId: string) => {
  const order = await orderRepository.getOrderById(orderId);

  if (!order) throw new Error("Order not found");
  if (order.paymentStatus === "success") throw new Error("Order already paid");
  if (order.retryCount >= order.maxRetries)
    throw new Error("Max payment retries exceeded");

  const now = new Date();
  if (
    order.lastRetryAt &&
    now.getTime() - new Date(order.lastRetryAt).getTime() < 5000
  ) {
    throw new Error("Please wait before retrying payment");
  }

  const success = Math.random() > 0.9;

  if (!success) {
    await orderRepository.updateOrder(orderId, {
      paymentStatus: "failed",
      lastRetryAt: new Date(),
      $inc: { retryCount: 1 },
    });

    throw new Error("Payment failed, please retry");
  }

  const updatedOrder = await orderRepository.updateOrder(orderId, {
    paymentStatus: "success",
    status: "paid",
  });

  if (!updatedOrder) throw new Error("Order not found");
  return updatedOrder;
};
