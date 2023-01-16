import { BsMoonStars, BsSun } from "react-icons/bs";

const LightModeToggle = ({ mode, changeMode }: { mode: any, changeMode: () => void }) => {
  return (
    <div className={"absolute top-[100px] right-0"}>
      <div className={"w-[60px] h-[60px] cursor-pointer flex items-center justify-center bg-transparent overflow-hidden relative"} onClick={() => changeMode()}>
        <div className={`absolute flex flex-col gap-y-1 ${mode ? "translate-y-[-28%] transition duration-200" : "translate-y-[28%] transition duration-200"}`}>
          <BsSun className={`text-5xl text-orange-500`} />
          <BsMoonStars className={`text-5xl text-blue-500`} />
        </div>
      </div>
    </div>
  );
};
export default LightModeToggle;