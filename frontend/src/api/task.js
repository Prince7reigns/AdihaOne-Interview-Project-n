import axios from "axios";
import { validateTaskInput } from "../utils";
import { handleAxiosError } from "../utils/axiosStatusHandler";

const BASE_URL = "https://task-manager-fbg3.onrender.com/api/v1/tasks/gp";
const BASE_URL_ID = "https://task-manager-fbg3.onrender.com/api/v1/tasks";

class TaskService {

  async createTask({ title, description, priority, dueDate, token }) {
    const validationError = validateTaskInput({ title, description, dueDate });
    if (validationError) return { success: false, error: validationError };

    try {
      const res = await axios.post(
        BASE_URL,
        { title, description, priority, dueDate },
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      return { success: true, message: "Task created successfully.", data: res.data.data };
    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Create Task Error:", errors);
      return { success: false, error: errors };
    }
  }

  async getTasks({ token }) {
    try {
      const res = await axios.get(BASE_URL, {
        headers: { Authorization: token, "Content-Type": "application/json" },
        withCredentials: true,
      });

      return { success: true, message: "Tasks fetched successfully.", data: res.data.data };
    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Get Tasks Error:", errors);
      return { success: false, error: errors };
    }
  }

  async deleteTask({ id, token }) {
    try {
      const res = await axios.delete(`${BASE_URL_ID}/${id}/gp`, {
        headers: { Authorization: token, "Content-Type": "application/json" },
        withCredentials: true,
      });

      return { success: true, message: "Task deleted successfully.", data: res.data.data };
    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Delete Task Error:", errors);
      return { success: false, error: errors };
    }
  }

  async toggleCompleteTask({ id, token }) {
    try {
      const res = await axios.post(
        `${BASE_URL_ID}/${id}/gp`,
        {}, // body is empty, headers go in the config
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      return { success: true, message: "Task status toggled successfully.", data: res.data.data };
    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Toggle Task Completion Error:", errors);
      return { success: false, error: errors };
    }
  }

  async updateTask({ title, description, priority, dueDate, token, id }) {
    const validationError = validateTaskInput({ title, description, dueDate });
    if (validationError) return { success: false, error: validationError };

    try {
      const res = await axios.put(
        `${BASE_URL_ID}/${id}/gp`,
        { title, description, priority, dueDate },
        {
          headers: { Authorization: token, "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      return { success: true, message: "Task updated successfully.", data: res.data.data };
    } catch (error) {
      const errors = handleAxiosError(error);
      console.error("Update Task Error:", errors);
      return { success: false, error: errors };
    }
  }
}

export const taskService = new TaskService();
