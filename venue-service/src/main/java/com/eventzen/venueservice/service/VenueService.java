package com.eventzen.venueservice.service;

import com.eventzen.venueservice.entity.Venue;
import com.eventzen.venueservice.exception.ResourceNotFoundException;
import com.eventzen.venueservice.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    public Venue createVenue(Venue venue) {
        return venueRepository.save(venue);
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public Venue getVenueById(Long id) {
        return venueRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found with id: " + id));
    }

    public Venue updateVenue(Long id, Venue venueDetails) {
        Venue venue = getVenueById(id);
        venue.setName(venueDetails.getName());
        venue.setLocation(venueDetails.getLocation());
        venue.setCapacity(venueDetails.getCapacity());
        venue.setDescription(venueDetails.getDescription());
        venue.setPricePerHour(venueDetails.getPricePerHour());
        venue.setImageUrl(venueDetails.getImageUrl());
        venue.setAvailable(venueDetails.isAvailable());
        venue.setContactEmail(venueDetails.getContactEmail());
        venue.setPhone(venueDetails.getPhone());
        return venueRepository.save(venue);
    }

    public void deleteVenue(Long id) {
        Venue venue = getVenueById(id);
        venueRepository.delete(venue);
    }

    public List<Venue> searchVenues(String location, Integer capacity) {
        if (location != null && capacity != null) {
            return venueRepository.findByLocationContainingIgnoreCaseAndCapacityGreaterThanEqual(location, capacity);
        } else if (location != null) {
            return venueRepository.findByLocationContainingIgnoreCase(location);
        } else if (capacity != null) {
            return venueRepository.findByCapacityGreaterThanEqual(capacity);
        }
        return venueRepository.findAll();
    }

    public boolean checkAvailability(Long id) {
        Venue venue = getVenueById(id);
        return venue.isAvailable();
    }
}
