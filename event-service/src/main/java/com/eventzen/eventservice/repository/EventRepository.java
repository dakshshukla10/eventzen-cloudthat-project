package com.eventzen.eventservice.repository;

import com.eventzen.eventservice.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByVenueId(Long venueId);
    List<Event> findByOrganizerId(Long organizerId);
    List<Event> findByStatus(Event.EventStatus status);
}
