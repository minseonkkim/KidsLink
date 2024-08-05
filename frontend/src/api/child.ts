import axiosInstance from "./token/axiosInstance";

// interface ChildInfo{
//     name: string;
//     kindergartenClassName: string;
//     kindergartenName: string;
//     gender: string;
//     birth: string;
//     profile: string;
// }

// 아이 id로 아이 정보 조회
export async function getChildInfo(childId: number){
    try{
        const response = await axiosInstance.get(`child/${childId}`);
    
        if(response.data.status === 'success'){
            return response.data.data
        } else {
            throw new Error('Failed to get child info')
        }
    } catch (error) {
        console.error(error)
        throw error
    }
}