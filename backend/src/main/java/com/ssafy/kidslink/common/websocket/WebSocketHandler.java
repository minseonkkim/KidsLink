package com.ssafy.kidslink.common.websocket;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    private final Map<Integer, CopyOnWriteArrayList<WebSocketSession>> sessionsByKindergartenId = new ConcurrentHashMap<>();
    private final Map<WebSocketSession, Integer> sessionToKindergartenIdMap = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // 세션에서 유치원 ID 가져오기
        Map<String, Object> attributes = session.getAttributes();
        Integer kindergartenId = (Integer) attributes.get("kindergartenId");

        sessionsByKindergartenId
                .computeIfAbsent(kindergartenId, k -> new CopyOnWriteArrayList<>())
                .add(session);
        sessionToKindergartenIdMap.put(session, kindergartenId);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Integer kindergartenId = sessionToKindergartenIdMap.remove(session);
        if (kindergartenId != null) {
            CopyOnWriteArrayList<WebSocketSession> sessions = sessionsByKindergartenId.get(kindergartenId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    sessionsByKindergartenId.remove(kindergartenId);
                }
            }
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Integer kindergartenId = sessionToKindergartenIdMap.get(session);
        if (kindergartenId != null) {
            CopyOnWriteArrayList<WebSocketSession> sessions = sessionsByKindergartenId.get(kindergartenId);
            if (sessions != null) {
                for (WebSocketSession sess : sessions) {
                    if (sess.isOpen()) {
                        sess.sendMessage(message);
                    }
                }
            }
        }
    }

    public void sendMessage(Integer kindergartenId, String message) throws IOException {
        CopyOnWriteArrayList<WebSocketSession> sessions = sessionsByKindergartenId.get(kindergartenId);
        if (sessions != null) {
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    session.sendMessage(new TextMessage(message));
                }
            }
        }
    }
    public Set<Integer> getKindergartenIds() {
        return sessionsByKindergartenId.keySet();
    }
}
