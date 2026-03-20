package com.eventzen.eventservice.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BookingRequest {
    @NotNull(message = "Event ID is required")
    private Long eventId;

    @NotNull(message = "User ID is required")
    private Long userId;

    private String userName;
    private String userEmail;

    @Positive(message = "Number of tickets must be positive")
    private int numberOfTickets = 1;
}
