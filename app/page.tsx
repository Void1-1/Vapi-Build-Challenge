import DesktopHUD_UI from "@/components/DesktopHUD";
import MobileHUD_UI from "@/components/mobile/MobileHUD";
import SplashScreen from "@/components/SplashScreen";

export default function FridayAIUI() {
  return (
    <>
      <SplashScreen />

      {/* Show Mobile UI below 1000px */}
      <div className="block lg:hidden">
        <MobileHUD_UI />
      </div>

      {/* Show Desktop UI at 1000px and above */}
      <div className="hidden lg:block">
        <DesktopHUD_UI />
      </div>
    </>
  );
}
