"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { supabase } from "./supabase";
import { revalidatePath } from "next/cache";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

const regexNationalID = /^[a-zA-Z0-9]{6,13}$/;

// updating guest profile
export async function updateGuest(formData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");

  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!regexNationalID.test(nationalID))
    throw new Error("Please provide a valid national ID");

  const updateData = { nationality, countryFlag, nationalID };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user?.guestId);

  if (error) throw new Error("Guest could not be updated");

  revalidatePath("/account/profile");
}

// creating a booking or reservation
export async function createReservation(bookingData, breakfastPrice, formData) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");

  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations").slice(0, 1000);
  const hasBreakfast = formData.get("hasBreakfast") === "on" ? true : false;
  const extrasPrice = hasBreakfast
    ? breakfastPrice * numGuests * (bookingData.numNights + 1)
    : 0;

  const newBooking = {
    ...bookingData,
    guestId: session?.user?.guestId,
    numGuests,
    observations,
    hasBreakfast,
    extrasPrice,
    isPaid: false,
    totalPrice: hasBreakfast
      ? bookingData.cabinPrice + extrasPrice
      : bookingData.cabinPrice,
    status: "unconfirmed",
  };

  // console.log(newBooking);

  const { data, error } = await supabase.from("bookings").insert([newBooking]);

  if (error) throw new Error("Booking could not be created");

  revalidatePath(`/cabins/${bookingData.cabinId}`);

  redirect("/cabins/thankyou");
}

// deleting a reservation
export async function deleteReservation(bookingId) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");

  const guestBookings = await getBookings(session?.user?.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to delete this booking Booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) throw new Error("Booking could not be deleted");

  revalidatePath("/account/reservations");
}

// updating reservation/booking
export async function updateReservation(formData) {
  // 1) Authentication
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("You must be logged in");

  // 2) Authorization
  const guestBookings = await getBookings(session?.user?.guestId);
  const guestBookingIds = guestBookings.map((booking) => booking.id);

  const bookingId = Number(formData.get("bookingId"));

  if (!guestBookingIds.includes(bookingId))
    throw new Error("You are not allowed to edit this booking Booking");

  // 3) building update data
  const numGuests = Number(formData.get("numGuests"));
  const observations = formData.get("observations").slice(0, 1000);

  const updateData = { numGuests, observations };

  // 4) Mutations
  const { error } = await supabase
    .from("bookings")
    .update(updateData)
    .eq("id", bookingId);

  // 5) Error handling
  if (error) throw new Error("Booking could not be updated");

  // 6) Revalidating
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  revalidatePath("/account/reservations");

  // 7) Redirecting
  redirect("/account/reservations");
}
