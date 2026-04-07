import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { RadioWidget } from "@/components/widgets/RadioWidget";
import { FavoritesWidget } from "@/components/widgets/FavoritesWidget";
import { NewsWidget } from "@/components/widgets/NewsWidget";

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-lg px-4 flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <WeatherWidget />
        <RadioWidget />
      </div>
      <FavoritesWidget />
      <NewsWidget />
    </div>
  );
}
