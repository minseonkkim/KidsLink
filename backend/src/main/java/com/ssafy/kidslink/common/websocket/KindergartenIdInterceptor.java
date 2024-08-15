package com.ssafy.kidslink.common.websocket;


import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

public class KindergartenIdInterceptor implements HandshakeInterceptor {

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        // URI에서 유치원 ID 추출
        String uri = request.getURI().toString();
        String[] parts = uri.split("/");
        Integer kindergartenId = Integer.parseInt(parts[parts.length - 1]);

        // 세션에 유치원 ID 저장
        attributes.put("kindergartenId", kindergartenId);

        return true;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {

    }
}