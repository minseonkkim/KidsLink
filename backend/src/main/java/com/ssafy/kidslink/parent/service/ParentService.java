package com.ssafy.kidslink.parent.service;

import com.ssafy.kidslink.parent.dto.JoinDTO;
import com.ssafy.kidslink.parent.repository.ParentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ParentService {
    private final ParentRepository parentRepository;

    public void save(JoinDTO joinDTO) {

    }

}
