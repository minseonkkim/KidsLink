package com.ssafy.kidslink.common.websocket;

import com.ssafy.kidslink.common.websocket.WebSocketHandler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class WebSocketService {
    private final WebSocketHandler webSocketHandler;

    public WebSocketService(WebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @Scheduled(fixedRate = 5000)
    public void sendLocationUpdates() throws IOException {
        String locationMessage = "{ \"latitude\": 37.5665, \"longitude\": 126.9780 }";
        webSocketHandler.sendMessage(locationMessage);
    }
}
