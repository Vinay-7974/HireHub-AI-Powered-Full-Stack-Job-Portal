package com.hirehub.jobportal.service;

import com.hirehub.jobportal.dto.ai.*;

public interface AIAnalysisService {
    AIResumeAnalysisDto.Response analyzeResume(Long userId, AIResumeAnalysisDto.Request request);
    AIJobMatchDto.Response matchJob(Long userId, AIJobMatchDto.Request request);
    AICoverLetterDto.Response generateCoverLetter(Long userId, AICoverLetterDto.Request request);
    AIInterviewPrepDto.Response generateInterviewPrep(Long userId, AIInterviewPrepDto.Request request);
    AIChatDto.Response answerCareerChat(Long userId, AIChatDto.Request request);
    AISkillGapDto.Response analyzeSkillGap(Long userId, AISkillGapDto.Request request);
}
