
import { useState } from 'react';
import { useOrder } from '../hooks/use-order';
import { Order } from '@/types/order';

interface StarRatingProps {
    orderId: string;
}

export function StarRating({ orderId }: StarRatingProps) {
    const { order, updateOrder } = useOrder({ id: orderId });

    const handleRating = async (rate: number) => {
        await updateOrder({ id: orderId, rating: rate });
    };

    return (
        <div className='py-2.5'>
            {order && <div className="flex justify-around">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`text-5xl ${order?.rating && order.rating >= star ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                        ★
                    </button>
                ))}
            </div>}
        </div>
    );
}