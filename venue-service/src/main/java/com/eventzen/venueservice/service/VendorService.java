package com.eventzen.venueservice.service;

import com.eventzen.venueservice.entity.Vendor;
import com.eventzen.venueservice.exception.ResourceNotFoundException;
import com.eventzen.venueservice.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    public Vendor createVendor(Vendor vendor) {
        return vendorRepository.save(vendor);
    }

    public List<Vendor> getAllVendors() {
        return vendorRepository.findAll();
    }

    public Vendor getVendorById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vendor not found with id: " + id));
    }

    public Vendor updateVendor(Long id, Vendor vendorDetails) {
        Vendor vendor = getVendorById(id);
        vendor.setName(vendorDetails.getName());
        vendor.setServiceType(vendorDetails.getServiceType());
        vendor.setContactEmail(vendorDetails.getContactEmail());
        vendor.setPhone(vendorDetails.getPhone());
        vendor.setDescription(vendorDetails.getDescription());
        return vendorRepository.save(vendor);
    }

    public void deleteVendor(Long id) {
        Vendor vendor = getVendorById(id);
        vendorRepository.delete(vendor);
    }
}
