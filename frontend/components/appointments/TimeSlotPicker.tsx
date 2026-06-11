"use client";

import type {
	AppointmentAvailabilitySlot,
} from "@/types/appointment";

type Props = {
	slots: AppointmentAvailabilitySlot[];

	selectedTime:
		| string
		| null;

	onSelect: (
		time: string
	) => void;
};

export default function TimeSlotPicker({
	slots,
	selectedTime,
	onSelect,
}: Props) {
	const filteredSlots =
		slots.filter(
			(slot) => {
				const hour =
					Number(
						slot.time.split(
							":"
						)[0]
					);

				return (
					hour >=
						9 &&
					hour <=
						22
				);
			}
		);

	return (
		<div
			style={{
				display:
					"grid",
				gridTemplateColumns:
					"repeat(auto-fill, minmax(120px, 1fr))",
				gap: "12px",
			}}
		>
			{filteredSlots.map(
				(slot) => {
					const isSelected =
						selectedTime ===
						slot.time;

					return (
						<button
							key={
								slot.time
							}
							disabled={
								!slot.available
							}
							onClick={() =>
								onSelect(
									slot.time
								)
							}
							style={{
								height:
									"52px",
								borderRadius:
									"16px",
								cursor:
									slot.available
										? "pointer"
										: "not-allowed",

								border:
									isSelected
										? "1px solid rgba(56,189,248,0.28)"
										: "1px solid rgba(255,255,255,0.08)",

								background:
									isSelected
										? "rgba(56,189,248,0.14)"
										: "rgba(255,255,255,0.03)",

								color:
									slot.available
										? "#d9e7f5"
										: "#536579",

								opacity:
									slot.available
										? 1
										: 0.5,

								boxShadow:
									isSelected
										? "0 0 22px rgba(56,189,248,0.16)"
										: "none",

								transition:
									"all 0.25s ease",
							}}
						>
							{new Date(
								`1970-01-01T${slot.time}`
							).toLocaleTimeString(
								"en-IN",
								{
									hour:
										"2-digit",
									minute:
										"2-digit",
								}
							)}
						</button>
					);
				}
			)}
		</div>
	);
}