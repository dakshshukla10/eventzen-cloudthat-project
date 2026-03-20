package com.eventzen.venueservice.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

@Entity
@Table(name = "venues")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Venue name is required")
    private String name;

    @NotBlank(message = "Location is required")
    private String location;

    @Positive(message = "Capacity must be positive")
    private int capacity;

    @Column(length = 1000)
    private String description;

    @PositiveOrZero(message = "Price must be zero or positive")
    private double pricePerHour;

    private String imageUrl;

    private boolean isAvailable = true;

    @NotBlank(message = "Contact email is required")
    @Email(message = "Must be a valid email")
    private String contactEmail;

    private String phone;
}
