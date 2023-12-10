import Link from "next/link";
import EventForm from "@/components/event-form";
import { getEvent } from "@/lib/actions";
import DeleteButton from "@/components/delete-button";

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
      <div className="mb-4 flex justify-between">
        <span>
          Geri dönmek için&nbsp;
          <Link href="/" className="underline">tıklayınız</Link>
        </span>
        <span>
          <DeleteButton id={eventId} />
        </span>
      </div>
      <EventForm role="edit" defaultVal={data} id={eventId} />
    </>
  );
}