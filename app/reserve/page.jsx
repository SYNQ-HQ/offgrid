import prisma from "@/lib/prisma";
import ReserveClient from "./ReserveClient";
import { Suspense } from "react";

export async function generateMetadata({ searchParams }) {
  const { eventId } = await searchParams;
  
  if (!eventId) return { title: "Reserve | OffGrid" };

  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) return { title: "Event Not Found | OffGrid" };

  return {
    title: `Reserve: ${event.title} | OffGrid`,
    description: event.description || `Join us for ${event.title} at ${event.venue}.`,
    openGraph: {
      images: event.cover_image ? [event.cover_image] : [],
    },
  };
}

export default async function ReservePage({ searchParams }) {
  const { eventId } = await searchParams;

  let event = null;
  if (eventId) {
    event = await prisma.event.findUnique({
      where: { id: eventId },
    });
  }

  // Serialize dates for client component
  const serializedEvent = event ? {
    ...event,
    date: event.date.toISOString(),
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
  } : null;

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5EDE4] flex items-center justify-center text-black/50">Loading reservation...</div>}>
      <ReserveClient event={serializedEvent} eventId={eventId} />
    </Suspense>
  );
}
