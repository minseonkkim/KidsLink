package com.ssafy.kidslink.common.websocket;

import com.ssafy.kidslink.common.websocket.WebSocketHandler;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Set;

@Service
public class WebSocketService {
    private final WebSocketHandler webSocketHandler;
    // 하드코딩된 유치원 ID 목록 (예제용)
    private final List<Integer> kindergartenIds = List.of(1, 2, 3);

    public WebSocketService(WebSocketHandler webSocketHandler) {
        this.webSocketHandler = webSocketHandler;
    }

    @Scheduled(fixedRate = 5000)
    public void sendLocationUpdates() {
        String locationMessage = "{ \"latitude\": 37.5665, \"longitude\": 126.9780 }";

        // sessionsByKindergartenId 맵에서 키 세트를 가져와 유치원 ID 목록을 동적으로 구성
        Set<Integer> kindergartenIds = webSocketHandler.getKindergartenIds();

        for (Integer kindergartenId : kindergartenIds) {
            try {
                webSocketHandler.sendMessage(kindergartenId, locationMessage);
            } catch (IOException e) {
                System.err.println("Failed to send message to kindergartenId " + kindergartenId + ": " + e.getMessage());
            }
        }
    }
}
