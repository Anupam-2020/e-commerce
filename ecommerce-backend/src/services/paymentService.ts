import * as orderRepository from '../repositories/orderRepository';

export const processPayment = async (orderId: string) => { // mock payment service
    const success = Math.random() > 0.2;

    if(!success) {
        await orderRepository.updatePaymentStatus(orderId, "failed");
        throw new Error('Payment failed');
    }

    let order = await orderRepository.updatePaymentStatus(orderId, "success", "paid");

    return order;
}