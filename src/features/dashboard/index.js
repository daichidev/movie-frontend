import { SubLayout } from "../../components/Layout/SubLayout";
import { MainLayout } from "../../components/Layout/MainLayout";
import "../../styles/dashboard/index.scss";
import LogoImg from "../../assets/logo.png";
import { LevelButton } from "./component/Button";
import { Link, useNavigate } from "react-router-dom";
import { ClassicButton } from "./component/ClassicButton";

export const Home = () => {
  const navigate = useNavigate();
  return (
    <MainLayout>
      <header>
        <button className="btn-back">ダッシュボードへもどる</button>
      </header>
      <SubLayout>
        <div className="col-md-12">
          <img src={LogoImg} alt="logo"></img>
        </div>
        <div className="col-md-12 mt-5 p-3 content">
          <div className="row p-3">
            <div className="col">
              <LevelButton level={1} />
            </div>
            <div className="col">
              <LevelButton level={2} />
            </div>
          </div>
          <div className="row p-3">
            <div className="col">
              <LevelButton level={3} />
            </div>
            <div className="col">
              <LevelButton level={4} />
            </div>
          </div>
          <div className="row p-3">
            <div className="col">
              <LevelButton level={5} />
            </div>
            <div className="col">
              <LevelButton level={6} />
            </div>
          </div>
          <div className="divider"></div>
          <div className="row p-3">
            <div className="col">
              <ClassicButton content="{古*こ*}{典*てん*}：{和*わ*}{歌*か*} • {短*たん*}{歌*か*} • {俳*はい*}{句*く*}{編*へん*}" />
              {/* <ClassicButton content="〓古典《こてん》：〓和《わ》〓歌《か》 • 〓短《たん》〓歌《か》 • 〓俳《はい》〓句《く》〓編《へん》" /> */}
            </div>
            <div className="col">
              <ClassicButton content="{古*こ*}{典*てん*}：{日*にっ*}{記*き*} • {随*ずい*}{筆*ひつ*} • {説*せつ*}{話*わ*}{編*へん*}" />
              {/* <ClassicButton content="〓古《こ》〓典《てん》：〓日《にっ》〓記《き》 • 〓随《ずい》〓筆《ひつ》 • 〓説《せつ》〓話《わ》〓編《へん》" /> */}
            </div>
          </div>
          <div className="row p-3">
            <div className="col">
              <ClassicButton content="{古*こ*}{典*てん*}：{伝*でん*}{統*とう*}{芸*げい*}{能*のう*}{編*へん*}" />
              {/* <ClassicButton content="〓古《こ》〓典《てん》：〓伝《でん》〓統《とう》〓芸《げい》〓能《のう》〓編《へん》" /> */}
            </div>
            <div className="col">
              <ClassicButton content="{古*こ*}{典*てん*}：{狂*きょう*}{言*げん*}「{柿*かき*}{山*やま*}{伏*ぶし*}」" />
              {/* <ClassicButton content="〓古《こ》〓典《てん》：〓狂《きょう》〓言《げん》「〓柿《かき》〓山《やま》 • 〓伏《ぶし》」" /> */}
            </div>
          </div>
          <div className="row p-3 mt-3">
            <div className="col-10">
              {/* <div className="col-3">
                <Link to={`/upload/`} className="btn-level">
                  {"アップロード"}
                </Link>
              </div> */}
            </div>
            <div className="col-2">
              <button
                className="btn-about"
                onClick={() => navigate("/videos/5")}
              >
                <span className="btn-span">ご利用について</span>
              </button>
            </div>
          </div>
        </div>
      </SubLayout>
    </MainLayout>
  );
};
