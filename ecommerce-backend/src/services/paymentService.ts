import * as orderRepository from '../repositories/orderRepository';

// export const processPayment = async (orderId: string) => { // mock payment service
//     const success = Math.random() > 0.2;

//     if(!success) {
//         await orderRepository.updatePaymentStatus(orderId, "failed");
//         throw new Error('Payment failed');
//     }

//     let order = await orderRepository.updatePaymentStatus(orderId, "success", "paid");

//     return order;
// }


// payment with re-tries.
export const processPayment = async(orderId: string) => {
    const order = await orderRepository.getorderById(orderId);

    if(!order) throw new Error('Order not found');

    if(order.paymentStatus === 'success') {
        throw new Error('Order already paid');
    }

    if(order.retryCount > order.maxRetries) {
        throw new Error('Max payment retries exceeded');
    }

    const now = new Date();
    if(order.lastRetyAt && now.getTime() - new Date(order.lastRetyAt).getTime() < 5000) {
        throw new Error('Please wait before retrying payment');
    }

    // simulate payment.
    const success = Math.random() > 0.2;

    if(!success) {
        await orderRepository.updatePaymentWithRetry(orderId, {
                paymentStatus: "failed", 
                $inc: { retryCount: 1},
                lastRetyAt: new Date()
            }
        );

        throw new Error('Payment failed, please retry');
    }

    const updatedOrder = await orderRepository.updatePaymentWithRetry(orderId, {
        paymentStatus: "success", 
        status: "paid"
    });

    return updatedOrder;
}