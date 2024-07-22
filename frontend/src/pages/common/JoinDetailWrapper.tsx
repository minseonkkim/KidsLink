import { useParams } from "react-router-dom";
import JoinDetails from "./JoinDetails";

export default function JoinDetailsWrapper() {
    const { role } = useParams<{ role: string }>();
    return <JoinDetails role={role || ''} />;
}