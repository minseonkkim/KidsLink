import axiosInstance from './token/axiosInstance'

interface Diary{
    diaryId: number;
    createDate: string;
    content: string;
    images: string[];
}

export async function getChildGrowthDiarys(childId: number){
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