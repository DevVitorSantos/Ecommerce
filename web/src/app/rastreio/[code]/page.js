import Tracking from "@/components/Tracking";

export default async function TrackingPage({ params }) {
  const { code } = await params;
  return (
    <div className="mx-auto max-w-lg px-4 py-10">
      <Tracking code={decodeURIComponent(code)} />
    </div>
  );
}
