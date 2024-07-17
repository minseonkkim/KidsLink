import ParentHeader from "../../components/parent/common/ParentHeader";
import ParentBottomMenubar from "../../components/parent/common/ParentBottomMenubar";
import Menu from '../../components/parent/main/Menu';
import Desc from '../../components/parent/main/Desc';


export default function ParentHome() {
  return (
    <div className="w-[455px] h-[900px] relative overflow-hidden bg-[#ffec8a] font-KoPubDotum">
      <ParentHeader/>
      <Desc />

      <div className="w-[455px] h-[550px] absolute left-0 top-[350px]">
        <div
          className="w-[456px] h-[551px] absolute left-[-1px] top-[-1px] rounded-tl-[40px] rounded-tr-[40px] bg-white"
          style={{
            boxShadow:
              "0px 54px 55px 0 rgba(0,0,0,0.25), 0px -12px 30px 0 rgba(0,0,0,0.12), 0px 4px 6px 0 rgba(0,0,0,0.12), 0px 12px 13px 0 rgba(0,0,0,0.17), 0px -3px 5px 0 rgba(0,0,0,0.09)",
          }}
        />
        <p className="absolute left-[110px] top-[77px] text-[22px] font-bold text-left text-[#212121]">
          어떤 서비스가 필요하세요?
        </p>
        <Menu />
      </div>

      <ParentBottomMenubar/>
    </div>
  )
}