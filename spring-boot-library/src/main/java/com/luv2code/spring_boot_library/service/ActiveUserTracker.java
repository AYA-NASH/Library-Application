package com.luv2code.spring_boot_library.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ActiveUserTracker {
    private static final long ACTIVE_WINDOW_MS = 5 * 60 * 1000; // each user stays for 5-min without a new request
    private final Map<String, Long> activeUsersMap = new ConcurrentHashMap<>();

    public void updateActiveUser(String email) {
        if (email != null && !email.equals("anonymousUser")) {
            activeUsersMap.put(email, System.currentTimeMillis());
        }
    }

    public long getActiveUserCount() {
        return activeUsersMap.size();
    }

    //  Background task that runs every 60 seconds to remove inactive sessions.
    @Scheduled(fixedRate = 6000)
    public void removeInactiveUsers() {
        long now = System.currentTimeMillis();

        activeUsersMap.entrySet()
                .removeIf(entry -> (now - entry.getValue()) > ACTIVE_WINDOW_MS);
    }
}
