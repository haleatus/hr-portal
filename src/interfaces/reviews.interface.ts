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

// Type definitions
export interface Questionnaire {
  id: number;
  createdAt: string;
  updatedAt: string;
  question: string;
  answers: string[];
  ratings: number;
}

export interface ReviewData {
  id: number;
  createdAt: string;
  updatedAt: string;
  reviewType: string;
  subject: string;
  description: string;
  progressStatus: string;
  reviewee: {
    id: number;
    fullname: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  reviewer: {
    id: number;
    fullname: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  dueDate: string;
  questionnaires: Questionnaire[];
}

export interface ReviewResponse {
  statusCode: number;
  timestamp: string;
  message: string;
  data: ReviewData;
}
