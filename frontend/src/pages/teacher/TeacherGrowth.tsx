import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { IoSearch } from "react-icons/io5";
import GrowthChild from "../../components/teacher/growth/GrowthChild";
import ProfileImg from "../../assets/teacher/profile_img.jpg"
import GrowthDiaryItem from "../../components/teacher/growth/GrowthDiaryItem";
import { FiPlusCircle } from "react-icons/fi";
import ExampleImg from "../../assets/teacher/example_img_1.jpg"

export default function TeacherGrowth() {
  return <>
    <TeacherHeader/>
    <div className="font-KoPubDotum px-[150px]">
        <NavigateBack backPage="홈" backLink='/'/>
        <Title title="성장일지"/>
        <div className="flex flex-row justify-between">
          <div className="rounded-[10px] bg-[#f4f4f4] w-[380px] h-[520px] p-[10px]">
              <div className="bg-[#fff] h-[53px] rounded-[10px] flex items-center p-3 mx-2 my-3">
                <IoSearch className="text-[25px] mr-3"/>
                <input type="text" className="focus:outline-none text-[18px]"/>
              </div>
              <div className="flex flex-wrap w-[360px] h-[420px] overflow-y-auto custom-scrollbar">
                <GrowthChild currentChild={false} name="김민선" profileImgPath={ProfileImg} completed={true}/>
                <GrowthChild currentChild={true} name="김범수" profileImgPath={ProfileImg} completed={false}/>
                <GrowthChild currentChild={false} name="김민선" profileImgPath={ProfileImg} completed={false}/>
                <GrowthChild currentChild={false} name="김민선" profileImgPath={ProfileImg} completed={true}/>
                <GrowthChild currentChild={false} name="김민선" profileImgPath={ProfileImg} completed={true}/>
                <GrowthChild currentChild={false} name="김민선" profileImgPath={ProfileImg} completed={true}/>
              </div>
          </div>
          <div className="rounded-[10px] bg-[#f4f4f4] w-[720px] h-[520px] p-[10px]">
            <div className="flex flex-wrap content-start w-[700px] h-[500px] rounded-[20px] bg-[#f4f4f4] overflow-auto custom-scrollbar p-1">
              <div className="bg-[#fff] rounded-[10px] w-[135px] h-[135px] m-[17px] flex items-center justify-center font-bold text-[18px]">
                <FiPlusCircle className="text-[30px]"/>
              </div>
              <GrowthDiaryItem date="2024.07.11" imgPaths={[ExampleImg]} />
              <GrowthDiaryItem date="2024.07.10" imgPaths={[]}/>
              <GrowthDiaryItem date="2024.07.09" imgPaths={[]}/>
              <GrowthDiaryItem date="2024.07.11" imgPaths={[]} />
            </div>
          </div>
        </div>
    </div>
  </>
}