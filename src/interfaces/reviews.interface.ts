export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  fullname: string;
  email: string;
  role: string;
}

export interface FeedbackResponse {
  answers: string[];
  ratings: number;
}

export interface QuestionnaireItem {
  question: string;
  managerFeedback: FeedbackResponse;
  revieweeFeedback: FeedbackResponse;
}

export interface ReviewSummary {
  id: number;
  createdAt: string;
  updatedAt: string;
  summaryQuestionnaire: QuestionnaireItem[];
  averagePerformanceRating: string;
  isAcknowledged: boolean;
  reviewee: User;
}
