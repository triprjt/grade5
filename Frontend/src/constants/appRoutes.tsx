export default {
  subjects: "/",
  _subject_details: (id: number) => `/subject/${id}/`,
  subject_details_client: "/subject/:id",
  _module_details: (id: number) => `/module/${id}/`,
  module_details: "/module/:id",
};
