import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showTrips, convertDate } from "./trips.js";

let addEditDiv = null;
let destination = null;
let startDate = null;
let startDate1 = null;
let duration = null;
let reason = null;
let addingTrip = null;

export const handleAddEdit = () => {
    const addEditDiv = document.getElementById("edit-trip");
    const destination = document.getElementById("destination");
    const startDate = document.getElementById("startDate");
    // startDate1 = document.getElementById("startDate1");
    const duration = document.getElementById("duration");
    const reason = document.getElementById("reason");
    const addingTrip = document.getElementById("adding-trip");
    const editCancel = document.getElementById("edit-cancel");

    addEditDiv.addEventListener("click", async (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addingTrip) {
                enableInput(false);

                let method = "POST";
                let url = "/api/v1/trips";

                if (addingTrip.textContent === "Update") {
                    method = "PATCH";
                    url = `/api/v1/trips/${addEditDiv.dataset.id}`;
                }

                try {
                    const response = await fetch(url, {
                        method: method,
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            destination: destination.value,
                            startDate: startDate.value,
                            duration: duration.value,
                            reason: reason.value,
                        }),
                    });

                    const data = await response.json();
                    console.log(response.status);
                    console.log(data);
                    if (response.status === 201 || response.status === 200) {
                        if (response.status === 201) {
                            // 201 indicates a successful create
                            message.textContent = "The trip entry was created.";
                        } else {
                            // 200 indicates a successful update
                            message.textContent = "The trip entry was updated.";

                        }
                        destination.value = "";
                        startDate.value = "";
                        duration.value = "";
                        reason.value = "leasure";

                        showTrips();
                    } else {
                        message.textContent = data.msg;
                    }
                } catch (err) {
                    // console.log(err);
                    message.textContent = "A communication error occurred.";
                }

                enableInput(true);
            } else if (e.target === editCancel) {
                message.textContent = "";
                showTrips();
            }
        }
    });
};

export const deleteTrip = async (tripId) => {
    if (!tripId) {
        message.textContent = "Trip was not found!";
        showTrips();
    } else {
        enableInput(false);

        try {
            const response = await fetch(`/api/v1/trips/${tripId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (response.status === 200) {
                message.textContent = data.msg;
                showTrips();
            }
        } 
        catch {

        }
    }
}

export const showAddEdit = async (tripId) => {
    if (!tripId) {
        destination.value = "";
        startDate.value = "";
        duration.value = "";
        reason.value = "leasure";
        addingTrip.textContent = "Add";
        message.textContent = "";

        setDiv(addEditDiv);
    } else {
        enableInput(false);

        try {
            const response = await fetch(`/api/v1/trips/${tripId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                destination.value = data.trip.destination;
                startDate.value = convertDate(data.trip.startDate);
                // console.log(convertDate(data.trip.startDate));
                // startDate1.value = data.trip.startDate;
                duration.value = data.trip.duration;
                reason.value = data.trip.reason;
                addingTrip.textContent = "Update";
                message.textContent = "";
                addEditDiv.dataset.id = tripId;

                setDiv(addEditDiv);
            } else {
                // might happen if the list has been updated since last display
                message.textContent = "The trip entry was not found";
                showTrips();
            }
        } catch (err) {
            console.log(err);
            message.textContent = "A communications error has occurred.";
            showTrips();
        }

        enableInput(true);
    }
};