package com.smarted.controller;

import com.smarted.dto.CertificateResponse;
import com.smarted.service.CertificateService;
import java.security.Principal;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CertificateController {

    private final CertificateService certificateService;

    public CertificateController(CertificateService certificateService) {
        this.certificateService = certificateService;
    }

    @GetMapping("/courses/{courseId}/certificate")
    public ResponseEntity<CertificateResponse> getCertificate(
            Principal principal,
            @PathVariable Long courseId
    ) {
        return ResponseEntity.ok(certificateService.getCertificate(principal.getName(), courseId));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleBadRequest(RuntimeException exception) {
        return ResponseEntity.badRequest().body(exception.getMessage());
    }
}
