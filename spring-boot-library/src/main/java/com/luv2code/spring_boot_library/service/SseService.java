package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.event.ActivityOccurredEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {
    // A thread-safe list to hold all active admin connections
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(30 * 60 * 1000L);
        emitters.add(emitter);

        // If the frontend disconnects, times out, or errors out, clean up the list
        emitter.onCompletion(() -> emitters.remove(emitter));
        emitter.onTimeout(() -> emitters.remove(emitter));
        emitter.onError((e) -> emitters.remove(emitter));

        return emitter;
    }

    // Listen and Broadcast
    @EventListener
    public void onActivityOccurred(ActivityOccurredEvent event) {
        List<SseEmitter> deadEmitters = new ArrayList<>();

        emitters.forEach(emitter -> {
            try {
                // Push the DTO to the frontend.
                emitter.send(SseEmitter.event()
                        .name("activity-event")
                        .data(event.activity()));
            } catch (IOException e) {
                deadEmitters.add(emitter);
            }
        });

        // Clean up broken connections
        emitters.removeAll(deadEmitters);
    }
}
