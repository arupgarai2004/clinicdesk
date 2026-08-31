'use client';

import { useParams } from "next/navigation";


export default function BookPage() {
      const { clinicId } = useParams<{ clinicId: string }>();

	return (
		<div>
			<h1>Book an Appointment</h1>
            <div>
                <form>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" required />
                    </div>
                   <div>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" required />
                    </div>
                   <div>
                        <label htmlFor="date">Date:</label>
                        <input type="date" id="date" name="date" required />
                    </div>
                    <div>
                        <label htmlFor="time">Time:</label>
                        <input type="time" id="time" name="time" required />
                    </div>
                   <div>
                        <label htmlFor="reason">Reason for Appointment:</label>
                        <textarea id="reason" name="reason" required></textarea>
                    </div>
                   <div>
                    <label htmlFor="clinic">Clinic:</label>
                    <div>{clinicId}</div>
                    </div>
                    <div>
                    <button type="submit">Book Appointment</button>
                    </div>
                </form>
            </div>
		</div>
	);
}
