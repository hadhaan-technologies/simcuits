import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

console.log("API BASE:", API_BASE);

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export const fetchArticles = (page = 1, tag) =>
  api
    .get("/articles", {
      params: { page, tag },
    })
    .then((res) => res.data);

export const fetchArticleBySlug = (slug) =>
  api.get(`/articles/${slug}`).then((res) => res.data);

export const fetchMyArticles = () =>
  api.get("/articles/mine").then((res) => res.data);

export const createArticle = (payload) =>
  api.post("/articles", payload).then((res) => res.data);

export const updateArticle = (id, payload) =>
  api.patch(`/articles/${id}`, payload).then((res) => res.data);

export const deleteArticle = (id) =>
  api.delete(`/articles/${id}`).then((res) => res.data);
