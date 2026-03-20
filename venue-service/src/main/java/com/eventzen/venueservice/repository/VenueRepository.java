package com.eventzen.venueservice.repository;

import com.eventzen.venueservice.entity.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByLocationContainingIgnoreCase(String location);
    List<Venue> findByCapacityGreaterThanEqual(int capacity);
    List<Venue> findByLocationContainingIgnoreCaseAndCapacityGreaterThanEqual(String location, int capacity);
    List<Venue> findByIsAvailableTrue();
}
