import axiosInstance from './token/axiosInstance'

interface Diary{
    diaryId: number;
    createDate: string;
    content: string;
    images: string[];
}


// 아이별 성장일지 목록 조회
export async function getChildGrowthDiarys(childId: number): Promise<Diary[]>{
    try{
        const response = await axiosInstance.get(`diary/child/${childId}`);

        if(response.data.status === 'success'){
            return response.data.data
        } else{
            throw new Error('Failed to get diary')
        }
    } catch(error){
        throw error
    }
}

// // 성장일지 상세보기 조회
// export async function getDetailGrowthDiary(diaryId: number){
//     try{
//         const response = await axiosInstance.get(`diary/${diaryId}`);

//         if(response.data.status === 'success'){
//             return response.data
//         } else{
//             throw new Error('Failed to get diary')
//         }
//     } catch(error){
//         throw error
//     }
// }