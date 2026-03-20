package com.eventzen.eventservice.service;

import com.eventzen.eventservice.entity.Event;
import com.eventzen.eventservice.exception.ResourceNotFoundException;
import com.eventzen.eventservice.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + id));
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        event.setName(eventDetails.getName());
        event.setDescription(eventDetails.getDescription());
        event.setDate(eventDetails.getDate());
        event.setVenueId(eventDetails.getVenueId());
        event.setOrganizerId(eventDetails.getOrganizerId());
        event.setStatus(eventDetails.getStatus());
        event.setImageUrl(eventDetails.getImageUrl());
        event.setMaxAttendees(eventDetails.getMaxAttendees());
        event.setTicketPrice(eventDetails.getTicketPrice());
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        Event event = getEventById(id);
        eventRepository.delete(event);
    }

    public List<Event> getEventsByVenue(Long venueId) {
        return eventRepository.findByVenueId(venueId);
    }
}
