import Image from "next/image";
import openIELogo from "../../public/openIE.svg";
import ConnectWallet from "./connect-wallet";

function Nav() {
  return (
    <div className="flex h-14 w-full items-center border-b-[1px] border-gray-300 bg-white p-2 text-xl font-light">
      <div className="mx-auto flex w-[1280px] items-center justify-between">
        <span className="flex">
          <Image alt="Open EI Logo" src={openIELogo} className="h-6" />
          Open IE
        </span>
        <ConnectWallet />
      </div>
    </div>
  );
}

export default Nav;
