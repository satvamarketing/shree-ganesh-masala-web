import { formattedAddress } from "@/data/site";

/**
 * The design wants a map screenshot; none exists. An OpenStreetMap embed needs
 * no API key and loads no third-party tracking script, unlike a Google Maps
 * embed. The bounding box frames Success St, Acacia Ridge.
 */
const BBOX = "153.019,-27.596,153.045,-27.578";
const MARKER = "-27.5874,153.0323";

export function StaticMap() {
  const directions = `https://www.openstreetmap.org/search?query=${encodeURIComponent(
    `${formattedAddress()}, Australia`,
  )}`;

  return (
    <div>
      <div className="h-[240px] overflow-hidden rounded-[18px] border border-line bg-sand-deep">
        <iframe
          title="Map of the Shree Ganesh warehouse in Acacia Ridge"
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${BBOX}&layer=mapnik&marker=${MARKER}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      <a
        href={directions}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-[14px] font-bold text-red hover:text-red-dark"
      >
        Get directions →
      </a>
    </div>
  );
}
