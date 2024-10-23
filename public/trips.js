import {
    inputEnabled,
    setDiv,
    message,
    setToken,
    token,
    enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { deleteTrip, showAddEdit } from "./addEdit.js";
//import { login } from "../controllers/auth.js";

let tripsDiv = null;
let tripsTable = null;
let tripsTableHeader = null;

export const handleTrips = () => {
    tripsDiv = document.getElementById("trips");
    const logoff = document.getElementById("logoff");
    const addTrip = document.getElementById("add-trip");
    tripsTable = document.getElementById("trips-table");
    tripsTableHeader = document.getElementById("trips-table-header");

    tripsDiv.addEventListener("click", (e) => {
        if (inputEnabled && e.target.nodeName === "BUTTON") {
            if (e.target === addTrip) {
                showAddEdit(null);
            } else if (e.target === logoff) {
                setToken(null);
                message.textContent = "You have been logged off.";
                tripsTable.replaceChildren([tripsTableHeader]);
                showLoginRegister();
            } else if (e.target.classList.contains("editButton")) {
                message.textContent = "";
                showAddEdit(e.target.dataset.id);
            } else if (e.target.classList.contains("deleteButton")) {
                message.textContent = "";
                deleteTrip(e.target.dataset.id);
            }

        }
    });
};

export const showTrips = async () => {
    try {
        enableInput(false);

        const response = await fetch("/api/v1/trips", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        let children = [tripsTableHeader];

        if (response.status === 200) {
            if (data.count === 0) {
                tripsTable.replaceChildren(...children); // clear this for safety
            } else {
                for (let i = 0; i < data.trips.length; i++) {
                    let rowEntry = document.createElement("tr");
                    let editButton = `<td><button type="button" class="editButton" data-id=${data.trips[i]._id}>edit</button></td>`;
                    let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.trips[i]._id}>delete</button></td>`;
                    let rowHTML = `
                  <td>${data.trips[i].destination}</td>
                  <td>${convertDate(data.trips[i].startDate)}</td>
                  <td>${data.trips[i].duration}</td>
                  <td>${data.trips[i].reason}</td>
                  <div>${editButton}${deleteButton}</div>`;

                    rowEntry.innerHTML = rowHTML;
                    children.push(rowEntry);
                }
                tripsTable.replaceChildren(...children);
            }
        } else {
            message.textContent = data.msg;
        }
    } catch (err) {
        console.log(err);
        message.textContent = "A communication error occurred.";
    }
    enableInput(true);
    setDiv(tripsDiv);
};

//convert date from DB format to readable
export const convertDate = (stringDate) => {
    const date = new Date(stringDate);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`

    return formattedDate;
}