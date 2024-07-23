import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import ChildCard from "../../components/teacher/ourclass/ChildCard";
import ProfileImg from "../../assets/teacher/profile_img.jpg";

const ourClassChild = [
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
    return (
        <>
            <TeacherHeader />
            <div className="px-[150px] flex flex-col items-center">            
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

                <div className="flex justify-start flex-wrap gap-4">
                    {ourClassChild.map((child, index) => (
                        <ChildCard 
                            key={index}
                            name={child.childName} 
                            gender={child.childGender} 
                            age={child.childAge} 
                            absent={child.childAbsent} 
                            dosage={child.childDosage} 
                            profileImgPath={child.childProfileImg}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
