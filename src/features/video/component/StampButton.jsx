export const StampButton = ({ StampImg, count, onClick }) => {
  return (
    <div className="btn-stamp" onClick={onClick}>
      <img src={StampImg} alt="stamp-img"></img>
      {count > 0 ? <span>{count}</span> : ""}
    </div>
  );
};
