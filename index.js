const express = require("express");
const dotenv = require("dotenv");
const app = express();
app.use(express.json());

dotenv.config(); 
const PORT = 5000;

const rooms = [
    {
        roomID: 0,
        roomName: "100",
        noOfSeatsAvailable: "2",
        amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
        pricePerHr: 200,
        bookedStatus: false,
        customerDetails: {
          customerName: "",
          date: "",
          startTime: "",
          endTime: "",
        },
      },
      {
        roomID: 1,
        roomName: "101",
        noOfSeatsAvailable: "2",
        amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
        pricePerHr: 200,
        bookedStatus: true,
        customerDetails: {
          customerName: "Rajesh",
          date: "16/06/2023",
          startTime: 1100,
          endTime: 1800,
        },
      },
      {
        roomID: 2,
        roomName: "102",
        noOfSeatsAvailable: "2",
        amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
        pricePerHr: 200,
        bookedStatus: false,
        customerDetails: {
          customerName: "Mallesh",
          date: "18/07/2023",
          startTime: 1000,
          endTime: 1800,
        },
      },
      {
        roomID: 3,
        roomName: "103",
        noOfSeatsAvailable: "2",
        amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
        pricePerHr: 200,
        bookedStatus: false,
        customerDetails: {
          customerName: "",
          date: "",
          startTime: "",
          endTime: "",
        },
      },
      {
        roomID: 4,
        roomName: "104",
        noOfSeatsAvailable: "2",
        amenities: ["Hot shower", "WIFI", "Intercom", "Room service"],
        pricePerHr: 200,
        bookedStatus: false,
        customerDetails: {
          customerName: "Priya",
          date: "16/11/2022",
          startTime: 1200,
          endTime: 2000,
        },
      },
];

app.get("/", (req, res) => {
  res.send("Hall Booking API");
});

//Creating a room
app.post("/rooms/create", (req, res) => {
  const newRoom = req.body;
  rooms.push(newRoom);
  res.send(newRoom);
});

// Booking a room
app.post("/rooms", (req, res) => {
  const booking = req.body;

  const roomToUpdate = rooms.find(room => room.roomID === booking.roomID);

  if (!roomToUpdate) {
    res.status(404).send("Room not found");
    return;
  }

  const bookingDate = new Date(booking.date);
  const isRoomAlreadyBooked = rooms.some(room => {
    if (
      room.bookedStatus &&
      room.customerDetails.date === bookingDate.toISOString() &&
      room.customerDetails.startTime <= booking.endTime &&
      room.customerDetails.endTime >= booking.startTime
    ) {
      return true;
    }
    return false;
  });

  if (isRoomAlreadyBooked) {
    res.send("Room already booked for that date and time");
    return;
  }

  roomToUpdate.customerDetails.customerName = booking.customerName;
  roomToUpdate.customerDetails.date = bookingDate.toISOString();
  roomToUpdate.customerDetails.startTime = booking.startTime;
  roomToUpdate.customerDetails.endTime = booking.endTime;
  roomToUpdate.bookedStatus = true;

  res.send("Room booked successfully");
});

//List all rooms with booked data
app.get("/rooms", (req, res) => {
  res.send(
    rooms.map(room => ({
      "Room name": room.roomName,
      "Booked Status": room.bookedStatus ? "Booked" : "Vacant",
      "Customer Name": room.customerDetails.customerName,
      "Date": room.customerDetails.date,
      "Start Time": room.customerDetails.startTime,
      "End Time": room.customerDetails.endTime,
    }))
  );
});

//List all customers with booked data
app.get("/customers", (req, res) => {
  res.send(
    rooms
      .filter(room => room.bookedStatus)
      .map(room => ({
        "Customer name": room.customerDetails.customerName,
        "Room name": room.roomName,
        Date: room.customerDetails.date,
        "Start Time": room.customerDetails.startTime,
        "End Time": room.customerDetails.endTime,
      }))
  );
});

app.listen(PORT, () => console.log("Server has started at:", PORT));