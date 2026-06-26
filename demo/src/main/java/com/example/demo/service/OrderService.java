package com.example.demo.service;

import com.example.demo.model.OrderItem;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.RestaurantOrder;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final List<RestaurantOrder> orders = List.of(
        new RestaurantOrder(
            1L,
            OrderStatus.PREPARING,
            List.of(
                new OrderItem("Pizza Margherita", 12.50, 2),
                new OrderItem("Coca-Cola", 3.00, 1)
            )
        ),
        new RestaurantOrder(
            2L,
            OrderStatus.READY,
            List.of(
                new OrderItem("Burger Classic", 14.00, 1),
                new OrderItem("Frites", 4.50, 1)
            )
        )
    );

    public Optional<RestaurantOrder> getOrderById(Long id) {
        return orders.stream()
                .filter(order -> order.getId().equals(id))
                .findFirst();
    }
}
