// Server component — holds generateStaticParams so static export works
import AreaDetailsClient from "./AreaDetailsClient";

export function generateStaticParams() {
  return [
    { id: "1" }, { id: "2" }, { id: "3" }, { id: "4" }, { id: "5" },
    { id: "downtown" }, { id: "uptown" }, { id: "port" }, { id: "midtown" },
  ];
}

export default function AreaDetailsPage() {
  return <AreaDetailsClient />;
}
