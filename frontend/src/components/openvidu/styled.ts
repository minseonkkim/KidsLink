import styled from "styled-components";
import { Box } from "@mui/material";

interface StyledProps {
  width?: string;
  height?: string;
  $border?: string;
  $background_color?: string;
  color?: string;
  padding?: string;
  margin?: string;
}

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: auto;
  margin-top: 60px;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1240px;
  min-width: 800px;
  min-height: calc(100vh - 160px);
`;

const Button = styled.button<StyledProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: ${({ width }) => width || "auto"};
  height: ${({ height }) => height || "auto"};
  border: ${({ $border }) => $border || "none"};
  border-radius: 8px;
  background-color: ${({ $background_color }) => $background_color || "white"};
  color: ${({ color }) => color || "black"};
  padding: ${({ padding }) => padding || "8px"};
  margin: ${({ margin }) => margin || "8px"};
  cursor: pointer;
`;

const HorizontalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 96px auto 8px auto;
  box-sizing: border-box;
  width: 100%;
  max-width: 1240px;
  min-width: 800px;
  min-height: calc(100vh - 104px);
  padding: 0 20px;
`;

const ProgressBar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 39px;
  margin-bottom: 74px;
`;

const StyledBox = styled(Box)<StyledProps>`
  width: ${({ width }) => width || "100%"};
  height: ${({ height }) => height || "85px"};
  background-color: ${({ $background_color }) => $background_color || "#3994F0"};
  color: ${({ color }) => color || "white"};
`;

const WriteContainer = styled.div`
  min-width: 343px;
  border-radius: 8px;
  border: 1px solid var(--lightgrey, #e8ebee);
  position: relative;
  padding: 80px;
  margin-top: 40px;
`;

const WriteTitle = styled.div`
  text-align: left;
  font-size: 16px;
  color: var(--blackgrey, #35383b);
  font-weight: 700;
  margin-bottom: 24px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  width: 100%;
`;

const InputLabel = styled.label`
  min-width: 100px;
  text-align: left;
  font-size: 14px;
  color: var(--grey-2, #a7aeb4);
  height: 50px;
  line-height: 50px;
`;

const Input = styled.input`
  flex: 1;
  background-color: var(--lightestgrey, #f7f8fa);
  border: 0.77px solid var(--lightgrey, #e8ebee);
  border-radius: 12px;
  height: 50px;
  box-sizing: border-box;
  padding-left: 24px;
  color: #35383b;
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }

  &:focus {
    border: 1px solid #3994f0;
  }

  &::placeholder {
    color: #a7aeb4;
  }
`;

const Poster = styled.div`
  flex: 5;
  width: 86%;
  background-color: var(--lightestgrey, #f7f8fa);
  border: 0.77px solid var(--lightgrey, #e8ebee);
  border-radius: 12px;
  height: 50px;
  box-sizing: border-box;
  padding-left: 24px;
  color: var(--grey-2, #a7aeb4);
  font-size: 14px;
  font-weight: 400;
  display: flex;
  align-items: center;
`;

const Red = styled.span`
  color: var(--red, #ff7676);
`;

export {
  MainContainer,
  Button,
  HorizontalContainer,
  ProgressBar,
  StyledBox,
  WriteContainer,
  WriteTitle,
  Row,
  InputLabel,
  Input,
  Poster,
  Red,
};
