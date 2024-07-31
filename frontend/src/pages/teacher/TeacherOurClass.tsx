import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ChildCard from "../../components/teacher/ourclass/ChildCard";
import ProfileImg from "../../assets/teacher/profile_img.jpg";
import { useEffect, useState } from "react";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import { getClassChilds } from "../../api/kindergarten";

interface OurClassChildType {
    childName: string;
    childGender: string;
    childAge: number;
    childAbsent: boolean;
    childDosage: boolean;
    childProfileImg: string;
}

const ourClassChild: OurClassChildType[] = [
    {childName: "김민선", childGender: "여자", childAge: 4, childAbsent: true, childDosage: true, childProfileImg: ProfileImg},
    {childName: "김범수", childGender: "남자", childAge: 5, childAbsent: true, childDosage: false, childProfileImg: ProfileImg},
    {childName: "김여준", childGender: "남자", childAge: 6, childAbsent: false, childDosage: true, childProfileImg: ProfileImg},
    {childName: "김지원", childGender: "여자", childAge: 5, childAbsent: false, childDosage: false, childProfileImg: ProfileImg},
    {childName: "이상민", childGender: "남자", childAge: 4, childAbsent: false, childDosage: false, childProfileImg: ProfileImg},    
    {childName: "정현수", childGender: "여자", childAge: 5, childAbsent: false, childDosage: false, childProfileImg: ProfileImg}
];

export default function TeacherOurClass() {
    const absentCount = ourClassChild.filter(child => child.childAbsent).length;
    const dosageCount = ourClassChild.filter(child => child.childDosage).length;
    const [childs, setChilds] = useState([]);


    // 나이를 계산하는 함수
    const calculateAge = (birthDateString: string): number => {
        const birthdate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthdate.getFullYear();
        const monthDifference = today.getMonth() - birthdate.getMonth();

        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthdate.getDate())) {
            age--;
        }

        return age;
    };

    useEffect(() => {
        const classId = useTeacherInfoStore.getState().teacherInfo.kindergartenClassId;
        const fetchChilds = async () => {
            try {
                const fetchedChilds = await getClassChilds(classId);
                // 나이 필드를 추가한 새 객체 배열 생성
                const childsWithAge = fetchedChilds.map((child: any) => ({
                    ...child,
                    age: calculateAge(child.birth), // child.birthDate가 생년월일을 포함한다고 가정
                }));
                setChilds(childsWithAge);
            } catch (error) {
                console.error("Failed to fetch childs:", error);
            }
        };

        fetchChilds();
    }, []);
    

    return (
        <>
            <TeacherHeader />
            <div className="mt-[85px] px-[150px] flex flex-col items-center">            
                <NavigateBack backPage="홈" backLink='/' />            
                <Title title="반 이름" />
                <div className="absolute top-[125px] right-[450px] bg-[#ffdfdf] px-5 py-2 font-bold rounded-[10px] flex flex-row items-center text-xl font-bold">
                    결석
                </div>
                <span className="absolute top-[125px] right-[400px] px-3 py-2 flex flex-row items-center text-xl font-bold">{absentCount}명</span>
                <div className="absolute top-[125px] right-[300px] bg-[#e7dfff] px-5 py-2 font-bold rounded-[10px] flex flex-row items-center text-xl font-bold">
                    투약
                </div>
                <span className="absolute top-[125px] right-[250px] px-3 py-2 flex flex-row items-center text-xl font-bold">{dosageCount}명</span>

                <div className="grid gap-4 w-full" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
                    {childs.map((child, index) => (
                        <ChildCard 
                            key={index}
                            name={child.name} 
                            gender={child.gender} 
                            age={child.age} 
                            absent={child.childAbsent} 
                            dosage={child.childDosage} 
                            profileImgPath={child.profile}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

