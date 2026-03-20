package com.eventzen.venueservice.repository;

import com.eventzen.venueservice.entity.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
}
