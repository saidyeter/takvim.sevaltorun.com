import DeleteButton from "@/components/delete-button";
import EventForm from "@/components/event-form";
import { getEvent } from "@/lib/actions";
import Link from "next/link";

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const eventId = parseInt(params.id)

  if (eventId.toString() != params.id) {
    return (<div className="mb-4">Hatali bilgi. Geri dönmek için&nbsp;
      <Link href="/" className="underline">tıklayınız</Link>
    </div>)
  }

  const data = await getEvent(eventId)
  if (!data) {
    return (<div className="mb-4">Hatali bilgi. Geri dönmek için&nbsp;
      <Link href="/" className="underline">tıklayınız</Link>
    </div>)
  }

  return (
    <>
      <div className="mb-4 flex justify-between">
        <span>
          Geri dönmek için&nbsp;
          <Link href="/" className="underline">tıklayınız</Link>
        </span>
        <span>
          <DeleteButton id={eventId} />
        </span>
      </div>
      <EventForm role="edit" defaultVal={{
        starts: data.starts_at,
        ends: data.ends_at,
        desc: data.desc
      }} id={eventId} />
    </>
  );
}