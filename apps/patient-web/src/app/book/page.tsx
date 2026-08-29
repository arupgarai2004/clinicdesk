export default function BookPage() {
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
                    <select id="clinic" name="clinic" required>
                        <option value="">Select a clinic</option>
                        <option value="clinic1">Clinic 1</option>
                        <option value="clinic2">Clinic 2</option>
                        <option value="clinic3">Clinic 3</option>
                    </select>
                    </div>
                    <div>
                    <button type="submit">Book Appointment</button>
                    </div>
                </form>
            </div>
		</div>
	);
}
