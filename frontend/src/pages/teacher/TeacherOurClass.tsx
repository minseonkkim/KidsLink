import Title from "../../components/teacher/common/Title";
import ChildCard from "../../components/teacher/ourclass/ChildCard";
import { useEffect, useState } from "react";
import { useTeacherInfoStore } from "../../stores/useTeacherInfoStore";
import { getClassChilds } from "../../api/kindergarten";
import { getTeacherInfo } from "../../api/Info";
import { getDocumentsByDate } from "../../api/document";
import TeacherLayout from "../../layouts/TeacherLayout";
import useModal from "../../hooks/teacher/useModal";
import daramgi from "../../assets/teacher/playing-daramgi.png"

interface Absent {
  absentId: number;
}

interface Dosage {
  dosageId: number;
}

interface ChildDocument {
  absentExists: boolean;
  dosageExists: boolean;
  absents: Absent[];
  dosages: Dosage[];
}

export default function TeacherOurClass() {
  const [childs, setChilds] = useState([]);
  const [absentCount, setAbsentCount] = useState(0);
  const [dosageCount, setDosageCount] = useState(0);

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  const calculateAge = (birthDateString: string): number => {
    const birthdate = new Date(birthDateString);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDifference = today.getMonth() - birthdate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthdate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const checkDocumentExists = async (
    childId: number
  ): Promise<ChildDocument> => {
    const documents = await getDocumentsByDate(
      childId,
      `${year}-${month}-${day}`
    );
    return documents;
  };

  useEffect(() => {
    const fetchChilds = async (classId: number) => {
      try {
        const fetchedChilds = await getClassChilds(classId);

        const childPromises = fetchedChilds.map(async (child: any) => {
          const documentStatus = await checkDocumentExists(child.childId);

          const absentDocumentIds = documentStatus.absentExists
            ? documentStatus.absents.map((absent: any) => absent.absentId)
            : [];
          const dosageDocumentIds = documentStatus.dosageExists
            ? documentStatus.dosages.map((dosage: any) => dosage.dosageId)
            : [];

          return {
            ...child,
            age: calculateAge(child.birth),
            absentExists: documentStatus.absentExists,
            dosageExists: documentStatus.dosageExists,
            absentDocumentIds: documentStatus.absentExists
              ? absentDocumentIds
              : [],
            dosageDocumentIds: documentStatus.dosageExists
              ? dosageDocumentIds
              : [],
          };
        });

        const childsWithAgeAndStatus = await Promise.all(childPromises);
        setChilds(childsWithAgeAndStatus);

        const absentCount = childsWithAgeAndStatus.filter(
          (child) => child.absentExists
        ).length;
        const dosageCount = childsWithAgeAndStatus.filter(
          (child) => child.dosageExists
        ).length;

        setAbsentCount(absentCount);
        setDosageCount(dosageCount);
      } catch (error) {
        console.error("Failed to fetch childs:", error);
      }
    };

    const teacherInfo = useTeacherInfoStore.getState().teacherInfo;

    if (!teacherInfo) {
      getTeacherInfo()
        .then((data) => {
          useTeacherInfoStore.setState({ teacherInfo: data });
          fetchChilds(data.kindergartenClassId);
        })
        .catch((error) => {
          console.error("Failed to fetch teacher info:", error);
        });
    } else {
      fetchChilds(teacherInfo.kindergartenClassId);
    }
  }, []);

  const teacherInfo = useTeacherInfoStore.getState().teacherInfo;

  return (
    <TeacherLayout
        activeMenu="ourclass"
        setActiveMenu={() => {}}
        titleComponent={<Title title="우리반보기" />}
        imageSrc={daramgi} 
    >
      
      <div className="relative w-full mt-7 mb-8 px-[15px] flex flex-col items-center">
      <div className="flex lg:flex-row flex-col justify-between items-center w-full">
        <div className="lg:w-[250px] w-0"></div>
        <div className="text-[24px] ml-[20px] font-bold whitespace-nowrap mb-5 lg:mb-0">
          {teacherInfo ? `${teacherInfo.kindergartenName} ${teacherInfo.kindergartenClassName}` : ""}
        </div>
        
        <div className="flex flex-row text-lg lg:text-xl font-bold items-center whitespace-nowrap">
          <div className="bg-[#ffdfdf] px-3 py-1.5 lg:px-5 font-bold rounded-[10px] flex flex-row items-center mr-3">
            결석
          </div>
          <div className="mr-5">{absentCount}명</div>
          <div className="bg-[#e7dfff] px-3 py-1.5 lg:px-5 font-bold rounded-[10px] flex flex-row items-center mr-3">
            투약
          </div>
          <div className="mr-5">{dosageCount}명</div>
        </div>
      </div>
        <div className="flex flex-row flex-wrap w-full mt-3 justify-around">
          {childs.map((child, index) => (
            <ChildCard
              key={index}
              name={child.name}
              gender={child.gender}
              age={child.age}
              absent={child.absentExists}
              dosage={child.dosageExists}
              absentId={child.absentDocumentIds}
              dosageId={child.dosageDocumentIds}
              profileImgPath={child.profile}
            />
          ))}
        </div>
      </div>
    </TeacherLayout>
  );
}
