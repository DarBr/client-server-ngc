package com.example.demo.controller;

import com.example.demo.dto.SignupStatDto;
import com.example.demo.repository.LoginHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/stats")
@CrossOrigin("*")
public class AdminStatsController {

    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @GetMapping("/logins")
    public List<SignupStatDto> getLoginStats(@RequestParam String period) {
        // Hole alle Login-History-Einträge
        List<com.example.demo.model.LoginHistory> allLogins = loginHistoryRepository.findAll();

        Map<String, Long> grouped = new HashMap<>();
        DateTimeFormatter formatter;

        switch (period.toLowerCase()) {
            case "week":
                // Gruppiere nach Kalenderwoche (Beispiel: "KW31 2023")
                grouped = allLogins.stream().collect(Collectors.groupingBy(
                        lh -> "KW" + lh.getLoginTimestamp().get(java.time.temporal.IsoFields.WEEK_OF_WEEK_BASED_YEAR) +
                                " " + lh.getLoginTimestamp().getYear(),
                        Collectors.counting()));
                break;
            case "month":
                // Gruppiere nach Monat (Beispiel: "08-2023")
                formatter = DateTimeFormatter.ofPattern("MM-yyyy");
                grouped = allLogins.stream().collect(Collectors.groupingBy(
                        lh -> lh.getLoginTimestamp().format(formatter),
                        Collectors.counting()));
                break;
            case "day":
            default:
                // Gruppiere nach Tag (Beispiel: "2023-08-01")
                formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                grouped = allLogins.stream().collect(Collectors.groupingBy(
                        lh -> lh.getLoginTimestamp().format(formatter),
                        Collectors.counting()));
                break;
        }

        // Wandle die Map in eine Liste von DTOs um
        List<SignupStatDto> stats = grouped.entrySet().stream()
                .map(e -> new SignupStatDto(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(SignupStatDto::getLabel))
                .collect(Collectors.toList());

        return stats;
    }
}
