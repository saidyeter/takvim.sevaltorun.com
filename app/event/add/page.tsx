import EventForm from "@/components/event-form";
import Link from "next/link";

export default async function AddEventPage() {

  return (
    <>
      <div className="mb-4">Geri dönmek için&nbsp;
        <Link href="/" className="underline">tıklayınız</Link>
      </div>
      <EventForm role="add" />
    </>
  );
}