package com.ij11.chatbot.service.system;

import com.ij11.chatbot.domain.models.system.StatName;
import com.ij11.chatbot.domain.models.system.Stats;
import com.ij11.chatbot.domain.repositories.StatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

import java.util.LinkedList;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final StatsRepository statsRepository;

    @Transactional
    public void incrementStat(StatName name) {
        Stats stat = statsRepository.findByName(name.getName())
                .orElseGet(() -> {
                    Stats newStat = new Stats();
                    newStat.setName(name.getName());
                    newStat.setStatValue(0L);
                    return newStat;
                });
        stat.setStatValue(stat.getStatValue() + 1);
        statsRepository.save(stat);
    }

    public Long getStatValue(StatName name) {
        return statsRepository.findByName(name.getName())
                .map(Stats::getStatValue)
                .orElse(0L);
    }

    private final LinkedList<Long> responseTimes = new LinkedList<>();

    public synchronized void addResponseTime(long responseTime) {
        int MAX_RESPONSE_TIMES = 20;
        if (responseTimes.size() >= MAX_RESPONSE_TIMES) {
            responseTimes.removeFirst(); // Remove the oldest entry
        }
        responseTimes.add(responseTime);
    }

    public synchronized double getAverageResponseTime() {
        if (responseTimes.isEmpty()) {
            return 0.0;
        }
        return responseTimes.stream().mapToLong(Long::longValue).average().orElse(0.0);
    }

    public synchronized LinkedList<Long> getResponseTimes() {
        return new LinkedList<>(responseTimes);
    }
}