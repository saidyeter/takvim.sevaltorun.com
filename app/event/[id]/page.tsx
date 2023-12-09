import Link from "next/link";
import EventForm from "@/components/event-form";
import { getEvent } from "@/lib/actions";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id)

  if (eventId.toString() != params.id) {
    return (<div className="mb-4">Hatali bilgi. Geri dönmek için&nbsp;
      <Link href="/" className="underline">tıklayınız</Link>
    </div>)
  }

  const data = await getEvent(eventId)

  return (
    <>
      <div className="mb-4">Geri dönmek için&nbsp;
        <Link href="/" className="underline">tıklayınız</Link>
      </div>
      <EventForm role="edit" defaultVal={data} id={eventId}/>
    </>
  );
}