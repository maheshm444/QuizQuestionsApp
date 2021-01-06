import http from "./httpService";
import { apiUrl } from "../config.json";

const questapiEndpoint = apiUrl + "/questions";

function questionUrl(id) {
  return `${questapiEndpoint}/${id}`;
}

export function getQuestions() {
  return http.get(questapiEndpoint);
}

export function getQuestion(questId) {
  return http.get(questionUrl(questId));
}

export function saveQuestion(question) {
  if (question._id) {
    const body = { ...question };
    delete body._id;
    return http.put(questionUrl(question._id), body);
  }

  return http.post(questapiEndpoint, question);
}

export function deleteQuestion(questionId) {
  return http.delete(questionUrl(questionId));
}
