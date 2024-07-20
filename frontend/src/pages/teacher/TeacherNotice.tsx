import React, { useState } from 'react';
import NavigateBack from "../../components/teacher/common/NavigateBack";
import TeacherHeader from "../../components/teacher/common/TeacherHeader";
import Title from "../../components/teacher/common/Title";
import { LuPencilLine } from "react-icons/lu";
import NoticeItem from "../../components/teacher/notice/NoticeItem";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const noticeItems = [
    { title: "딸기농장 현장실습", date: "2024.07.15", content: "안녕하세요. 이번주 금요일에 아이들이 기다리던 딸기 농장으로 현장학습을 갑니다.\n아래의 일정을 참고해주시고, 필요한 준비물을 챙겨주세요.\n\n일시: 이번주 금요일, 7월 19일\n장소: 딸기 농장" },
    { title: "동물원 현장학습 안내", date: "2024.07.15", content: "안녕하세요. 이번주 금요일에 아이들이 기다리던 딸기 농장으로 현장학습을 갑니다.\n아래의 일정을 참고해주시고, 필요한 준비물을 챙겨주세요.\n\n일시: 이번주 금요일, 7월 19일\n장소: 딸기 농장" },
    { title: "공원에서의 자연 놀이", date: "2024.07.11", content: "안녕하세요. 이번주 금요일에 아이들이 기다리던 딸기 농장으로 현장학습을 갑니다.\n아래의 일정을 참고해주시고, 필요한 준비물을 챙겨주세요.\n\n일시: 이번주 금요일, 7월 19일\n장소: 딸기 농장" },
    { title: "딸기농장 현장실습", date: "2024.07.15", content: "안녕하세요. 이번주 금요일에 아이들이 기다리던 딸기 농장으로 현장학습을 갑니다.\n아래의 일정을 참고해주시고, 필요한 준비물을 챙겨주세요.\n\n일시: 이번주 금요일, 7월 19일\n장소: 딸기 농장" },
    { title: "산책로 걷기", date: "2024.07.10", content: "안녕하세요. 이번주 금요일에 아이들이 기다리던 산책로 걷기 행사가 있습니다.\n아래의 일정을 참고해주시고, 필요한 준비물을 챙겨주세요.\n\n일시: 이번주 금요일, 7월 19일\n장소: 산책로" },
    { title: "미술관 방문", date: "2024.07.08", content: "안녕하세요. 이번주 금요일에 아이들이 기다리던 미술관 방문이 예정되어 있습니다.\n아래의 일정을 참고해주시고, 필요한 준비물을 챙겨주세요.\n\n일시: 이번주 금요일, 7월 19일\n장소: 미술관" }
];

const ITEMS_PER_PAGE = 4;

export default function TeacherNotice() {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(noticeItems.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const displayedItems = noticeItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <>
            <TeacherHeader />
            <div className="px-[150px] flex flex-col items-center">
                <NavigateBack backPage="홈" backLink='/' />
                <Title title="알림장" />
                <button className="absolute top-[125px] right-[150px] border-[2px] border-[#7C7C7C] bg-[#E3EEFF] px-3 py-1 font-bold rounded-[10px] hover:bg-[#D4DDEA] flex flex-row items-center">
                    <LuPencilLine className="mr-2" />알림장 작성하기
                </button>
                <div>
                    {displayedItems.map((item, index) => (
                        <NoticeItem
                            key={index}
                            title={item.title}
                            date={item.date}
                            content={item.content}
                        />
                    ))}
                </div>
                <div className="flex justify-center">
                    <nav>
                        <ul className="inline-flex items-center">
                            <li>
                                <button
                                    onClick={handlePreviousPage}
                                    className={`py-2 px-5 ${currentPage === 1 ? 'text-gray-400' : 'text-[#B2D170]'}`}
                                    disabled={currentPage === 1}
                                >
                                    <MdOutlineNavigateBefore className="text-[23px]" />
                                </button>
                            </li>
                            {[...Array(totalPages).keys()].map(page => (
                                <li key={page + 1}>
                                    <button
                                        onClick={() => setCurrentPage(page + 1)}
                                        className={`px-4 py-2 mx-1 font-bold rounded-[360px] ${currentPage === page + 1 ? 'bg-[#B2D170] text-[#fff]' : 'text-[#8CAD1E]'}`}
                                    >
                                        {page + 1}
                                    </button>
                                </li>
                            ))}
                            <li>
                                <button
                                    onClick={handleNextPage}
                                    className={`py-2 px-5 ${currentPage === totalPages ? 'text-gray-400' : 'text-[#B2D170]'}`}
                                    disabled={currentPage === totalPages}
                                >
                                    <MdOutlineNavigateNext className="text-[23px]" />
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </>
    );
}
