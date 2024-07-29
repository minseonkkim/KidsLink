import axiosInstance from "./token/axiosInstance";

type editbroadcastInfo = {
    broadcastId: number;
    accessToken: string;
    broadcastTitle: string;
    content: string;
    script: string;
    ttsSetting: boolean;
    chatbotSetting: boolean;
    broadcastStartDate: string;
};

type broadcastInfo = {
    accessToken: string;
    broadcastTitle: string;
    content: string;
    script: string;
    ttsSetting: boolean;
    chatbotSetting: boolean;
    broadcastStartDate: string;
};

const http = axiosInstance

const url = "/live/broadcast";

async function getLiveStartToken(data: {
    accessToken: string;
    liveBroadcastId: number;
}): Promise<string> {
    const res = await http.post(url + `/start`, data);
    console.log("getLiveStartToken");
    return res.data.data.token;
}

async function getLiveJoinToken(data: { liveBroadcastId: number }) {
    const res = await http.post(url + `/participation`, data);
    console.log("getLiveJoinToken");
    return res.data.data.token;
}

async function stopLive(data: {
    accessToken: string;
    liveBroadcastId: number;
}) {
    return http.put(url + `/stop`, data);
}

// 라이브 예약하기 함수
async function reserveLive(broadcastInfo: broadcastInfo) {
    try {
        const response = await http.post(url + `/reservation`, broadcastInfo);
        const responseData = response.data;
        return responseData;
    } catch (error) {
        console.log("라이브 예약 실패");
        throw error;
    }
}

// 예약된 라이브 조회
async function getLivePlanAPI(
    params: {
        page: number;
        size: number;
    },
    accessToken: string
) {
    const response = await http.get(`${url}/reservation`, {
        params: params,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
    return response.data.data;
}

// 라이브 상세 조회
async function getLiveDetailAPI(
    params: { broadcastId: number },
    accessToken: string
) {
    const response = await http.get(`${url}/info`, {
        params: params,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
    return response.data.data;
}

// 예약된 라이브 삭제
async function deleteLivePlanAPI(
    params: { broadcastId: number },
    accessToken: string
) {
    await http.delete(`${url}/reservation`, {
        params: params,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
}

// 예약된 라이브 수정
async function editLivePlanAPI(
    data: { editbroadcastInfo: editbroadcastInfo },
    accessToken: string
) {
    await http.put(`${url}/reservation`, data, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
}

// 종료된 라이브 방송목록 조회
async function getEndedLiveAPI(
    params: { page: number; size: number },
    accessToken: string
) {
    const response = await http.get(`${url}/stop`, {
        params: params,
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + accessToken,
        },
    });
    console.log(response);
    return response.data.data.broadcastInfoList;
}

export {
    getLiveStartToken,
    getLiveJoinToken,
    stopLive,
    reserveLive,
    getLivePlanAPI,
    getLiveDetailAPI,
    deleteLivePlanAPI,
    editLivePlanAPI,
    getEndedLiveAPI,
};