import axiosInstance from "./token/axiosInstance";
import { ParentInfo, TeacherInfo } from "../types/info"


// 부모 정보 조회 함수
export async function getParentInfo(): Promise<ParentInfo> {
  try {
    const response = await axiosInstance.get("/parent");

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch parent-info");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getOneParentInfo(parentId: number): Promise<ParentInfo> {
  try {
    const response = await axiosInstance.get(`/parent/${parentId}`);

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch parent-info");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 선생님 정보 조회 함수
export async function getTeacherInfo(): Promise<TeacherInfo> {
  try {
    const response = await axiosInstance.get("/teacher");

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch parent-info");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 반 담당 선생님 조회
export async function getClassTeacherInfo(kindergartenClassId: number): Promise<TeacherInfo> {
  try {
    const response = await axiosInstance.get(`/kindergarten/class/${kindergartenClassId}/teacher`);

    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch parent-info");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

// 범수가 건드림
export async function getTeacherId() {
  try {
    const response = await axiosInstance.get(`/teacher/teacherId`);
    if (response.data.status === "success") {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch parent-info");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}
