const express = require("express");

const cors = require("cors");

const http = require("http");

const axios = require("axios");

const { Server } = require("socket.io");

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let activeIPs = new Set();

let suspiciousIPs = {};

async function getIPInfo(ip) {

  try {

    const response =
      await axios.get(

        `http://ip-api.com/json/${ip}`

      );

    return {

      country:
        response.data.country,

      city:
        response.data.city,

      isp:
        response.data.isp,

    };

  } catch {

    return {

      country: "Unknown",

      city: "Unknown",

      isp: "Unknown",

    };

  }

}

app.get("/", (req, res) => {

  res.send(
    "CipherNet Sentinel Backend Running 🚀"
  );

});

io.on("connection", (socket) => {

  console.log("Client Connected");

  socket.on(
    "traffic-data",

    async (data) => {

      activeIPs.add(data.source);

      if (data.suspicious) {

        suspiciousIPs[data.source] =
          (
            suspiciousIPs[data.source] || 0
          ) + 1;

      }

      const geoInfo =
        await getIPInfo(
          data.destination
        );

      const dashboardData = {

        packet: {

          ...data,

          geoInfo,

        },

        activeDevices:
          activeIPs.size,

        suspiciousIPs,

      };

      io.emit(
        "live-traffic",
        dashboardData
      );

    }

  );

});

const PORT = 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});