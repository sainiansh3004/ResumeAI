import axios from "axios";

const API_URL =
  `${process.env.NEXT_PUBLIC_API_URL || "https://resumeai-qfs2.onrender.com/api"}/resumes`;

const getToken = () => localStorage.getItem("token");

export const getMyResumes = async () => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const createResume = async (
  title: string = "Untitled Resume"
) => {
  const res = await axios.post(
    API_URL,
    { title },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const deleteResume = async (id: string) => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const updateResume = async (id: string, data: any) => {
  const payload = { ...data };
  delete payload._id;
  delete payload.user;
  delete payload.createdAt;
  delete payload.updatedAt;
  delete payload.__v;

  const cleanArray = (arr: any[]) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item) => {
      if (typeof item !== "object" || item === null) return item;
      const cleaned = { ...item };
      delete cleaned._id;
      delete cleaned.id;
      return cleaned;
    });
  };

  if (payload.education) payload.education = cleanArray(payload.education);
  if (payload.experience) payload.experience = cleanArray(payload.experience);
  if (payload.projects) payload.projects = cleanArray(payload.projects);
  if (payload.certifications) payload.certifications = cleanArray(payload.certifications);
  if (payload.achievements) payload.achievements = cleanArray(payload.achievements);
  if (payload.languages) payload.languages = cleanArray(payload.languages);
  if (payload.interests) payload.interests = cleanArray(payload.interests);

  console.log("========== Sending to backend ==========");
  console.log(JSON.stringify(payload, null, 2));

  const res = await axios.put(`${API_URL}/${id}`, payload, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};
export const getResumeById = async (id: string) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return res.data;
};

export const duplicateResume = async (id: string) => {
  const res = await axios.post(
    `${API_URL}/${id}/duplicate`,
    {},
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return res.data;
};

export const getPublicResumeById = async (id: string) => {
  const res = await axios.get(`${API_URL}/public/${id}`);
  return res.data;
};