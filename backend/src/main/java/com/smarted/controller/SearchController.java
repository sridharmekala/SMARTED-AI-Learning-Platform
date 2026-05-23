package com.smarted.controller;

import com.smarted.dto.SearchResponse;
import com.smarted.service.SearchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/search")
    public ResponseEntity<SearchResponse> search(@RequestParam(defaultValue = "") String q) {
        return ResponseEntity.ok(searchService.search(q));
    }
}
