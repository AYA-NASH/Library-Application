package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dto.LoanDtos;
import com.luv2code.spring_boot_library.mapper.HistoryMapper;
import com.luv2code.spring_boot_library.repository.HistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistoryService {
    private final HistoryRepository historyRepository;
    private final HistoryMapper historyMapper;

    public Page<LoanDtos.HistoryResponse> getUserBooksHistory(Long userId, Pageable pageable) {
        return historyRepository.findBooksByUserId(userId, pageable)
                .map(historyMapper::toHistoryResponse);
    }
}
