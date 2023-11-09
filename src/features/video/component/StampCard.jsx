import { StampButton } from "./StampButton";

export const StampCard = ({ stampImg, stampCount, stamps }) => {
  return (
    <div className="stamp-card">
      <StampButton StampImg={stampImg} count={stampCount} />
      <div className="stamp-time">
        {Array.isArray(stamps) && stamps.map((stamp) => <span>{stamp}</span>)}
      </div>
    </div>
  );
};
